"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X, Phone, MapPin } from "lucide-react";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Link from "next/link";

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
};

export default function Navbar() {
  const content = useContent();
  const { navbar = {}, services: servicesData = {}, footer = {} } = content;
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [expandedMobileLink, setExpandedMobileLink] = useState<string | null>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const companyLinks = navbar.companyLinks || [];
  const services = (servicesData.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);

  // Dynamic contact details from CMS footer or navbar
  const phone = footer?.contact?.phone || navbar?.phone || "";
  const address = stripHtml(footer?.contact?.address || "");
  const addressShort = address ? address.split("\n")[0] : "";
  const companyName = footer?.company?.name || navbar?.siteTitle || "";
  const companyTagline = footer?.company?.tagline || footer?.company?.description || "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHoveringMegaMenu(true);
  };

  const handleMegaMenuMouseLeave = () => {
    setIsHoveringMegaMenu(false);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
      setHoveredService(null);
    }, 150);
  };

  const handleLinkClick = () => {
    setActiveMegaMenu(null);
    setIsMenuOpen(false);
    setHoveredService(null);
    setExpandedMobileLink(null);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const normalizeNavHref = (href: string) => {
    if (!href) return "/";
    if (href === "/blog" || href === "/blog/") return "/blogs/";
    if (href.startsWith("http") || href.startsWith("#") || href.includes("?") || href.endsWith("/")) return href;
    return `${href}/`;
  };

  const isLinkActive = (rawHref: string) => {
    const href = normalizeNavHref(rawHref);
    if (href === '/') return pathname === '/' || pathname === '';
    if (href.startsWith('/#')) return false;
    const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
    return cleanPath.startsWith(href);
  };

  return (
    <header className="on-ink fixed top-0 left-0 right-0 z-50">

      {/* ── Utility bar (desktop) ─────────────────────────────────────── */}
      {(phone || addressShort) && (
        <div className="hidden lg:block bg-ink-900 border-b border-white/[0.07]">
          <div className="site-container h-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <span className="meta text-white/75">24/7 Dispatch</span>
              {addressShort && (
                <>
                  <span className="w-px h-3 bg-white/15" />
                  <span className="meta meta-on-ink inline-flex items-center gap-2">
                    <MapPin size={11} className="text-gold" />
                    {addressShort}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-5">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="meta text-white/75 hover:text-gold-soft transition-colors inline-flex items-center gap-2"
                >
                  <Phone size={11} className="text-gold" />
                  <span className="tnum">{phone}</span>
                </a>
              )}
              <span className="w-px h-3 bg-white/15" />
              <Link href="/contact-us/" className="link-arrow link-arrow-on-ink">
                Request a Quote <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <nav
        className={`relative z-50 w-full border-b transition-colors duration-300 ${
          scrolled || isMenuOpen
            ? 'bg-ink-900/95 backdrop-blur-md border-white/10'
            : 'bg-ink-900 border-white/[0.07]'
        }`}
      >
        <div className="site-container flex items-center justify-between h-[74px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            {navbar.logo && (navbar.logo.startsWith('http') || navbar.logo.startsWith('/uploads') || navbar.logo.startsWith('/cdn-images')) ? (
              <div className="relative h-[62px] w-[140px] sm:w-[170px] flex items-center justify-start overflow-hidden">
                <img
                  src={navbar.logo}
                  alt={navbar.siteTitle || "Trinity Pump & Supply"}
                  className="object-contain w-full h-full object-left"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-11 bg-ink-700 border border-gold/50 flex items-center justify-center rounded-sm group-hover:border-gold transition-colors">
                  <svg width="24" height="28" viewBox="0 0 42 48" fill="none">
                    <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C98A2E" />
                    <text x="21" y="33" textAnchor="middle" fill="#0B1726" fontFamily="sans-serif" fontSize="22" fontWeight="bold">T</text>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-[17px] font-bold tracking-[0.12em] text-white leading-none">
                    {navbar.logoText1 || "TRINITY"}
                  </span>
                  <span className="font-mono text-[9.5px] font-semibold tracking-[0.2em] text-gold mt-1.5 leading-none uppercase">
                    {navbar.logoText2 || "PUMP & SUPPLY"}
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-9">
            {(companyLinks || []).map((link: any, linkIdx: number) => {
              const active = isLinkActive(link.href);
              const linkHref = normalizeNavHref(link.href);

              // Case 1: Mega Menu
              if (link.useMegaMenu) {
                const open = activeMegaMenu === `mega-${linkIdx}`;
                return (
                  <li key={linkIdx} className="static">
                    <button
                      onMouseEnter={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setActiveMegaMenu(`mega-${linkIdx}`);
                      }}
                      onMouseLeave={() => {
                        timeoutRef.current = setTimeout(() => {
                          if (!isHoveringMegaMenu) setActiveMegaMenu(null);
                        }, 150);
                      }}
                      className={`relative flex items-center gap-1.5 font-heading text-[14px] font-medium tracking-tight py-6 cursor-pointer transition-colors duration-200
                        ${open || active ? 'text-white' : 'text-white/65 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      {services.length > 0 && (
                        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={13} className="opacity-60 ml-0.5" />
                        </motion.span>
                      )}
                      <span className={`absolute left-0 right-0 bottom-0 h-[2px] transition-colors duration-200 ${open || active ? 'bg-gold' : 'bg-transparent'}`} />
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          ref={megaMenuRef}
                          initial={{ opacity: 0, y: 8, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 6, x: "-50%" }}
                          transition={{ duration: 0.18 }}
                          onMouseEnter={handleMegaMenuMouseEnter}
                          onMouseLeave={handleMegaMenuMouseLeave}
                          className="absolute left-1/2 top-full w-[960px] max-w-[95vw] max-h-[85vh] overflow-y-auto bg-ink-900 border border-white/12 rounded p-7 custom-scrollbar"
                          style={{ zIndex: 1000 }}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1.1fr] gap-8">

                            {/* Services grid */}
                            <div>
                              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                                <span className="meta text-gold-soft">
                                  Equipment &amp; Pump Capabilities
                                </span>
                                <span className="meta meta-on-ink">
                                  {services.length} Specialized Lines
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {services.map((service: any) => {
                                  const isThisHovered = hoveredService === service.title;
                                  return (
                                    <Link
                                      key={service.slug}
                                      href={`/${service.slug}/`}
                                      onMouseEnter={() => setHoveredService(service.title)}
                                      onMouseLeave={() => setHoveredService(null)}
                                      onClick={handleLinkClick}
                                      className="group flex items-start gap-3.5 p-3.5 rounded-sm border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-colors duration-200"
                                    >
                                      <div className={`h-9 w-9 min-w-[36px] rounded-sm flex items-center justify-center transition-colors duration-200 mt-0.5 ${
                                        isThisHovered ? "bg-gold text-ink-900" : "bg-white/[0.06] text-white/70"
                                      }`}>
                                        <Icon name={service.icon || "Wrench"} className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className={`font-heading text-[13.5px] font-medium leading-snug truncate transition-colors ${
                                          isThisHovered ? "text-gold-soft" : "text-white"
                                        }`}>
                                          {service.title}
                                        </h4>
                                        <p className="text-white/45 text-[11.5px] leading-snug line-clamp-1 mt-1">
                                          {stripHtml(service.heroDescription || service.description || "")}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Contact card */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-sm p-6 flex flex-col justify-between">
                              <div>
                                {companyName && (
                                  <h4 className="font-heading text-white text-[16px] font-semibold leading-snug mb-2.5">
                                    {companyName}
                                  </h4>
                                )}
                                {companyTagline && (
                                  <p className="text-white/50 text-[12.5px] leading-relaxed mb-5">
                                    {stripHtml(companyTagline)}
                                  </p>
                                )}
                                {address && (
                                  <div className="flex items-start gap-2.5 pt-4 border-t border-white/10 text-[12px] text-white/60">
                                    <MapPin size={13} className="text-gold mt-0.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{address}</span>
                                  </div>
                                )}
                              </div>

                              {phone && (
                                <a
                                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                  className="btn btn-primary btn-sm w-full mt-6"
                                >
                                  <Phone size={12} />
                                  <span className="tnum">{phone}</span>
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-white/40 text-[12.5px]">
                              Delivering USA-manufactured pump parts across Texas and New Mexico
                            </span>
                            <Link
                              href="/services/"
                              onClick={handleLinkClick}
                              className="link-arrow link-arrow-on-ink"
                            >
                              All Services <ArrowRight size={12} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              // Case 2: Sub-links dropdown
              if (link.subLinks && link.subLinks.length > 0) {
                return (
                  <li key={linkIdx} className="relative group">
                    <button
                      className={`relative flex items-center gap-1.5 font-heading text-[14px] font-medium tracking-tight py-6 cursor-pointer transition-colors duration-200
                        ${active ? 'text-white' : 'text-white/65 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      <ChevronDown size={13} className="opacity-60 ml-0.5 transition-transform duration-200 group-hover:rotate-180" />
                      <span className={`absolute left-0 right-0 bottom-0 h-[2px] transition-colors duration-200 ${active ? 'bg-gold' : 'bg-transparent'}`} />
                    </button>

                    <div className="absolute left-0 top-full w-56 bg-ink-900 border border-white/12 rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -translate-y-1 group-hover:translate-y-0" style={{ zIndex: 1000 }}>
                      <div className="py-2">
                        {link.subLinks.map((subLink: any, sIdx: number) => (
                          <Link
                            key={sIdx}
                            href={normalizeNavHref(subLink.href)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-white/65 hover:text-white hover:bg-white/[0.04] transition-colors"
                            onClick={handleLinkClick}
                          >
                            {subLink.icon && <Icon name={subLink.icon} className="h-4 w-4" />}
                            <span>{subLink.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              // Case 3: Normal link
              const isExternal = link.href.startsWith('http');
              return (
                <li key={linkIdx}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-heading text-[14px] font-medium tracking-tight text-white/65 hover:text-white transition-colors duration-200 py-6 inline-block"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={linkHref}
                      onClick={handleLinkClick}
                      className={`relative flex items-center gap-1.5 font-heading text-[14px] font-medium tracking-tight py-6 transition-colors duration-200
                        ${active ? 'text-white' : 'text-white/65 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      <span className={`absolute left-0 right-0 bottom-0 h-[2px] transition-colors duration-200 ${active ? 'bg-gold' : 'bg-transparent'}`} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* CTA / hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={navbar.ctaLink || "/contact-us/"}
              className="hidden md:inline-flex btn btn-primary btn-sm"
            >
              <Icon name={navbar.ctaIcon || "PhoneCall"} className="h-3.5 w-3.5" />
              {navbar.ctaText || "Request a Quote"}
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 border border-white/20 rounded-sm flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-ink-900/70 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[74px] lg:top-[114px] z-40 bg-ink-900 border-b border-white/12 flex flex-col px-5 py-6 md:hidden gap-6 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="meta text-white/75">24/7 Dispatch</span>
                {phone && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="meta text-gold-soft tnum">
                    {phone}
                  </a>
                )}
              </div>

              <ul className="flex flex-col">
                {(companyLinks || []).map((link: any, linkIdx: number) => {
                  const active = isLinkActive(link.href);
                  const isMegaMenu = link.useMegaMenu;
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedMobileLink === link.label;
                  const isExternal = link.href.startsWith('http');
                  const linkHref = normalizeNavHref(link.href);

                  return (
                    <li key={linkIdx} className="flex flex-col border-b border-white/[0.07]">
                      <div className="flex items-center justify-between">
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-4 font-heading text-[15px] font-medium text-white/75 hover:text-white transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={linkHref}
                            onClick={handleLinkClick}
                            className={`block py-4 font-heading text-[15px] font-medium transition-colors
                              ${active ? 'text-gold-soft' : 'text-white/75 hover:text-white'}`}
                          >
                            {link.label}
                          </Link>
                        )}
                        {(isMegaMenu || hasSubLinks) && (
                          <button
                            onClick={() => setExpandedMobileLink(isExpanded ? null : link.label)}
                            aria-label={`Toggle ${link.label} submenu`}
                            className="p-2 text-white/50 hover:text-gold transition-colors"
                          >
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={17} />
                            </motion.div>
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {(isMegaMenu || hasSubLinks) && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 ml-1 mb-4 flex flex-col border-l border-gold/30">
                              {isMegaMenu ? (
                                services.map((service: any) => (
                                  <Link
                                    key={service.slug}
                                    href={`/${service.slug}/`}
                                    onClick={handleLinkClick}
                                    className="block py-2 text-[13.5px] text-white/60 hover:text-gold-soft transition-colors"
                                  >
                                    {service.title}
                                  </Link>
                                ))
                              ) : (
                                link.subLinks.map((subLink: any, sIdx: number) => (
                                  <Link
                                    key={sIdx}
                                    href={normalizeNavHref(subLink.href)}
                                    onClick={handleLinkClick}
                                    className="block py-2 text-[13.5px] text-white/60 hover:text-gold-soft transition-colors"
                                  >
                                    {subLink.label}
                                  </Link>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-3">
                <a
                  href={navbar.ctaLink || "/contact-us/"}
                  onClick={handleLinkClick}
                  className="btn btn-primary w-full"
                >
                  <Icon name={navbar.ctaIcon || "PhoneCall"} className="h-3.5 w-3.5" />
                  {navbar.ctaText || "Request a Quote"}
                </a>
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    className="btn btn-outline-ink w-full"
                  >
                    <Phone size={12} />
                    <span className="tnum">{phone}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
