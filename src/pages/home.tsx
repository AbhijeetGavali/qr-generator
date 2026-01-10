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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type QRType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "sms"
  | "whatsapp"
  | "event"
  | "location";

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
    qrType: QRType;
    payload: string;
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

  const [qrType, setQrType] = useState<QRType>("url");
  const [textValue, setTextValue] = useState("");

  const [wifi, setWifi] = useState({
    ssid: "",
    password: "",
    encryption: "WPA", // WPA | WEP | nopass
    hidden: false,
  });

  const [vcard, setVcard] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    website: "",
  });

  const [email, setEmail] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const [sms, setSms] = useState({
    phone: "",
    message: "",
  });

  const [whatsapp, setWhatsapp] = useState({
    phone: "",
    message: "",
  });

  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    start: "",
    end: "",
  });

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });

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
      const { qrType, payload } = item.options;

      setQrType(qrType);
      setQrDataUrl(item.dataUrl);
      setFgColor(item.options.fgColor);
      setBgColor(item.options.bgColor);
      setSize(item.options.size);

      /* ===== Restore form data ===== */
      switch (qrType) {
        case "url":
          setUrl(payload);
          break;

        case "text":
          setTextValue(payload);
          break;

        case "wifi": {
          const match = payload.match(/WIFI:T:(.*);S:(.*);P:(.*);H:(.*);;/);
          if (match) {
            setWifi({
              encryption: match[1],
              ssid: match[2],
              password: match[3],
              hidden: match[4] === "true",
            });
          }
          break;
        }

        case "email": {
          const url = new URL(payload);
          setEmail({
            to: url.pathname,
            subject: url.searchParams.get("subject") || "",
            body: url.searchParams.get("body") || "",
          });
          break;
        }

        case "sms": {
          const [, phone, message] = payload.match(/SMSTO:(.*?):(.*)/) || [];
          setSms({ phone: phone || "", message: message || "" });
          break;
        }

        case "whatsapp": {
          const url = new URL(payload);
          setWhatsapp({
            phone: url.pathname.replace("/", ""),
            message: url.searchParams.get("text") || "",
          });
          break;
        }

        case "event":
          setEvent((prev) => ({ ...prev })); // iCal parsing optional
          break;

        case "location": {
          const [, lat, lng] = payload.match(/geo:(.*),(.*)/) || [];
          setLocation({ lat: lat || "", lng: lng || "" });
          break;
        }
      }

      /* ===== Restore logo ===== */
      if (
        item.options.logoSize &&
        item.options.logoShape &&
        item.options.logoDataUrl
      ) {
        setLogoSize(item.options.logoSize);
        setLogoShape(item.options.logoShape);

        const res = await fetch(item.options.logoDataUrl);
        const blob = await res.blob();
        setLogoFile(new File([blob], "logo.png", { type: blob.type }));
      } else {
        setLogoFile(null);
      }

      setActiveTab("generate");

      toast({
        title: "QR Code Loaded",
        description: "QR code and settings restored.",
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

  const buildQrPayload = (type: QRType, data: any): string => {
    switch (type) {
      case "email":
        return `mailto:${data.to}?subject=${encodeURIComponent(
          data.subject,
        )}&body=${encodeURIComponent(data.body)}`;

      case "sms":
        return `SMSTO:${data.phone}:${data.message}`;

      case "whatsapp":
        return `https://wa.me/${data.phone}?text=${encodeURIComponent(
          data.message,
        )}`;

      case "event":
        return `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${data.title}
DESCRIPTION:${data.description}
LOCATION:${data.location}
DTSTART:${data.start}
DTEND:${data.end}
END:VEVENT
END:VCALENDAR
      `.trim();

      case "location":
        return `geo:${data.lat},${data.lng}`;

      // existing cases stay unchanged
      default:
        return "";
    }
  };

  const generateQRCode = useCallback(async () => {
    /* ================= LOGO SAFETY ================= */
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

    /* ================= BUILD PAYLOAD ================= */
    let payload = "";

    try {
      switch (qrType) {
        case "url": {
          let processedUrl = url.trim();
          if (!processedUrl.startsWith("http")) {
            processedUrl = "https://" + processedUrl;
          }
          if (!isValidUrl(processedUrl)) {
            setError("Invalid URL");
            return;
          }
          payload = processedUrl;
          break;
        }

        case "text": {
          if (!textValue.trim()) {
            setError("Text cannot be empty");
            return;
          }
          payload = textValue;
          break;
        }

        case "wifi": {
          if (!wifi.ssid) {
            setError("WiFi SSID is required");
            return;
          }
          payload = buildQrPayload("wifi", wifi);
          break;
        }

        case "vcard": {
          if (!vcard.firstName && !vcard.lastName) {
            setError("Name is required for vCard");
            return;
          }
          payload = buildQrPayload("vcard", vcard);
          break;
        }

        case "email": {
          if (!email.to) {
            setError("Recipient email is required");
            return;
          }
          payload = buildQrPayload("email", email);
          break;
        }

        case "sms": {
          if (!sms.phone) {
            setError("Phone number is required");
            return;
          }
          payload = buildQrPayload("sms", sms);
          break;
        }

        case "whatsapp": {
          if (!whatsapp.phone) {
            setError("WhatsApp number is required");
            return;
          }
          payload = buildQrPayload("whatsapp", whatsapp);
          break;
        }

        case "event": {
          if (!event.title || !event.start || !event.end) {
            setError("Event title, start, and end time are required");
            return;
          }
          payload = buildQrPayload("event", event);
          break;
        }

        case "location": {
          if (!location.lat || !location.lng) {
            setError("Latitude and longitude are required");
            return;
          }
          payload = buildQrPayload("location", location);
          break;
        }

        default:
          setError("Unsupported QR type");
          return;
      }
    } catch {
      setError("Invalid QR data");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      /* ================= GENERATE QR ================= */
      const canvas = canvasRef.current!;
      await QRCode.toCanvas(canvas, payload, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: "H",
      });

      /* ================= LOGO DRAW ================= */
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

        // Background mask
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

        // Logo mask
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

      /* ================= FINALIZE ================= */
      const finalDataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(finalDataUrl);

      const logoDataUrl = logoFile ? await fileToDataUrl(logoFile) : undefined;

      saveToHistory(payload, finalDataUrl, {
        fgColor,
        bgColor,
        size,
        errorCorrection: "H",
        qrType,
        payload,
        logoSize: logoFile ? logoSize : undefined,
        logoShape: logoFile ? logoShape : undefined,
        logoDataUrl,
      });

      toast({
        title: "QR Code Generated",
        description: "QR code generated successfully.",
      });
    } catch (err) {
      setError("Failed to generate QR code.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [
    qrType,
    url,
    textValue,
    wifi,
    vcard,
    fgColor,
    bgColor,
    size,
    logoFile,
    logoSize,
    logoShape,
    toast,
  ]);

  const downloadAs = useCallback(
    async (format: "png" | "jpeg" | "svg") => {
      if (!qrDataUrl) return;

      try {
        let href = "";
        let filename = `qrcode.${format}`;

        if (format === "svg") {
          const svg = await QRCode.toString(history[0]?.options.payload || "", {
            type: "svg",
            width: size,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
            errorCorrectionLevel: "H",
          });

          const blob = new Blob([svg], { type: "image/svg+xml" });
          href = URL.createObjectURL(blob);
        } else {
          const canvas = canvasRef.current!;
          href = canvas.toDataURL(
            format === "jpeg" ? "image/jpeg" : "image/png",
          );
        }

        const link = document.createElement("a");
        link.href = href;
        link.download = filename;
        link.click();

        if (format === "svg") URL.revokeObjectURL(href);

        toast({
          title: "Download Started",
          description: `${format.toUpperCase()} downloaded successfully.`,
        });
      } catch {
        toast({
          title: "Download Failed",
          variant: "destructive",
        });
      }
    },
    [qrDataUrl, size, fgColor, bgColor, history, toast],
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

      const shareText = `QR Code (${qrType.toUpperCase()})`;

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code",
          text: shareText,
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
      toast({
        title: "Share Failed",
        description: "Unable to share. Image copied to clipboard instead.",
        variant: "destructive",
      });
      await copyToClipboard();
    }
  }, [qrDataUrl, qrType, copyToClipboard, toast]);

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
        <Header />
        <section className="relative py-16 md:py-24 overflow-hidden">
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
                    <div className="xl:flex gap-8">
                      <div className="flex-1">
                        <div className="space-y-4">
                          <Label>QR Code Type</Label>
                          <Tabs
                            value={qrType}
                            onValueChange={(v) => setQrType(v as QRType)}
                          >
                            <TabsList className="grid grid-cols-3 mt-3">
                              <TabsTrigger value="url">Link</TabsTrigger>
                              <TabsTrigger value="text">Text</TabsTrigger>
                              <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
                            </TabsList>
                            <TabsList className="grid grid-cols-3 mt-3">
                              <TabsTrigger value="vcard">Business</TabsTrigger>
                              <TabsTrigger value="email">Email</TabsTrigger>
                              <TabsTrigger value="sms">SMS</TabsTrigger>
                            </TabsList>
                            <TabsList className="grid grid-cols-3 mt-3">
                              <TabsTrigger value="whatsapp">
                                WhatsApp
                              </TabsTrigger>
                              <TabsTrigger value="event">Event</TabsTrigger>
                              <TabsTrigger value="location">
                                Location
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        <div className="space-y-4 mt-2">
                          <div className="flex flex-col gap-3 pt-4">
                            {qrType === "url" && (
                              <>
                                <Label>Enter URL</Label>
                                <Input
                                  value={url}
                                  onChange={(e) => setUrl(e.target.value)}
                                  placeholder="https://example.com"
                                />
                              </>
                            )}

                            {qrType === "text" && (
                              <>
                                <Label>Text</Label>
                                <Input
                                  value={textValue}
                                  onChange={(e) => setTextValue(e.target.value)}
                                  placeholder="Enter any text"
                                />
                              </>
                            )}

                            {qrType === "wifi" && (
                              <>
                                <Label>Wi-Fi Network</Label>
                                <Input
                                  placeholder="SSID"
                                  value={wifi.ssid}
                                  onChange={(e) =>
                                    setWifi({ ...wifi, ssid: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Password"
                                  value={wifi.password}
                                  onChange={(e) =>
                                    setWifi({
                                      ...wifi,
                                      password: e.target.value,
                                    })
                                  }
                                />
                              </>
                            )}

                            {qrType === "vcard" && (
                              <>
                                <Label>Business Card</Label>
                                <Input
                                  placeholder="First Name"
                                  value={vcard.firstName}
                                  onChange={(e) =>
                                    setVcard({
                                      ...vcard,
                                      firstName: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Last Name"
                                  value={vcard.lastName}
                                  onChange={(e) =>
                                    setVcard({
                                      ...vcard,
                                      lastName: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Phone"
                                  value={vcard.phone}
                                  onChange={(e) =>
                                    setVcard({
                                      ...vcard,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Email"
                                  value={vcard.email}
                                  onChange={(e) =>
                                    setVcard({
                                      ...vcard,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </>
                            )}

                            {qrType === "email" && (
                              <>
                                <Input
                                  placeholder="To"
                                  value={email.to}
                                  onChange={(e) =>
                                    setEmail({ ...email, to: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Subject"
                                  value={email.subject}
                                  onChange={(e) =>
                                    setEmail({
                                      ...email,
                                      subject: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Body"
                                  value={email.body}
                                  onChange={(e) =>
                                    setEmail({ ...email, body: e.target.value })
                                  }
                                />
                              </>
                            )}

                            {qrType === "sms" && (
                              <>
                                <Input
                                  placeholder="Phone number"
                                  value={sms.phone}
                                  onChange={(e) =>
                                    setSms({ ...sms, phone: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Message"
                                  value={sms.message}
                                  onChange={(e) =>
                                    setSms({ ...sms, message: e.target.value })
                                  }
                                />
                              </>
                            )}

                            {qrType === "whatsapp" && (
                              <>
                                <Input
                                  placeholder="Phone (with country code)"
                                  value={whatsapp.phone}
                                  onChange={(e) =>
                                    setWhatsapp({
                                      ...whatsapp,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Message"
                                  value={whatsapp.message}
                                  onChange={(e) =>
                                    setWhatsapp({
                                      ...whatsapp,
                                      message: e.target.value,
                                    })
                                  }
                                />
                              </>
                            )}

                            {qrType === "event" && (
                              <>
                                <Input
                                  placeholder="Event title"
                                  value={event.title}
                                  onChange={(e) =>
                                    setEvent({
                                      ...event,
                                      title: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Description"
                                  value={event.description}
                                  onChange={(e) =>
                                    setEvent({
                                      ...event,
                                      description: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Location"
                                  value={event.location}
                                  onChange={(e) =>
                                    setEvent({
                                      ...event,
                                      location: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  type="datetime-local"
                                  value={event.start}
                                  onChange={(e) =>
                                    setEvent({
                                      ...event,
                                      start: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  type="datetime-local"
                                  value={event.end}
                                  onChange={(e) =>
                                    setEvent({ ...event, end: e.target.value })
                                  }
                                />
                              </>
                            )}

                            {qrType === "location" && (
                              <>
                                <Input
                                  placeholder="Latitude"
                                  value={location.lat}
                                  onChange={(e) =>
                                    setLocation({
                                      ...location,
                                      lat: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Longitude"
                                  value={location.lng}
                                  onChange={(e) =>
                                    setLocation({
                                      ...location,
                                      lng: e.target.value,
                                    })
                                  }
                                />
                              </>
                            )}
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
                          <div className="flex justify-center xl:justify-end my-6 xl:mt-6">
                            <Button
                              onClick={generateQRCode}
                              disabled={isGenerating}
                              className="min-w-[140px]"
                              data-testid="button-generate"
                            >
                              {isGenerating ? "Generating..." : "Generate QR"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="sticky self-start">
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
                              <p className="text-xs truncate">
                                ({item.options.qrType?.toUpperCase() || "LINK"})
                              </p>

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
        <Footer />
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
