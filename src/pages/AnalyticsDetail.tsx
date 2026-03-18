import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import { db } from "@/components/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { QrCodeDoc } from "@/types/qr";
import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { format, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type LoadState =
  | { status: "loading"; prefill?: Partial<QrCodeDoc> }
  | { status: "not-found" }
  | { status: "forbidden" }
  | { status: "ready"; qr: QrCodeDoc };

const PREFILL_KEY_PREFIX = "qr-analytics-prefill:";

const PIE_COLORS = ["#2563eb", "#16a34a", "#f97316", "#a855f7", "#ef4444", "#0ea5e9"];

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function buildLastNDays(n: number) {
  const days: { dateKey: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateKey = format(d, "yyyy-MM-dd");
    const label = format(d, "MMM d");
    days.push({ dateKey, label });
  }
  return days;
}

function mapToPieData(map?: Record<string, number>) {
  if (!map) return [];
  return Object.entries(map)
    .map(([name, value]) => ({ name, value: toNumber(value) }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
}

export default function AnalyticsDetail() {
  const [, params] = useRoute("/dashboard/analytics/:qrId");
  const qrId = params?.qrId;
  const { user } = useAuth();

  const [state, setState] = useState<LoadState>(() => {
    if (!qrId) return { status: "not-found" };
    try {
      const raw = sessionStorage.getItem(`${PREFILL_KEY_PREFIX}${qrId}`);
      const prefill = raw ? (JSON.parse(raw) as Partial<QrCodeDoc>) : undefined;
      return { status: "loading", prefill };
    } catch {
      return { status: "loading" };
    }
  });

  useEffect(() => {
    if (!qrId) {
      setState({ status: "not-found" });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "qrcodes", qrId));
        if (!snap.exists()) {
          if (!cancelled) setState({ status: "not-found" });
          return;
        }
        const qr = { id: snap.id, ...snap.data() } as any as QrCodeDoc;
        if (user?.uid && qr.ownerId && qr.ownerId !== user.uid) {
          if (!cancelled) setState({ status: "forbidden" });
          return;
        }
        if (!cancelled) setState({ status: "ready", qr });
      } catch {
        if (!cancelled) setState({ status: "not-found" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [qrId, user?.uid]);

  const last30Days = useMemo(() => buildLastNDays(30), []);

  const derived = useMemo(() => {
    const qr = state.status === "ready" ? state.qr : undefined;
    const analytics = qr?.analytics;

    const deviceMobile = toNumber(analytics?.devices?.mobile);
    const deviceDesktop = toNumber(analytics?.devices?.desktop);

    const series = last30Days.map((d) => ({
      date: d.label,
      count: toNumber(analytics?.dailyScans?.[d.dateKey]),
    }));

    const devicesPie = mapToPieData(analytics?.devices);
    const browsersPie = mapToPieData(analytics?.browsers);

    return {
      totalScans: toNumber(qr?.scanCount),
      mobileScans: deviceMobile,
      desktopScans: deviceDesktop,
      lastScanAt: qr?.lastScanned ? new Date(qr.lastScanned.seconds * 1000) : null,
      series,
      devicesPie,
      browsersPie,
      qrName: qr?.name,
      primaryType: qr?.primaryType,
    };
  }, [last30Days, state]);

  const showHeader = true;
  const loadingPrefill =
    state.status === "loading" ? (state.prefill as Partial<QrCodeDoc> | undefined) : undefined;

  return (
    <>
      {showHeader && <Header />}
      <div className="flex" style={{ height: "calc(100vh - 69px)" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, marginLeft: 5, marginTop: 2, overflow: "auto" }}
        >
          {state.status === "loading" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={22} />
              <Typography variant="body2" color="text.secondary">
                Loading analytics{loadingPrefill?.name ? ` for "${loadingPrefill.name}"` : ""}...
              </Typography>
            </Box>
          )}

          {state.status === "not-found" && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  QR not found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This QR code doesn’t exist, or you no longer have access to it.
                </Typography>
              </CardContent>
            </Card>
          )}

          {state.status === "forbidden" && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Access denied
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don’t have access to view analytics for this QR code.
                </Typography>
              </CardContent>
            </Card>
          )}

          {state.status === "ready" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Analytics{derived.qrName ? ` — ${derived.qrName}` : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  QR ID: {qrId} {derived.primaryType !== "dynamic" ? "• (Static QR)" : ""}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
                  gap: 2,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Total scans
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {derived.totalScans}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Mobile scans
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {derived.mobileScans}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Desktop scans
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {derived.desktopScans}
                    </Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Last scan at
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {derived.lastScanAt ? derived.lastScanAt.toLocaleString() : "No scans yet"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                    Scans over last 30 days
                  </Typography>
                  {derived.totalScans === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No scan data yet. Once someone scans this QR, the chart will appear here.
                    </Typography>
                  ) : (
                    <Box sx={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer>
                        <LineChart data={derived.series}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={4} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Scans"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      Devices
                    </Typography>
                    {derived.devicesPie.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No device data yet.
                      </Typography>
                    ) : (
                      <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={derived.devicesPie}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={90}
                              label
                            >
                              {derived.devicesPie.map((_, idx) => (
                                <Cell
                                  key={`cell-device-${idx}`}
                                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      Browsers
                    </Typography>
                    {derived.browsersPie.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No browser data yet.
                      </Typography>
                    ) : (
                      <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={derived.browsersPie}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={90}
                              label
                            >
                              {derived.browsersPie.map((_, idx) => (
                                <Cell
                                  key={`cell-browser-${idx}`}
                                  fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </>
  );
}

