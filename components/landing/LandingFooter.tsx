import Link from "next/link"

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Security", href: "#security" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ]

  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Revix Trading</h3>
            <p className="text-slate-400 text-sm">
              Learn to trade crypto with zero risk. Master strategies with AI mentorship.
            </p>
          </div>

          {/* Links */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link href={link.href} className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 sm:mb-0">
            © {currentYear} Revix Trading. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs text-center">
            For educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
