import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
    </>
  );
}
