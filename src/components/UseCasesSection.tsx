const useCases = [
  {
    title: "Business Cards",
    description:
      "Share contact details, social profiles, and portfolio with a simple scan.",
    colors: {
      bg: "rgb(224 231 255)", // indigo-100
      fg: "rgb(79 70 229)", // indigo-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M16 7a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    title: "Marketing Campaigns",
    description: "Promote websites, events, and special offers seamlessly.",
    colors: {
      bg: "rgb(252 231 243)", // pink-100
      fg: "rgb(219 39 119)", // pink-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 11l18-5-5 18-3-6-7-7z" />
      </svg>
    ),
  },
  {
    title: "WiFi Access",
    description: "Allow instant network connections for guests.",
    colors: {
      bg: "rgb(220 252 231)", // green-100
      fg: "rgb(22 163 74)", // green-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M5 12a7 7 0 0114 0" />
        <path d="M8.5 15.5a3.5 3.5 0 017 0" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  },
  {
    title: "Product Packaging",
    description: "Provide detailed product information and tutorials.",
    colors: {
      bg: "rgb(254 249 195)", // yellow-100
      fg: "rgb(202 138 4)", // yellow-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z" />
      </svg>
    ),
  },
  {
    title: "Event Management",
    description: "Streamline check-ins with QR-coded tickets.",
    colors: {
      bg: "rgb(219 234 254)", // blue-100
      fg: "rgb(37 99 235)", // blue-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 7V3M16 7V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    title: "RSVP Management",
    description:
      "Enable easy responses for wedding invitations through quick QR scans.",
    colors: {
      bg: "rgb(255 228 230)", // rose-100
      fg: "rgb(225 29 72)", // rose-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Contactless Menus",
    description: "Offer digital menus for safe dining.",
    colors: {
      bg: "rgb(209 250 229)", // emerald-100
      fg: "rgb(5 150 105)", // emerald-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    title: "Social Media Integration",
    description: "Share profiles and boost engagement.",
    colors: {
      bg: "rgb(224 242 254)", // sky-100
      fg: "rgb(2 132 199)", // sky-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
        <path d="M7 16H5a2 2 0 01-2-2V4a2 2 0 012-2h2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "App Downloads",
    description: "Direct users to download your mobile app.",
    colors: {
      bg: "rgb(237 233 254)", // violet-100
      fg: "rgb(124 58 237)", // violet-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
  {
    title: "Educational Resources",
    description: "Link to online materials and tutorials.",
    colors: {
      bg: "rgb(254 243 199)", // amber-100
      fg: "rgb(217 119 6)", // amber-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 6l8 4-8 4-8-4 8-4z" />
        <path d="M4 10v6l8 4 8-4v-6" />
      </svg>
    ),
  },
  {
    title: "Feedback Collection",
    description: "Gather valuable customer insights.",
    colors: {
      bg: "rgb(204 251 241)", // teal-100
      fg: "rgb(13 148 136)", // teal-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    title: "Payment Processing",
    description: "Enable quick and secure transactions.",
    colors: {
      bg: "rgb(236 252 203)", // lime-100
      fg: "rgb(101 163 13)", // lime-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "In-Store Engagement",
    description: "Create interactive retail displays.",
    colors: {
      bg: "rgb(255 237 213)", // orange-100
      fg: "rgb(234 88 12)", // orange-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 3h18v18H3z" />
        <path d="M7 7h10v10H7z" />
      </svg>
    ),
  },
  {
    title: "Email List Growth",
    description: "Expand your subscriber base effortlessly.",
    colors: {
      bg: "rgb(207 250 254)", // cyan-100
      fg: "rgb(8 145 178)", // cyan-600
    },
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 4h16v16H4z" />
        <path d="M4 4l8 8 8-8" />
      </svg>
    ),
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Use Cases</h2>
          <p className="mt-3 text-gray-600">
            Discover how QR-powered solutions can be used across industries
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {useCases.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                style={
                  {
                    "--icon-bg": item.colors.bg,
                    "--icon-fg": item.colors.fg,
                  } as React.CSSProperties
                }
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl
                           bg-[var(--icon-bg)] text-[var(--icon-fg)]
                           transition
                           group-hover:bg-[var(--icon-fg)] group-hover:text-white"
              >
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
