"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X, Phone, MapPin, Clock, Shield } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* ── Top Technical Utility Bar (Desktop Only) ─────────────────────────── */}
      {(phone || addressShort) && (
        <div className="hidden lg:block bg-[#08101C] border-b border-white/[0.08] text-[11px] font-mono text-[#A9AFB5] tracking-wide">
          <div className="site-container h-9 flex items-center justify-between">
            {/* Telemetry Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C98A2E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C98A2E]"></span>
                </span>
                <span className="font-semibold text-white/90">24/7 DISPATCH</span>
              </div>
              {addressShort && (
                <>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <MapPin size={12} className="text-[#C98A2E]" />
                    <span>{addressShort}</span>
                  </div>
                </>
              )}
            </div>

            {/* Contact Direct Line */}
            <div className="flex items-center gap-5">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-1.5 text-white/80 hover:text-[#C98A2E] transition-colors"
                >
                  <Phone size={11} className="text-[#C98A2E]" />
                  <span>HOTLINE: {phone}</span>
                </a>
              )}
              <span className="text-white/20">|</span>
              <Link
                href="/contact-us/"
                className="text-[#C98A2E] hover:text-white font-semibold transition-colors uppercase tracking-wider"
              >
                REQUEST A QUOTE &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Navigation Bar ────────────────────────────────────────────── */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled || isMenuOpen
            ? 'bg-[#0B1726]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] border-b border-white/[0.08] py-2'
            : 'bg-[#0B1726] border-b border-white/[0.06] py-3'
        }`}
      >
        <div className="site-container flex items-center justify-between h-[72px]">
          {/* ── Logo ──────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group" onClick={handleLinkClick}>
            {navbar.logo && (navbar.logo.startsWith('http') || navbar.logo.startsWith('/uploads') || navbar.logo.startsWith('/cdn-images')) ? (
              <div className="relative h-[68px] w-[140px] sm:w-[170px] flex items-center justify-start overflow-hidden">
                <img
                  src={navbar.logo}
                  alt={navbar.siteTitle || "Trinity Pump & Supply"}
                  className="object-contain w-full h-full object-left"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-11 bg-[#14243A] border border-[#C98A2E]/50 flex items-center justify-center rounded-sm shadow-md group-hover:border-[#C98A2E] transition-colors">
                  <svg width="24" height="28" viewBox="0 0 42 48" fill="none">
                    <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C98A2E" />
                    <text x="21" y="33" textAnchor="middle" fill="#0B1726" fontFamily="sans-serif" fontSize="22" fontWeight="bold">T</text>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[17px] font-black tracking-[0.14em] text-white leading-none">
                    {navbar.logoText1 || "TRINITY"}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C98A2E] mt-1 leading-none uppercase">
                    {navbar.logoText2 || "PUMP & SUPPLY"}
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* ── Desktop Navigation Links ───────────────────── */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-8">
            {(companyLinks || []).map((link: any, linkIdx: number) => {
              const active = isLinkActive(link.href);
              const linkHref = normalizeNavHref(link.href);

              // Case 1: Mega Menu for Services & Equipment
              if (link.useMegaMenu) {
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
                      className={`flex items-center gap-1.5 text-[13.5px] font-medium tracking-wide transition-colors duration-200 cursor-pointer py-2
                        ${activeMegaMenu === `mega-${linkIdx}` || active
                          ? 'text-[#C98A2E]'
                          : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      {services.length > 0 && (
                        <motion.span animate={{ rotate: activeMegaMenu === `mega-${linkIdx}` ? 180 : 0 }}>
                          <ChevronDown size={14} className="opacity-70 ml-0.5" />
                        </motion.span>
                      )}
                    </button>

                    <AnimatePresence>
                      {activeMegaMenu === `mega-${linkIdx}` && (
                        <motion.div
                          ref={megaMenuRef}
                          initial={{ opacity: 0, y: 12, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 8, x: "-50%" }}
                          onMouseEnter={handleMegaMenuMouseEnter}
                          onMouseLeave={handleMegaMenuMouseLeave}
                          className="absolute left-1/2 top-full mt-1 w-[960px] max-w-[95vw] max-h-[85vh] overflow-y-auto bg-[#0B1726] rounded-xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-white/10 p-6 custom-scrollbar"
                          style={{ zIndex: 1000 }}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1.1fr] gap-6">
                            {/* Left: Dynamic Services Grid */}
                            <div>
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                                <span className="text-[11px] font-mono tracking-widest text-[#C98A2E] uppercase font-semibold">
                                  EQUIPMENT & PUMP CAPABILITIES
                                </span>
                                <span className="text-[11px] font-mono text-white/40">
                                  {services.length} SPECIALIZED LINES
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {services.map((service: any) => {
                                  const isThisHovered = hoveredService === service.title;
                                  return (
                                    <Link
                                      key={service.slug}
                                      href={`/${service.slug}/`}
                                      onMouseEnter={() => setHoveredService(service.title)}
                                      onMouseLeave={() => setHoveredService(null)}
                                      onClick={handleLinkClick}
                                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#14243A] transition-all duration-200 border border-transparent hover:border-white/10"
                                    >
                                      <div className={`h-9 w-9 min-w-[36px] rounded-md flex items-center justify-center transition-all duration-200 mt-0.5 ${
                                        isThisHovered ? "bg-[#C98A2E] text-[#0B1726] shadow-md shadow-[#C98A2E]/20" : "bg-white/[0.06] text-white/80"
                                      }`}>
                                        <Icon name={service.icon || "Wrench"} className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className={`text-[13px] font-semibold transition-colors leading-snug truncate ${
                                          isThisHovered ? "text-[#C98A2E]" : "text-white"
                                        }`}>
                                          {service.title}
                                        </h4>
                                        <p className="text-[#A9AFB5] text-[11px] leading-tight line-clamp-1 mt-1 font-light">
                                          {stripHtml(service.heroDescription || service.description || "")}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Right: Technical Spec / Permian Dispatch Card */}
                            <div className="bg-[#14243A] border border-white/10 rounded-lg p-5 flex flex-col justify-between">
                              <div>
                                {companyName && (
                                  <h4 className="text-white font-bold text-[16px] leading-snug mb-2">
                                    {companyName}
                                  </h4>
                                )}
                                {companyTagline && (
                                  <p className="text-[#A9AFB5] text-[12px] leading-relaxed mb-4">
                                    {stripHtml(companyTagline)}
                                  </p>
                                )}
                                {address && (
                                  <div className="flex items-start gap-2 text-[11.5px] font-mono text-white/70 pt-2 border-t border-white/[0.08]">
                                    <MapPin size={13} className="text-[#C98A2E] mt-0.5 flex-shrink-0" />
                                    <span>{address}</span>
                                  </div>
                                )}
                              </div>

                              {phone && (
                                <div className="pt-4 mt-4 border-t border-white/[0.08]">
                                  <a
                                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                    className="btn-gold w-full justify-center text-[12px] py-2.5"
                                  >
                                    <Phone size={13} className="mr-1.5" />
                                    Call Shop: {phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Mega Menu Technical Footer */}
                          <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs px-1">
                            <span className="text-[#A9AFB5] font-light">
                              Delivering USA-manufactured pump parts across Texas and New Mexico
                            </span>
                            <Link
                              href="/services/"
                              onClick={handleLinkClick}
                              className="text-[#C98A2E] hover:text-white font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
                            >
                              All Services & Equipment Index <ArrowRight size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              // Case 2: Sub-links Dropdown
              if (link.subLinks && link.subLinks.length > 0) {
                return (
                  <li key={linkIdx} className="relative group">
                    <button
                      className={`flex items-center gap-1 text-[13.5px] font-medium tracking-wide transition-colors duration-200 cursor-pointer py-2
                        ${active ? 'text-[#C98A2E]' : 'text-white/80 hover:text-white'}`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="opacity-70 ml-0.5 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute left-0 top-full w-52 bg-[#0B1726] rounded-lg shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0" style={{ zIndex: 1000 }}>
                      <div className="py-2">
                        {link.subLinks.map((subLink: any, sIdx: number) => (
                          <Link
                            key={sIdx}
                            href={normalizeNavHref(subLink.href)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-white/75 hover:text-[#C98A2E] hover:bg-[#14243A] transition-colors"
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

              // Case 3: Normal Link
              const isExternal = link.href.startsWith('http');
              return (
                <li key={linkIdx}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-[#C98A2E] text-[13.5px] font-medium tracking-wide transition-colors duration-200 py-2"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={linkHref}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-1 text-[13.5px] font-medium tracking-wide transition-colors duration-200 py-2 relative
                        ${active
                          ? 'text-[#C98A2E]'
                          : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                      <span>{link.label}</span>
                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C98A2E]" />
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA / Mobile Trigger ──────────────── */}
          <div className="flex items-center gap-3">
            <a
              href={navbar.ctaLink || "/contact-us/"}
              className="hidden md:inline-flex btn-gold"
            >
              <Icon name={navbar.ctaIcon || "PhoneCall"} className="h-4 w-4 mr-1.5" />
              {navbar.ctaText || "Request a Quote"} <ArrowRight size={14} className="ml-1" />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 border border-white/20 bg-white/[0.04] rounded-sm flex items-center justify-center text-white hover:border-[#C98A2E] hover:text-[#C98A2E] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[72px] lg:top-[108px] z-40 bg-[#0B1726] border-b border-white/15 flex flex-col px-6 py-6 md:hidden gap-5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-y-auto"
            >
              {/* Telemetry info in drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[11px] font-mono text-[#A9AFB5]">
                <span className="flex items-center gap-1.5 text-white/90">
                  <span className="h-2 w-2 rounded-full bg-[#C98A2E] inline-block"></span>
                  24/7 DISPATCH
                </span>
                {phone && <span className="text-[#C98A2E] font-semibold">{phone}</span>}
              </div>

              <ul className="flex flex-col gap-2">
                {(companyLinks || []).map((link: any, linkIdx: number) => {
                  const active = isLinkActive(link.href);
                  const isMegaMenu = link.useMegaMenu;
                  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                  const isExpanded = expandedMobileLink === link.label;
                  const isExternal = link.href.startsWith('http');
                  const linkHref = normalizeNavHref(link.href);

                  return (
                    <li key={linkIdx} className="flex flex-col border-b border-white/[0.04] pb-2">
                      <div className="flex items-center justify-between py-1.5">
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-[15px] font-medium text-white/80 hover:text-[#C98A2E] transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={linkHref}
                            onClick={handleLinkClick}
                            className={`block text-[15px] font-medium transition-colors
                              ${active ? 'text-[#C98A2E] font-semibold' : 'text-white/80 hover:text-white'}`}
                          >
                            {link.label}
                          </Link>
                        )}
                        {(isMegaMenu || hasSubLinks) && (
                          <button
                            onClick={() => setExpandedMobileLink(isExpanded ? null : link.label)}
                            className="p-1 text-white/60 hover:text-[#C98A2E] transition-colors"
                          >
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={18} />
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
                            <div className="pl-4 flex flex-col gap-2 mt-1 mb-2 border-l-2 border-[#C98A2E]/40 ml-2">
                              {isMegaMenu ? (
                                services.map((service: any) => (
                                  <Link
                                    key={service.slug}
                                    href={`/${service.slug}/`}
                                    onClick={handleLinkClick}
                                    className="block py-1.5 text-sm font-medium text-white/70 hover:text-[#C98A2E] transition-colors"
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
                                    className="block py-1.5 text-sm font-medium text-white/70 hover:text-[#C98A2E] transition-colors"
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

              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={navbar.ctaLink || "/contact-us/"}
                  onClick={handleLinkClick}
                  className="btn-gold justify-center w-full py-3.5"
                >
                  <Icon name={navbar.ctaIcon || "PhoneCall"} className="h-4 w-4 mr-1.5" />
                  {navbar.ctaText || "Request a Quote"} <ArrowRight size={14} className="ml-1" />
                </a>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="btn-outline-white justify-center w-full py-3 text-center text-xs"
                >
                  <Phone size={13} className="mr-1.5" />
                  Call Shop: {phone}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}