"use client"

import Link from "next/link"
import { Heart, Mail, X } from "lucide-react"
import ThemeSwitch from "@/components/ui/theme-switch"

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",

      sections: [
        {
          id: "about",
          name: "About",
          items: [
            { name: "About", href: "/about" },
            { name: "Works", href: "/agency/works" },
            { name: "Pricing", href: "/pricing" },
          ],
        },
        {
          id: "features",
          name: "Features",
          items: [
            { name: "Products", href: "/products" },
            { name: "Agency", href: "/agency" },
            { name: "Dashboard", href: "/dashboard" },
          ],
        },
        {
          id: "products",
          name: "Products",
          items: [
            { name: "DIcons", href: "/products/dicons" },
            { name: "DShapes", href: "/products/dshapes" },
            { name: "Graaadients", href: "/products/graaadients" },
          ],
        },
        {
          id: "designs",
          name: "Designs",
          items: [
            { name: "Design", href: "/designs" },
            { name: "Components", href: "/components" },
            { name: "Blogs", href: "/blogs" },
          ],
        },
        {
          id: "other",
          name: "Others",
          items: [
            { name: "Graphic", href: "/graphic" },
            { name: "3D Icons", href: "/products/3dicons" },
            { name: "Colors", href: "/products/colors/generate" },
          ],
        },
        {
          id: "company",
          name: "Company",
          items: [
            { name: "Contact", href: "/contact" },
            { name: "Terms", href: "/terms" },
            { name: "Privacy", href: "/privacy" },
          ],
        },
      ],
    },
  ],
}

const Underline = `hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform `

export function Footer() {
  return (
      <footer className="mx-auto flex h-full w-full flex-col items-center justify-center">
        <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
          <Link href="/">
            <p className="flex items-center justify-center rounded-full">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary w-8">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </p>
          </Link>
          <p className="text-muted-foreground text-center text-xs leading-4 md:text-left">
            Welcome to Designali, where creativity meets strategy to bring your
            vision to life. I am passionate about transforming ideas into
            compelling visual experiences. I specialize in crafting unique brand
            identities, immersive digital experiences, and engaging content that
            resonates with your audience. My mission is to empower businesses and
            brands to stand out in a crowded market. I believe in the power of
            design to tell stories, evoke emotions, and drive meaningful
            connections. I believe in quality, not quantity. Designali is actually
            an agency of one. This means you&apos;ll work directly with me,
            founder of Designali.
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <div className="border-b border-dotted"> </div>
          <div className="py-10">
            {navigation.categories.map((category) => (
                <div
                    key={category.name}
                    className="grid grid-cols-3 flex-row justify-between gap-6 leading-6 md:flex"
                >
                  {category.sections.map((section) => (
                      <div key={section.name}>
                        <ul
                            role="list"
                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                            className="flex flex-col space-y-2"
                        >
                          {section.items.map((item) => (
                              <li key={item.name} className="flow-root">
                                <Link
                                    href={item.href}
                                    className="text-sm text-slate-600 hover:text-black md:text-xs dark:text-slate-400 hover:dark:text-white"
                                >
                                  {item.name}
                                </Link>
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
            ))}
          </div>
          <div className="border-b border-dotted"> </div>
        </div>

        <div className="flex flex-wrap justify-center gap-y-6">
          <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
            <Link
                aria-label="Logo"
                href="mailto:contact@designali.in"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <Mail strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://x.com/designali_in"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <X className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.instagram.com/designali.in/"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.behance.net/designali-in"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
              </svg>
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.facebook.com/designali.agency"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.linkedin.com/company/designali"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
          </div>
          <ThemeSwitch />
        </div>

        <div className="mx-auto mt-10 mb-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
          <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
            <span> © </span>
            <span>{new Date().getFullYear()}</span>
            <span>Made with</span>
            <Heart className="mx-1 h-4 w-4 animate-pulse text-red-600" />
            <span> by </span>
            <span className="hover:text-ali dark:hover:text-ali cursor-pointer text-black dark:text-white">
            <Link
                aria-label="Logo"
                className="font-bold"
                href="https://danieltodorov.pages.dev"
                target="_blank"
            >
              Daniel Todorov {""}
            </Link>
          </span>
          </div>
        </div>
      </footer>
  )
}
