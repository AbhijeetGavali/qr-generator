import { useState, useCallback, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdSlot } from "@/components/AdSlot";
import { useToast } from "@/hooks/use-toast";
import {
  Zap,
  Diamond,
  Gift,
  Link,
  Download,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Settings,
  History,
  Share2,
  Trash2,
} from "lucide-react";
import UseCasesSection from "@/components/UseCasesSection";

interface QRHistoryItem {
  id: string;
  url: string;
  dataUrl: string;
  timestamp: number;
  options: {
    fgColor: string;
    bgColor: string;
    size: number;
    errorCorrection: "H";
    logoSize?: number;
    logoShape?: "square" | "rounded" | "circle";
    logoDataUrl?: string; // 🔑 store logo image
  };
}

const HISTORY_STORAGE_KEY = "qr-generator-history";
const MAX_LOGO_RATIO = 0.3;
const MIN_QR_LOGO_PADDING = 50;

const getMaxLogoSize = (qrSize: number) => Math.floor(qrSize * MAX_LOGO_RATIO);

const isQrSizeSafeForLogo = (qrSize: number, logoSize: number) =>
  qrSize >= logoSize + MIN_QR_LOGO_PADDING;

export default function Home() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSize, setLogoSize] = useState(60); // px
  const [logoShape, setLogoShape] = useState<"square" | "rounded" | "circle">(
    "rounded",
  );
  const [size, setSize] = useState(300);
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  const saveToHistory = useCallback(
    (url: string, dataUrl: string, options: QRHistoryItem["options"]) => {
      const newItem: QRHistoryItem = {
        id: Date.now().toString(),
        url,
        dataUrl,
        timestamp: Date.now(),
        options,
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev.slice(0, 19)];
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    toast({
      title: "History Cleared",
      description: "Your QR code history has been deleted.",
    });
  }, [toast]);

  const loadFromHistory = useCallback(
    async (item: QRHistoryItem) => {
      setUrl(item.url);
      setQrDataUrl(item.dataUrl);
      setFgColor(item.options.fgColor);
      setBgColor(item.options.bgColor);
      setSize(item.options.size);

      if (
        item.options.logoSize &&
        item.options.logoShape &&
        item.options.logoDataUrl
      ) {
        setLogoSize(item.options.logoSize);
        setLogoShape(item.options.logoShape);

        const res = await fetch(item.options.logoDataUrl);
        const blob = await res.blob();
        const file = new File([blob], "logo.png", { type: blob.type });
        setLogoFile(file);
      } else {
        setLogoFile(null);
      }

      setActiveTab("generate");

      toast({
        title: "QR Code Loaded",
        description: "Settings restored from history.",
      });
    },
    [toast],
  );

  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const generateQRCode = useCallback(async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (logoFile) {
      const maxLogo = getMaxLogoSize(size);

      if (logoSize > maxLogo) {
        toast({
          title: "Logo too large",
          description: `Logo reduced to ${maxLogo}px for scan safety.`,
          variant: "destructive",
        });
        setLogoSize(maxLogo);
        return;
      }

      if (!isQrSizeSafeForLogo(size, logoSize)) {
        toast({
          title: "QR size too small",
          description: `Increase QR size to at least ${
            logoSize + MIN_QR_LOGO_PADDING
          }px.`,
          variant: "destructive",
        });
        return;
      }
    }

    let processedUrl = url.trim();
    if (!processedUrl.startsWith("http")) {
      processedUrl = "https://" + processedUrl;
    }

    if (!isValidUrl(processedUrl)) {
      setError("Invalid URL");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const canvas = canvasRef.current!;
      await QRCode.toCanvas(canvas, processedUrl, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: "H",
      });

      if (logoFile) {
        const ctx = canvas.getContext("2d")!;
        const logo = new Image();
        logo.src = URL.createObjectURL(logoFile);
        await new Promise((res) => (logo.onload = res));

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const padding = 6;
        const bgSize = logoSize + padding * 2;

        ctx.save();

        /* ========= BACKGROUND MASK ========= */
        ctx.beginPath();
        if (logoShape === "circle") {
          ctx.arc(centerX, centerY, bgSize / 2, 0, Math.PI * 2);
        } else if (logoShape === "rounded") {
          ctx.roundRect(
            centerX - bgSize / 2,
            centerY - bgSize / 2,
            bgSize,
            bgSize,
            10,
          );
        } else {
          ctx.rect(centerX - bgSize / 2, centerY - bgSize / 2, bgSize, bgSize);
        }

        ctx.clip();

        ctx.fillStyle = bgColor;
        ctx.fillRect(
          centerX - bgSize / 2,
          centerY - bgSize / 2,
          bgSize,
          bgSize,
        );

        /* ========= LOGO MASK ========= */
        ctx.beginPath();
        if (logoShape === "circle") {
          ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
        } else if (logoShape === "rounded") {
          ctx.roundRect(
            centerX - logoSize / 2,
            centerY - logoSize / 2,
            logoSize,
            logoSize,
            8,
          );
        } else {
          ctx.rect(
            centerX - logoSize / 2,
            centerY - logoSize / 2,
            logoSize,
            logoSize,
          );
        }

        ctx.clip();

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          logo,
          centerX - logoSize / 2,
          centerY - logoSize / 2,
          logoSize,
          logoSize,
        );

        ctx.restore();
      }

      const finalDataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(finalDataUrl);

      let logoDataUrl: string | undefined;

      if (logoFile) {
        logoDataUrl = await fileToDataUrl(logoFile);
      }

      saveToHistory(processedUrl, finalDataUrl, {
        fgColor,
        bgColor,
        size,
        errorCorrection: "H",
        logoSize: logoFile ? logoSize : undefined,
        logoShape: logoFile ? logoShape : undefined,
        logoDataUrl: logoFile ? logoDataUrl : undefined,
      });

      toast({
        title: "QR Code Generated",
        description: "QR with logo generated successfully.",
      });
    } catch (err) {
      setError("Failed to generate QR code.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [url, fgColor, bgColor, size, logoFile, logoSize, logoShape, toast]);

  const downloadAs = useCallback(
    async (format: "png" | "svg" | "jpeg") => {
      if (!url.trim()) return;

      let processedUrl = url.trim();
      if (
        !processedUrl.startsWith("http://") &&
        !processedUrl.startsWith("https://")
      ) {
        processedUrl = "https://" + processedUrl;
      }

      try {
        let dataUrl: string;
        let filename: string;

        if (format === "svg") {
          dataUrl = await QRCode.toString(processedUrl, {
            type: "svg",
            width: size,
            margin: 2,
            color: {
              dark: fgColor,
              light: bgColor,
            },
            errorCorrectionLevel: "H",
          });
          const blob = new Blob([dataUrl], { type: "image/svg+xml" });
          dataUrl = URL.createObjectURL(blob);
          filename = "qrcode.svg";
        } else {
          dataUrl = await QRCode.toDataURL(processedUrl, {
            width: size,
            margin: 2,
            color: {
              dark: fgColor,
              light: bgColor,
            },
            errorCorrectionLevel: "H",
            type: format === "jpeg" ? "image/jpeg" : "image/png",
          });
          filename = format === "jpeg" ? "qrcode.jpg" : "qrcode.png";
        }

        const link = document.createElement("a");
        const canvas = canvasRef.current!;
        link.download = filename;
        link.href = canvas.toDataURL(
          format === "jpeg" ? "image/jpeg" : "image/png",
        );
        link.click();

        if (format === "svg") {
          URL.revokeObjectURL(dataUrl);
        }

        toast({
          title: "Download Started",
          description: `Your QR code is being downloaded as ${format.toUpperCase()}.`,
        });
      } catch (err) {
        toast({
          title: "Download Failed",
          description: "Unable to download QR code. Please try again.",
          variant: "destructive",
        });
      }
    },
    [url, fgColor, bgColor, size, toast],
  );

  const copyToClipboard = useCallback(async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "QR code image copied successfully.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please download instead.",
        variant: "destructive",
      });
    }
  }, [qrDataUrl, toast]);

  const shareQRCode = useCallback(async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code",
          text: `QR Code for: ${url}`,
          files: [file],
        });
        toast({
          title: "Shared",
          description: "QR code shared successfully.",
        });
      } else {
        await copyToClipboard();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast({
          title: "Share Failed",
          description: "Unable to share. Image copied to clipboard instead.",
          variant: "destructive",
        });
        await copyToClipboard();
      }
    }
  }, [qrDataUrl, url, copyToClipboard, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateQRCode();
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Generation",
      description:
        "Create QR codes in milliseconds with our lightning-fast generator.",
    },
    {
      icon: Diamond,
      title: "High Quality",
      description: "Crystal clear QR codes that scan perfectly every time.",
    },
    {
      icon: Gift,
      title: "Free Forever",
      description: "No hidden fees, no signup required. 100% free to use.",
    },
  ];

  const steps = [
    { number: "1", title: "Paste URL", description: "Enter any link or URL" },
    { number: "2", title: "Customize", description: "Choose colors and size" },
    {
      number: "3",
      title: "Generate",
      description: "Click the generate button",
    },
    { number: "4", title: "Download", description: "Save in multiple formats" },
  ];

  return (
    <div className="flex gap-6 md:gap-8 items-start mx-auto">
      <div className="md:grid grid-rows-5 gap-6 h-screen hidden overflow-hidden sticky top-0 mx-1 py-3">
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
      </div>
      <div className="bg-background mx-auto">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
            <a href="/" data-testid="home-link">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold" data-testid="text-brand">
                  QRGen
                </span>
              </div>
            </a>
          </div>
        </header>
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 gap-4 p-4 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-foreground rounded-sm aspect-square"
                />
              ))}
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1
                className="text-4xl md:text-5xl font-bold mb-4"
                data-testid="text-headline"
              >
                Generate QR Codes Instantly
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform any URL into a scannable QR code in seconds. Customize
                colors, size, and download in multiple formats.
              </p>
            </div>

            <div className="flex flex-col gap-6 order-first md:order-none">
              <Card className="p-6 md:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="generate" data-testid="tab-generate">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate
                    </TabsTrigger>
                    <TabsTrigger value="history" data-testid="tab-history">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="generate" className="space-y-6">
                    <div className="xl:flex">
                      <div className="flex-1">
                        <div className="space-y-4">
                          <Label
                            htmlFor="url-input"
                            className="flex items-center gap-2"
                          >
                            <Link className="w-4 h-4" />
                            Enter URL
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                              id="url-input"
                              type="text"
                              placeholder="Paste your URL here..."
                              value={url}
                              onChange={(e) => {
                                setUrl(e.target.value);
                                setError(null);
                              }}
                              onKeyDown={handleKeyDown}
                              className="flex-1"
                              data-testid="input-url"
                              aria-describedby={error ? "url-error" : undefined}
                            />
                            <Button
                              onClick={generateQRCode}
                              disabled={isGenerating}
                              className="min-w-[140px]"
                              data-testid="button-generate"
                            >
                              {isGenerating ? "Generating..." : "Generate QR"}
                            </Button>
                          </div>
                          {error && (
                            <p
                              id="url-error"
                              className="text-sm text-destructive"
                              data-testid="text-error"
                            >
                              {error}
                            </p>
                          )}
                        </div>

                        <div className="border-border pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Customization
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fg-color">QR Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="fg-color"
                                  type="color"
                                  value={fgColor}
                                  onChange={(e) => setFgColor(e.target.value)}
                                  className="w-12 h-9 p-1 cursor-pointer"
                                  data-testid="input-fg-color"
                                />
                                <Input
                                  type="text"
                                  value={fgColor}
                                  onChange={(e) => setFgColor(e.target.value)}
                                  className="flex-1 font-mono text-sm"
                                  data-testid="input-fg-color-text"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bg-color">Background</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="bg-color"
                                  type="color"
                                  value={bgColor}
                                  onChange={(e) => setBgColor(e.target.value)}
                                  className="w-12 h-9 p-1 cursor-pointer"
                                  data-testid="input-bg-color"
                                />
                                <Input
                                  type="text"
                                  value={bgColor}
                                  onChange={(e) => setBgColor(e.target.value)}
                                  className="flex-1 font-mono text-sm"
                                  data-testid="input-bg-color-text"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <Label>Size: {size}px</Label>
                            <Slider
                              value={[size]}
                              onValueChange={([val]) => setSize(val)}
                              min={300}
                              max={500}
                              step={50}
                              className="w-full"
                              data-testid="slider-size"
                            />
                          </div>

                          <div className="space-y-3 mt-4">
                            <Label>Add Logo</Label>

                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setLogoFile(e.target.files?.[0] || null)
                              }
                            />
                          </div>
                          <div className="space-y-3 mt-4">
                            <Label>Logo Size: {logoSize}px</Label>
                            <Slider
                              value={[logoSize]}
                              min={30}
                              max={getMaxLogoSize(size)}
                              step={10}
                              onValueChange={([v]) => setLogoSize(v)}
                            />
                          </div>
                          <div className="space-y-3 mt-4">
                            <Label>Logo Shape</Label>
                            <div className="flex gap-2">
                              {["square", "rounded", "circle"].map((shape) => (
                                <Button
                                  key={shape}
                                  type="button"
                                  size="sm"
                                  variant={
                                    logoShape === shape ? "default" : "outline"
                                  }
                                  onClick={() => setLogoShape(shape as any)}
                                >
                                  {shape}
                                </Button>
                              ))}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Max logo size: {getMaxLogoSize(size)}px (30% of
                              QR)
                            </p>
                          </div>
                        </div>
                      </div>

                      <Card className="p-6 md:p-8">
                        <div className="flex flex-col items-center">
                          {qrDataUrl ? (
                            <>
                              <div className="rounded-lg shadow-sm mb-6">
                                <img
                                  src={qrDataUrl}
                                  alt="Generated QR Code"
                                  className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                                  data-testid="img-qrcode"
                                />
                              </div>
                              <div className="flex flex-wrap gap-2 justify-center mb-4">
                                <Button
                                  onClick={() => downloadAs("png")}
                                  size="sm"
                                  data-testid="button-download-png"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  PNG
                                </Button>
                                <Button
                                  onClick={() => downloadAs("svg")}
                                  size="sm"
                                  variant="outline"
                                  data-testid="button-download-svg"
                                  disabled={!!logoFile}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  SVG
                                </Button>
                                <Button
                                  onClick={() => downloadAs("jpeg")}
                                  size="sm"
                                  variant="outline"
                                  data-testid="button-download-jpeg"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  JPEG
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 justify-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={copyToClipboard}
                                  data-testid="button-copy"
                                >
                                  {copied ? (
                                    <>
                                      <Check className="w-4 h-4 mr-2" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={shareQRCode}
                                  data-testid="button-share"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center py-8 text-center">
                              <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4">
                                <QrCode className="w-16 h-16 text-muted-foreground/50" />
                              </div>
                              <p
                                className="text-muted-foreground"
                                data-testid="text-empty-state"
                              >
                                Your QR code will appear here
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    {history.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {history.length} saved QR code
                            {history.length !== 1 ? "s" : ""}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            data-testid="button-clear-history"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
                          {history.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => loadFromHistory(item)}
                              className="p-2 bg-muted rounded-md hover-elevate active-elevate-2 text-left"
                              data-testid={`history-item-${item.id}`}
                            >
                              <img
                                src={item.dataUrl}
                                alt="QR Code"
                                className="w-full aspect-square rounded-sm mb-2"
                              />
                              <p className="text-xs truncate">{item.url}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p
                          className="text-muted-foreground"
                          data-testid="text-no-history"
                        >
                          No QR codes generated yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your generated QR codes will appear here
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </section>
        <AdSlot size="leaderboard" className="py-6 px-4" adSlot="6997057063" />
        <UseCasesSection />
        <AdSlot size="leaderboard" className="py-6 px-4" adSlot="6997057063" />
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2
              className="text-2xl md:text-3xl font-semibold text-center mb-12"
              data-testid="text-how-it-works"
            >
              How It Works
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3
                    className="font-semibold mb-1"
                    data-testid={`text-step-title-${index}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid={`text-step-desc-${index}`}
                  >
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-5 top-5 text-muted-foreground/40 w-5 h-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <AdSlot size="leaderboard" className="py-6 px-4" adSlot="6997057063" />
        <section className="py-16 md:py-20 bg-card">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2
              className="text-2xl md:text-3xl font-semibold text-center mb-12"
              data-testid="text-features-heading"
            >
              Why Choose Our QR Generator?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover-elevate">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    data-testid={`text-feature-title-${index}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm"
                    data-testid={`text-feature-desc-${index}`}
                  >
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <AdSlot size="leaderboard" className="py-6 px-4" adSlot="6997057063" />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <footer className="border-t border-border py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <a href="/" data-testid="home-link">
                <div className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-primary" />
                  <span className="font-semibold">QRGen</span>
                </div>
              </a>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
                <a
                  href="/privacy-policy"
                  className="hover:text-foreground transition-colors"
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="hover:text-foreground transition-colors"
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
                <a
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                  data-testid="link-contact"
                >
                  Contact
                </a>
              </div>
              <p
                className="text-sm text-muted-foreground"
                data-testid="text-copyright"
              >
                {new Date().getFullYear()} QRGen. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="md:grid grid-rows-5 gap-6 h-screen hidden overflow-hidden sticky top-0 mx-1 py-3">
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
        <AdSlot size="rectangle" className="self-center" adSlot="" />
      </div>
    </div>
  );
}
