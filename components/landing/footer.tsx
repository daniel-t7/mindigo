"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Heart, Mail } from "lucide-react"
import { FiInstagram, FiFacebook, FiLinkedin } from "react-icons/fi"
import { FaBehance } from "react-icons/fa"
import { RiTwitterXFill } from "react-icons/ri";
import ThemeSwitch from "@/components/ui/theme-switch"

function getFooterNav(t: ReturnType<typeof useTranslations>) {
  return {
    categories: [
      {
        id: "about",
        name: t("about"),
        items: [
          { name: t("aboutItems.0"), href: "/about" },
          { name: t("aboutItems.1"), href: "/agency/works" },
          { name: t("aboutItems.2"), href: "/pricing" },
        ],
      },
      {
        id: "features",
        name: t("features"),
        items: [
          { name: t("featuresItems.0"), href: "/products" },
          { name: t("featuresItems.1"), href: "/agency" },
          { name: t("featuresItems.2"), href: "/dashboard" },
        ],
      },
      {
        id: "products",
        name: t("products"),
        items: [
          { name: t("productsItems.0"), href: "/products/dicons" },
          { name: t("productsItems.1"), href: "/products/dshapes" },
          { name: t("productsItems.2"), href: "/products/graaadients" },
        ],
      },
      {
        id: "designs",
        name: t("designs"),
        items: [
          { name: t("designsItems.0"), href: "/designs" },
          { name: t("designsItems.1"), href: "/components" },
          { name: t("designsItems.2"), href: "/blogs" },
        ],
      },
      {
        id: "other",
        name: t("others"),
        items: [
          { name: t("othersItems.0"), href: "/graphic" },
          { name: t("othersItems.1"), href: "/products/3dicons" },
          { name: t("othersItems.2"), href: "/products/colors/generate" },
        ],
      },
      {
        id: "company",
        name: t("company"),
        items: [
          { name: t("companyItems.0"), href: "/contact" },
          { name: t("companyItems.1"), href: "/terms" },
          { name: t("companyItems.2"), href: "/privacy" },
        ],
      },
    ],
  }
}

const Underline = `hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform `

export function Footer() {
  const t = useTranslations("landing.footer")
  const navigation = getFooterNav(t)

  return (
      <footer className="mx-auto flex h-full w-full flex-col items-center justify-center">
        {/*<div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">*/}
        {/*  <Link href="/">*/}
        {/*    <p className="flex items-center justify-center rounded-full">*/}
        {/*      <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary w-8">*/}
        {/*        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>*/}
        {/*      </svg>*/}
        {/*    </p>*/}
        {/*  </Link>*/}
        {/*  <p className="text-muted-foreground text-center text-xs leading-4 md:text-left">*/}
        {/*    Welcome to Designali, where creativity meets strategy to bring your*/}
        {/*    vision to life. I am passionate about transforming ideas into*/}
        {/*    compelling visual experiences. I specialize in crafting unique brand*/}
        {/*    identities, immersive digital experiences, and engaging content that*/}
        {/*    resonates with your audience. My mission is to empower businesses and*/}
        {/*    brands to stand out in a crowded market. I believe in the power of*/}
        {/*    design to tell stories, evoke emotions, and drive meaningful*/}
        {/*    connections. I believe in quality, not quantity. Designali is actually*/}
        {/*    an agency of one. This means you&apos;ll work directly with me,*/}
        {/*    founder of Designali.*/}
        {/*  </p>*/}
        {/*</div>*/}

        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <div className="border-b border-dotted"> </div>
          <div className="py-10">
            <div className="grid grid-cols-3 flex-row justify-between gap-6 leading-6 md:flex">
              {navigation.categories.map((section) => (
                      <div key={section.name}>
                        <p className="mb-2 text-sm font-semibold text-foreground">{section.name}</p>
                        <ul role="list" className="flex flex-col space-y-2">
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
          </div>
          <div className="border-b border-dotted"> </div>
        </div>

        <div className="flex flex-wrap justify-center gap-y-6">
          <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
            <Link
                aria-label="Logo"
                href="mailto:"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <Mail strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://x.com/"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <RiTwitterXFill className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.instagram.com/"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <FiInstagram className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.behance.net/"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <FaBehance className="h-5 w-5"/>
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.facebook.com/"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <FiFacebook className="h-5 w-5" />
            </Link>
            <Link
                aria-label="Logo"
                href="https://www.linkedin.com"
                rel="noreferrer"
                target="_blank"
                className={Underline}
            >
              <FiLinkedin className="h-5 w-5" />
            </Link>
          </div>
          <ThemeSwitch />
        </div>

        <div className="mx-auto mt-10 mb-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
          <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
            <span> © </span>
            <span>{new Date().getFullYear()}</span>
            <span>{t("made")}</span>
            <span> {t("by")} </span>
            <span className="hover:text-ali dark:hover:text-ali cursor-pointer text-black dark:text-white">
            <Link
                aria-label="Logo"
                className="font-bold"
                href="https://danieltodorov.pages.dev"
                target="_blank"
            >
              {t("author")}
            </Link>
          </span>
          </div>
        </div>
      </footer>
  )
}
