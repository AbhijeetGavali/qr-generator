import { useState, useCallback, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Copy,
  Check,
  QrCode,
  Settings,
  Share2,
  HelpCircle,
  X,
  Save,
} from "lucide-react";
import { Drawer, Tooltip, Typography } from "@mui/material";
import { QRCustomizationSection } from "./QRCustomizationSection";
import { CustomizationValue } from "@/types/qrCustomization";
import { SliderWithSteps } from "../ui/SliderWithSteps";
import { QRLogoCustomizationSection } from "./QRLogoCustomizationSection";

// Firebase Imports
import { db } from "../firebase";
import { collection, serverTimestamp, doc, setDoc } from "firebase/firestore";

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

const MAX_LOGO_RATIO = 0.3;
const MIN_QR_LOGO_PADDING = 50;

const getMaxLogoSize = (qrSize: number) => {
  const value = Math.floor(qrSize * MAX_LOGO_RATIO);
  return Math.floor(value / 10) * 10;
};

const isQrSizeSafeForLogo = (qrSize: number, logoSize: number) =>
  qrSize >= logoSize + MIN_QR_LOGO_PADDING;

export default function QRAdvanceEditor({
  qrData,
  edit = false,
  drawerOpen,
  setDrawerOpen,
  userId,
}: any) {
  const [url, setUrl] = useState("");
  const [rUrl, setRUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSize, setLogoSize] = useState(60);
  const [logoShape, setLogoShape] = useState<"square" | "rounded" | "circle">(
    "rounded",
  );
  const [size, setSize] = useState(300);
  const [shape, setShape] = useState<"square" | "circle">("square");
  const [padding, setPadding] = useState(20);

  const [qrType, setQrType] = useState<QRType>("url");
  const [primaryQrType, setPrimaryQrType] = useState<"static" | "dynamic">(
    "static",
  );
  const [textValue, setTextValue] = useState("");

  const [wifi, setWifi] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
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
  const [email, setEmail] = useState({ to: "", subject: "", body: "" });
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [whatsapp, setWhatsapp] = useState({ phone: "", message: "" });
  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    start: "",
    end: "",
  });
  const [location, setLocation] = useState({ lat: "", lng: "" });

  const [backgroundColor, setBackgroundColor] = useState<CustomizationValue>({
    style: "square",
    color: {
      mode: "single",
      singleColor: "#FFFFFF",
      gradient: { from: "#FFFFFF", to: "#FFFFFF", rotation: 0 },
    },
  });

  const [dots, setDots] = useState<CustomizationValue>({
    style: "square",
    color: {
      mode: "single",
      singleColor: "#000000",
      gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
    },
  });

  const [cornerSquareColor, setCornerSquareColor] =
    useState<CustomizationValue>({
      style: "square",
      color: {
        mode: "single",
        singleColor: "#000000",
        gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
      },
    });

  const [cornerDotsColor, setCornerDotsColor] = useState<CustomizationValue>({
    style: "square",
    color: {
      mode: "single",
      singleColor: "#000000",
      gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
    },
  });

  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const buildQrPayload = useCallback((type: QRType, data: any): string => {
    switch (type) {
      case "wifi":
        return `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};H:${data.hidden};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName};${data.firstName}\nTEL:${data.phone}\nEMAIL:${data.email}\nEND:VCARD`;
      case "email":
        return `mailto:${data.to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
      case "sms":
        return `SMSTO:${data.phone}:${data.message}`;
      case "whatsapp":
        return `https://wa.me/${data.phone}?text=${encodeURIComponent(data.message)}`;
      case "event":
        return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${data.title}\nDESCRIPTION:${data.description}\nLOCATION:${data.location}\nDTSTART:${data.start.replace(/[-:]/g, "")}\nDTEND:${data.end.replace(/[-:]/g, "")}\nEND:VEVENT\nEND:VCALENDAR`;
      case "location":
        return `geo:${data.lat},${data.lng}`;
      default:
        return "";
    }
  }, []);

  const generateQRCode = useCallback(async () => {
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
      const qrOptions: any = {
        width: size,
        height: size,
        data: payload,
        shape: shape,
        margin: padding,
        image: logoFile ? URL.createObjectURL(logoFile) : undefined,
        dotsOptions: {
          type: dots.style,
          color:
            dots.color.mode === "single" ? dots.color.singleColor : undefined,
          gradient:
            dots.color.mode === "gradient"
              ? {
                  type: "linear",
                  rotation: (dots.color.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: dots.color.gradient.from },
                    { offset: 1, color: dots.color.gradient.to },
                  ],
                }
              : undefined,
        },
        backgroundOptions: {
          color:
            backgroundColor.color.mode === "single"
              ? backgroundColor.color.singleColor
              : undefined,
          gradient:
            backgroundColor.color.mode === "gradient"
              ? {
                  type: "linear",
                  rotation:
                    (backgroundColor.color.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: backgroundColor.color.gradient.from },
                    { offset: 1, color: backgroundColor.color.gradient.to },
                  ],
                }
              : undefined,
        },
        cornersSquareOptions: {
          type: cornerSquareColor.style,
          color:
            cornerSquareColor.color.mode === "single"
              ? cornerSquareColor.color.singleColor
              : undefined,
          gradient:
            cornerSquareColor.color.mode === "gradient"
              ? {
                  type: "linear",
                  rotation:
                    (cornerSquareColor.color.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: cornerSquareColor.color.gradient.from },
                    { offset: 1, color: cornerSquareColor.color.gradient.to },
                  ],
                }
              : undefined,
        },
        cornersDotOptions: {
          type: cornerDotsColor.style,
          color:
            cornerDotsColor.color.mode === "single"
              ? cornerDotsColor.color.singleColor
              : undefined,
          gradient:
            cornerDotsColor.color.mode === "gradient"
              ? {
                  type: "linear",
                  rotation:
                    (cornerDotsColor.color.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: cornerDotsColor.color.gradient.from },
                    { offset: 1, color: cornerDotsColor.color.gradient.to },
                  ],
                }
              : undefined,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: logoSize / size,
          hideBackgroundDots: true,
        },
        qrOptions: { errorCorrectionLevel: "H" },
      };

      if (!qrCodeInstance.current) {
        qrCodeInstance.current = new QRCodeStyling(qrOptions);
      } else {
        qrCodeInstance.current.update(qrOptions);
      }

      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
        qrCodeInstance.current.append(canvasRef.current);
      }

      const blob = await qrCodeInstance.current.getRawData("png");
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => setQrDataUrl(reader.result as string);
        reader.readAsDataURL(blob as Blob);
      }
    } catch (err) {
      setError("Failed to generate QR code.");
    } finally {
      setIsGenerating(false);
    }
  }, [
    qrType,
    url,
    textValue,
    wifi,
    vcard,
    email,
    sms,
    whatsapp,
    event,
    location,
    dots,
    backgroundColor,
    cornerSquareColor,
    cornerDotsColor,
    size,
    shape,
    padding,
    logoFile,
    logoSize,
    logoShape,
    toast,
    buildQrPayload,
  ]);

  useEffect(() => {
    // Regenerate QR code when dependencies change and has data for each type to encode
    if (
      drawerOpen &&
      (url ||
        textValue ||
        wifi.ssid ||
        vcard.firstName ||
        email.to ||
        sms.phone ||
        whatsapp.phone ||
        event.title ||
        location.lat)
    ) {
      generateQRCode();
    }
  }, [generateQRCode, drawerOpen]);

  const downloadAs = useCallback(
    async (format: "png" | "jpeg" | "svg") => {
      if (!qrCodeInstance.current) return;
      try {
        await qrCodeInstance.current.download({
          name: "qr-code",
          extension: format as any,
        });
        toast({
          title: "Download Started",
          description: `${format.toUpperCase()} downloaded successfully.`,
        });
      } catch {
        toast({ title: "Download Failed", variant: "destructive" });
      }
    },
    [toast],
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
      toast({ title: "Copy Failed", variant: "destructive" });
    }
  }, [qrDataUrl, toast]);

  const shareQRCode = useCallback(async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "QR Code", files: [file] });
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

  // --- FIREBASE SAVE FUNCTION ---
  const saveToFirebase = async () => {
    if (!qrDataUrl || !userId) {
      toast({
        title: "Error",
        description: "Authentication required.",
        variant: "destructive",
      });
      setDrawerOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      // 1. Pre-generate a Document Reference to get the Firebase ID
      const qrCollectionRef = collection(db, "qrcodes");
      const newQrDocRef = doc(qrCollectionRef);
      const firebaseId = newQrDocRef.id; // This is your small, unique ID

      const baseUrl = window.location.origin;

      // 2. Determine target data
      const targetPayload =
        qrType === "url"
          ? url
          : qrType === "text"
            ? textValue
            : buildQrPayload(qrType, {
                wifi,
                vcard,
                email,
                sms,
                whatsapp,
                event,
                location,
              });

      // 3. Dynamic Logic: Encode the Firebase Doc ID in the image
      const finalEncodedData =
        primaryQrType === "dynamic"
          ? `${baseUrl}/r/${firebaseId}`
          : targetPayload;

      const docData = {
        ownerId: userId,
        qrId: firebaseId, // Storing the doc.id inside for easy access
        name: `QR Code ${new Date().toLocaleDateString()}`,
        primaryType: primaryQrType,
        qrType,
        payload: targetPayload,
        redirectUrl:
          primaryQrType === "dynamic" ? `${baseUrl}/r/${firebaseId}` : null,
        createdAt: serverTimestamp(),
        config: {
          dots,
          backgroundColor,
          cornerSquareColor,
          cornerDotsColor,
          size,
          shape,
          padding,
          logoSize,
          logoShape,
        },
        analytics: { dailyScans: {} },
        scanCount: 0,
        isActive: true,
        lastScanned: null,
      };

      // 4. Save using setDoc since we already have the reference
      await setDoc(newQrDocRef, docData);

      // 5. If Dynamic, refresh the QR image to contain the new Firebase link
      if (primaryQrType === "dynamic") {
        if (qrCodeInstance.current) {
          qrCodeInstance.current.update({ data: finalEncodedData });
          const blob = await qrCodeInstance.current.getRawData("png");
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => setQrDataUrl(reader.result as string);
            reader.readAsDataURL(blob as Blob);
          }
        }
      }

      toast({
        title: "Success",
        description: `Saved to cloud with ID: ${firebaseId}`,
      });
    } catch (err) {
      console.error("Save Error:", err);
      toast({ title: "Save Failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!drawerOpen) {
      // Reset Basic Info
      setUrl("");
      setTextValue("");
      setQrDataUrl(null);
      setError(null);
      setPrimaryQrType("static");
      setQrType("url");

      // Reset Specialized Data
      setWifi({ ssid: "", password: "", encryption: "WPA", hidden: false });
      setVcard({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        title: "",
        website: "",
      });
      setEmail({ to: "", subject: "", body: "" });
      setSms({ phone: "", message: "" });
      setWhatsapp({ phone: "", message: "" });
      setEvent({
        title: "",
        description: "",
        location: "",
        start: "",
        end: "",
      });
      setLocation({ lat: "", lng: "" });

      // Reset Customization
      setDots({
        style: "square",
        color: {
          mode: "single",
          singleColor: "#000000",
          gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
        },
      });
      setBackgroundColor({
        style: "square",
        color: {
          mode: "single",
          singleColor: "#FFFFFF",
          gradient: { from: "#FFFFFF", to: "#FFFFFF", rotation: 0 },
        },
      });
      setCornerSquareColor({
        style: "square",
        color: {
          mode: "single",
          singleColor: "#000000",
          gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
        },
      });
      setCornerDotsColor({
        style: "square",
        color: {
          mode: "single",
          singleColor: "#000000",
          gradient: { from: "#4527a0", to: "#7c4dff", rotation: 0 },
        },
      });

      // Reset Files & Layout
      setLogoFile(null);
      setLogoSize(60);
      setSize(300);
      setPadding(20);
      setShape("square");

      // Clear the instance ref to prevent memory leaks or ghost renders
      qrCodeInstance.current = null;
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (edit && qrData) {
      setPrimaryQrType(qrData.primaryType || "static");
      setQrType(qrData.qrType || "url");

      const payload = qrData.payload || "";

      switch (qrData.qrType) {
        case "url":
          setRUrl(qrData.redirectUrl || "");
          setUrl(payload);
          break;
        case "text":
          setTextValue(payload);
          break;

        case "wifi": {
          // Parse "WIFI:S:MySSID;T:WPA;P:secret;H:false;;"
          const ssid = payload.match(/S:(.*?);/)?.[1] || "";
          const encryption = payload.match(/T:(.*?);/)?.[1] || "WPA";
          const password = payload.match(/P:(.*?);/)?.[1] || "";
          const hidden = payload.match(/H:(.*?);/)?.[1] === "true";
          setWifi({ ssid, encryption, password, hidden });
          break;
        }

        case "vcard": {
          // Parse vCard string
          const firstName = payload.match(/N:.*?;(.*?)\n/)?.[1] || "";
          const lastName = payload.match(/N:(.*?);/)?.[1] || "";
          const phone = payload.match(/TEL:(.*?)\n/)?.[1] || "";
          const email = payload.match(/EMAIL:(.*?)\n/)?.[1] || "";
          setVcard((prev) => ({ ...prev, firstName, lastName, phone, email }));
          break;
        }

        case "email": {
          // Parse mailto:to?subject=...&body=...
          const to = payload.match(/mailto:(.*?)\?/)?.[1] || "";
          const searchParams = new URLSearchParams(payload.split("?")[1]);
          setEmail({
            to,
            subject: decodeURIComponent(searchParams.get("subject") || ""),
            body: decodeURIComponent(searchParams.get("body") || ""),
          });
          break;
        }

        case "sms": {
          // Parse SMSTO:phone:message
          const parts = payload.split(":");
          setSms({ phone: parts[1] || "", message: parts[2] || "" });
          break;
        }

        case "whatsapp": {
          // Parse https://wa.me/phone?text=message
          const phone = payload.match(/wa\.me\/(.*?)\?/)?.[1] || "";
          const text = payload.split("text=")[1] || "";
          setWhatsapp({ phone, message: decodeURIComponent(text) });
          break;
        }

        case "location": {
          // Parse geo:lat,lng
          const coords = payload.replace("geo:", "").split(",");
          setLocation({ lat: coords[0] || "", lng: coords[1] || "" });
          break;
        }

        case "event": {
          // Simple extraction for events
          const title = payload.match(/SUMMARY:(.*?)\n/)?.[1] || "";
          const desc = payload.match(/DESCRIPTION:(.*?)\n/)?.[1] || "";
          const loc = payload.match(/LOCATION:(.*?)\n/)?.[1] || "";
          setEvent((prev) => ({
            ...prev,
            title,
            description: desc,
            location: loc,
          }));
          break;
        }
      }

      // Config Mapping
      if (qrData.config) {
        const c = qrData.config;
        setDots(c.dots);
        setBackgroundColor(c.backgroundColor);
        setCornerSquareColor(c.cornerSquareColor);
        setCornerDotsColor(c.cornerDotsColor);
        setSize(c.size ?? 300);
        setShape(c.shape ?? "square");
        setPadding(c.padding ?? 20);
        setLogoSize(c.logoSize ?? 60);
        setLogoShape(c.logoShape ?? "rounded");
      }
    }
  }, [edit, qrData]);

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      anchor="right"
    >
      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-6 order-first md:order-none">
          <div className="mt-6 flex items-center gap-3 justify-between">
            <Typography variant="h6" component="div">
              Advanced QR Code Editor
            </Typography>
            <Button variant={"ghost"} onClick={() => setDrawerOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="space-y-4">
            <Label>Primary QR Type</Label>
            <Tabs
              value={primaryQrType}
              onValueChange={(v) => {
                setPrimaryQrType(v as "static" | "dynamic");
                if (v === "dynamic") setQrType("url");
              }}
            >
              <TabsList className="grid grid-cols-2 mt-3">
                <TabsTrigger value="static" disabled={edit}>
                  <div className="flex items-center gap-2">
                    Static
                    <Tooltip title="Once created, this QR cannot be changed. If you need updates later, create a new QR.">
                      <HelpCircle size={16} />
                    </Tooltip>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="dynamic" disabled={edit}>
                  <div className="flex items-center gap-2">
                    Dynamic
                    <Tooltip title="You can update where this QR leads anytime, without changing the QR image.">
                      <HelpCircle size={16} />
                    </Tooltip>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="xl:flex gap-8">
            <div className="flex-1 w-[600px]">
              <div className="space-y-4">
                <Label>QR Code Type</Label>
                <Tabs
                  value={qrType}
                  onValueChange={(v) => setQrType(v as QRType)}
                >
                  <TabsList className="grid grid-cols-3 mt-3">
                    <TabsTrigger value="url" disabled={edit}>
                      Link
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="wifi"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Wi-Fi
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-3 mt-3">
                    <TabsTrigger
                      value="vcard"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Business
                    </TabsTrigger>
                    <TabsTrigger
                      value="email"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="sms"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      SMS
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-3 mt-3">
                    <TabsTrigger
                      value="whatsapp"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      WhatsApp
                    </TabsTrigger>
                    <TabsTrigger
                      value="event"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Event
                    </TabsTrigger>
                    <TabsTrigger
                      value="location"
                      disabled={primaryQrType === "dynamic" || edit}
                    >
                      Location
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-3 pt-4">
                  {qrType === "url" && (
                    <>
                      <Label className="flex items-center gap-2">
                        {edit
                          ? "Redirect URL"
                          : "Enter" + primaryQrType == "dynamic" &&
                            "Destination" + " URL"}
                        {primaryQrType == "dynamic" && (
                          <Tooltip
                            title={
                              edit
                                ? "This is the redirect URL on QR."
                                : "You can update this link anytime, without changing the QR image."
                            }
                          >
                            <HelpCircle size={16} />
                          </Tooltip>
                        )}
                      </Label>
                      <Input
                        value={edit && primaryQrType === "dynamic" ? rUrl : url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        disabled={edit}
                      />
                    </>
                  )}
                  {qrType === "url" && primaryQrType === "dynamic" && edit && (
                    <>
                      <Label className="flex items-center gap-2">
                        Edit Destination URL
                        <Tooltip title="You can update this link anytime, without changing the QR image.">
                          <HelpCircle size={16} />
                        </Tooltip>
                      </Label>
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
                        disabled={edit}
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
                        disabled={edit}
                      />
                      <Input
                        placeholder="Password"
                        value={wifi.password}
                        onChange={(e) =>
                          setWifi({ ...wifi, password: e.target.value })
                        }
                        disabled={edit}
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
                          setVcard({ ...vcard, firstName: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Last Name"
                        value={vcard.lastName}
                        onChange={(e) =>
                          setVcard({ ...vcard, lastName: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Phone"
                        value={vcard.phone}
                        onChange={(e) =>
                          setVcard({ ...vcard, phone: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Email"
                        value={vcard.email}
                        onChange={(e) =>
                          setVcard({ ...vcard, email: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}

                  {qrType === "email" && (
                    <>
                      <Label>Email Details</Label>
                      <Input
                        placeholder="To"
                        value={email.to}
                        onChange={(e) =>
                          setEmail({ ...email, to: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Subject"
                        value={email.subject}
                        onChange={(e) =>
                          setEmail({ ...email, subject: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Body"
                        value={email.body}
                        onChange={(e) =>
                          setEmail({ ...email, body: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}

                  {qrType === "sms" && (
                    <>
                      <Label>SMS Details</Label>
                      <Input
                        placeholder="Phone number"
                        value={sms.phone}
                        onChange={(e) =>
                          setSms({ ...sms, phone: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Message"
                        value={sms.message}
                        onChange={(e) =>
                          setSms({ ...sms, message: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}

                  {qrType === "whatsapp" && (
                    <>
                      <Label>WhatsApp Details</Label>
                      <Input
                        placeholder="Phone (with country code)"
                        value={whatsapp.phone}
                        onChange={(e) =>
                          setWhatsapp({ ...whatsapp, phone: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Message"
                        value={whatsapp.message}
                        onChange={(e) =>
                          setWhatsapp({ ...whatsapp, message: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}

                  {qrType === "event" && (
                    <>
                      <Label>Event Details</Label>
                      <Input
                        placeholder="Event title"
                        value={event.title}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            title: e.target.value,
                          })
                        }
                        disabled={edit}
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
                        disabled={edit}
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
                        disabled={edit}
                      />
                      <Input
                        type="datetime-local"
                        value={event.start}
                        onChange={(e) =>
                          setEvent({ ...event, start: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        type="datetime-local"
                        value={event.end}
                        onChange={(e) =>
                          setEvent({ ...event, end: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}

                  {qrType === "location" && (
                    <>
                      <Label>Location Coordinates</Label>
                      <Input
                        placeholder="Latitude"
                        value={location.lat}
                        onChange={(e) =>
                          setLocation({ ...location, lat: e.target.value })
                        }
                        disabled={edit}
                      />
                      <Input
                        placeholder="Longitude"
                        value={location.lng}
                        onChange={(e) =>
                          setLocation({ ...location, lng: e.target.value })
                        }
                        disabled={edit}
                      />
                    </>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="border-border pt-10">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Customization</span>
                </div>
                <QRCustomizationSection
                  title="Background Color"
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                />
                <QRCustomizationSection
                  title="Dots Style & Color"
                  styles={[
                    { label: "Square", value: "square" },
                    { label: "Rounded", value: "rounded" },
                    { label: "Dots", value: "dots" },
                  ]}
                  value={dots}
                  onChange={setDots}
                />
                <QRCustomizationSection
                  title="Corner Squares Style & Color"
                  styles={[
                    { label: "Square", value: "square" },
                    { label: "Rounded", value: "rounded" },
                    { label: "Extra Rounded", value: "extra-rounded" },
                  ]}
                  value={cornerSquareColor}
                  onChange={setCornerSquareColor}
                />
                <QRCustomizationSection
                  title="Corner Dots Style & Color"
                  styles={[
                    { label: "Square", value: "square" },
                    { label: "Dot", value: "dot" },
                  ]}
                  value={cornerDotsColor}
                  onChange={setCornerDotsColor}
                />

                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                  <Label>QR Shape</Label>
                  <select
                    value={shape}
                    onChange={(e) =>
                      setShape(e.target.value as "square" | "circle")
                    }
                    className="w-full rounded-lg px-3 py-2 outline-none border border-gray-300 text-sm mt-2"
                  >
                    {["circle", "square"].map((v) => (
                      <option key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <SliderWithSteps
                  label="QR Size"
                  value={size}
                  min={300}
                  max={500}
                  step={50}
                  unit="px"
                  onChange={setSize}
                  boxed={true}
                />

                <div className="mb-6" />
                <SliderWithSteps
                  label="Padding"
                  value={padding}
                  min={0}
                  max={60}
                  step={20}
                  unit="px"
                  onChange={setPadding}
                  boxed={true}
                />
                <QRLogoCustomizationSection
                  logoFile={logoFile}
                  onLogoChange={setLogoFile}
                  logoSize={logoSize}
                  onLogoSizeChange={setLogoSize}
                  logoShape={logoShape}
                  onLogoShapeChange={setLogoShape}
                  minLogoSize={getMaxLogoSize(size) - 60}
                  maxLogoSize={getMaxLogoSize(size)}
                  step={30}
                  unit="px"
                />

                {/* 🛠️ Hidden container for library to render into */}
                <div ref={canvasRef} className="hidden" />

                <div className="flex justify-center xl:justify-end my-6 xl:mt-6">
                  <Button
                    onClick={saveToFirebase}
                    disabled={isSaving || !qrDataUrl || isGenerating}
                    className="min-w-[140px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate QR"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="sticky top-4 self-start">
              <Card className="p-6 md:p-8 transition-all duration-500">
                <div className="flex flex-col items-center">
                  {qrDataUrl ? (
                    <>
                      <div className="relative group">
                        {/* Visual indicator for Dynamic Codes */}
                        <div className="rounded-lg shadow-sm bg-white p-2">
                          <img
                            src={qrDataUrl}
                            alt="Generated QR Code"
                            className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                          />
                        </div>
                      </div>
                      <p className="flex gap-2 text-xs text-muted-foreground mb-4 text-center">
                        {primaryQrType === "dynamic" && edit
                          ? "This QR points to your smart redirect link."
                          : "This QR contains the data directly."}

                        {primaryQrType === "dynamic" && !edit && (
                          <Tooltip title="This preview is just a draft. To enable dynamic features—like changing your link anytime without re-printing—please save your QR code first. Once saved, your final Dynamic QR will be ready to download.">
                            <HelpCircle size={16} />
                          </Tooltip>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <Button
                          onClick={() => downloadAs("png")}
                          size="sm"
                          disabled={primaryQrType === "dynamic" && !edit}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PNG
                        </Button>
                        <Button
                          onClick={() => downloadAs("svg")}
                          size="sm"
                          variant="outline"
                          disabled={primaryQrType === "dynamic" && !edit}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          SVG
                        </Button>
                        <Button
                          onClick={() => downloadAs("jpeg")}
                          size="sm"
                          variant="outline"
                          disabled={primaryQrType === "dynamic" && !edit}
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
                          disabled={primaryQrType === "dynamic" && !edit}
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
                          disabled={primaryQrType === "dynamic" && !edit}
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
                      <p className="text-muted-foreground">
                        Your QR code will appear here
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
