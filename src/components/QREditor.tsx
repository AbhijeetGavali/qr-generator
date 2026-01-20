import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

export default function QREditor({ value, onChange, disableUrl }: any) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 220,
      height: 220,
      data: value.destinationUrl,
      ...value.qrConfig,
    });

    ref.current!.innerHTML = "";
    qr.append(ref.current!);
  }, [value]);

  return (
    <div className="space-y-4">
      <div ref={ref} className="mx-auto" />

      <input
        disabled={disableUrl}
        value={value.destinationUrl}
        onChange={(e) => onChange({ ...value, destinationUrl: e.target.value })}
        className="input"
        placeholder="Destination URL"
      />

      <select
        onChange={(e) =>
          onChange({
            ...value,
            qrConfig: {
              ...value.qrConfig,
              dotsOptions: {
                ...value.qrConfig.dotsOptions,
                type: e.target.value,
              },
            },
          })
        }
      >
        <option value="rounded">Rounded</option>
        <option value="dots">Dots</option>
        <option value="classy">Classy</option>
      </select>

      <input
        type="color"
        onChange={(e) =>
          onChange({
            ...value,
            qrConfig: {
              ...value.qrConfig,
              dotsOptions: {
                ...value.qrConfig.dotsOptions,
                color: e.target.value,
              },
            },
          })
        }
      />
    </div>
  );
}
