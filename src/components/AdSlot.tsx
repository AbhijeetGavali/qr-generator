// import { cn } from "@/lib/utils";

// interface AdSlotProps {
//   size: "leaderboard" | "rectangle";
//   className?: string;
//   label?: string;
// }

// const sizeStyles = {
//   leaderboard: "h-[90px] w-full max-w-[728px]",
//   rectangle: "flex-1 w-[300px]",
// };

// export function AdSlot({
//   size,
//   className,
//   label = "Advertisement",
// }: AdSlotProps) {
//   return (
//     <div className={cn("flex flex-col items-center p-3 h-full", className)}>
//       <span className="text-xs text-muted-foreground mb-1">{label}</span>
//       <div
//         className={cn(
//           "bg-muted/50 border border-border rounded-md flex items-center justify-center",
//           sizeStyles[size],
//         )}
//         data-testid={`ad-slot-${size}`}
//       >
//         <span className="text-sm text-muted-foreground">Ad Space</span>
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  size: "leaderboard" | "rectangle";
  className?: string;
  label?: string;
  adSlot: string; // slot id
}

const sizeStyles = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  rectangle: "flex-1 w-[300px]",
};

export function AdSlot({
  size,
  className,
  label = "Advertisement",
  adSlot,
}: AdSlotProps) {
  const adClient = "ca-pub-1992013813902396";
  const adRef = useRef<HTMLModElement | null>(null);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Load script only once
        if (!(window as any).adsbygoogleLoaded) {
          const script = document.createElement("script");
          script.src =
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
            adClient;
          script.async = true;
          script.crossOrigin = "anonymous";
          document.body.appendChild(script);
          (window as any).adsbygoogleLoaded = true;
        }

        // Push ad request
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (e) {
      console.log("Adsense error", e);
    }
  }, []);

  return (
    <div className={cn("flex flex-col items-center p-3 h-full", className)}>
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <p className="text-center text-xs text-gray-600">
        Advertise here → contact <strong>sicrewlimited@gmail.com</strong>
      </p>
      <ins
        className={cn(
          "adsbygoogle bg-muted/50 border border-border rounded-md",
          sizeStyles[size],
        )}
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
}
