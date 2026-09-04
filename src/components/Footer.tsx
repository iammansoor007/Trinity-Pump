"use client";

import { useContent } from "../hooks/useContent";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

/* ── Logo ──────────────────────────────────────────────── */
function FooterLogo({ logoUrl, siteTitle, logoText1, logoText2 }: { logoUrl?: string; siteTitle?: string; logoText1?: string; logoText2?: string }) {
  if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/uploads') || logoUrl.startsWith('/cdn-images'))) {
    return (
      <Link href="/" className="inline-flex items-center gap-3 mb-5">
        <div className="relative w-[130px] sm:w-[160px] h-[55px] sm:h-[65px] flex items-center justify-start overflow-hidden">
          <img
            src={logoUrl}
            alt={siteTitle || "Trinity Pump & Supply Logo"}
            className="object-contain w-full h-full object-left"
          />
        </div>
      </Link>
    );
  }
  return (
    <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
      <div className="w-10 h-11 bg-[#14243A] border border-[#C98A2E]/50 flex items-center justify-center rounded-sm shadow-md group-hover:border-[#C98A2E] transition-colors">
        <svg width="24" height="28" viewBox="0 0 42 48" fill="none">
          <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C98A2E" />
          <text x="21" y="33" textAnchor="middle" fill="#0B1726" fontFamily="sans-serif" fontSize="22" fontWeight="bold">T</text>
        </svg>
      </div>
      <span className="flex flex-col text-left">
        <span className="text-[17px] font-black tracking-[0.14em] text-white leading-none">
          {logoText1 || "TRINITY"}
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#C98A2E] mt-1 leading-none uppercase">
          {logoText2 || "PUMP & SUPPLY"}
        </span>
      </span>
    </Link>
  );
}

/* ── Social Icons ──────────────────────────────────────── */
function SocialIcons({ socialItems }: { socialItems?: any[] }) {
  if (!socialItems || socialItems.length === 0) return null;
  const activeSocials = socialItems.filter((s: any) => s.platform && s.platform.trim() !== '');
  if (activeSocials.length === 0) return null;

  return (
    <div className="flex gap-2.5 mt-5 justify-start">
      {activeSocials.map((s: any, i: number) => {
        const iconName = s.icon || s.platform || '';
        const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

        let IconComponent = (LucideIcons as any)[formattedIconName];
        if (!IconComponent) {
          const lower = formattedIconName.toLowerCase();
          if (lower === 'linkedin') IconComponent = LucideIcons.Linkedin;
          else if (lower === 'facebook') IconComponent = LucideIcons.Facebook;
          else if (lower === 'instagram') IconComponent = LucideIcons.Instagram;
          else if (lower === 'twitter') IconComponent = LucideIcons.Twitter;
          else if (lower === 'youtube') IconComponent = LucideIcons.Youtube;
          else IconComponent = LucideIcons.Share2;
        }

        const href = s.href && s.href.trim() !== '' ? s.href : '#';
        return (
          <a
            key={`${s.platform}-${i}`}
            href={href}
            target={href !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="w-8 h-8 rounded-sm bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C98A2E] hover:border-[#C98A2E] hover:bg-[#14243A] transition-all duration-200"
          >
            <IconComponent size={14} strokeWidth={1.5} />
          </a>
        );
      })}
    </div>
  );
}

/* ── Map Embed ─────────────────────────────────────────── */
function MapEmbed({ addressText, iframeHtml }: { addressText: string; iframeHtml?: string | null }) {
  if (iframeHtml) {
    const styledIframe = iframeHtml
      .replace(/width="[^"]*"/i, 'width="100%"')
      .replace(/height="[^"]*"/i, 'height="100%"');
    return (
      <div
        className="mt-4 h-[120px] w-full rounded-sm overflow-hidden border border-white/10 relative"
        dangerouslySetInnerHTML={{ __html: styledIframe }}
      />
    );
  }
  if (!addressText) return null;
  const encoded = encodeURIComponent(addressText);
  return (
    <div className="mt-4 h-[120px] w-full rounded-sm overflow-hidden border border-white/10 relative">
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encoded}&output=embed`}
      />
    </div>
  );
}

export default function Footer() {
  const content = useContent();
  const { footer = {}, navbar = {}, services: servicesData = {}, hours = {} } = content;

  const companyInfo = footer.company || {};
  const contactInfo = footer.contact || {};
  const bottomInfo = footer.bottom || {};

  const brandDescriptionText: string = stripHtml(companyInfo.description || "");
  const addressText: string = stripHtml(contactInfo.address || "");
  const phoneText: string = contactInfo.phone || navbar.phone || "";
  const emailText: string = contactInfo.email || "";

  // Dynamic hours resolution
  let hoursText = "";
  if (typeof contactInfo.hours === 'string' && contactInfo.hours.trim()) {
    hoursText = contactInfo.hours;
  } else if (hours && typeof hours === 'object') {
    const h = hours as any;
    const parts: string[] = [];
    if (h.monday && h.friday && h.monday === h.friday) {
      parts.push(`Mon–Fri: ${h.monday}`);
    }
    if (h.saturday) parts.push(`Sat: ${h.saturday}`);
    if (h.sunday) parts.push(`Sun: ${h.sunday}`);
    hoursText = parts.join('\n');
  }

  const copyrightText: string = stripHtml(bottomInfo.copyright || (footer as any)?.copyright || `© ${new Date().getFullYear()} Trinity Pump & Supply. All Rights Reserved.`);

  const companyLinks = navbar?.companyLinks || navbar?.links || [];
  const quickLinksData = companyLinks.map((link: any) => {
    let href = link.href || "/";
    if (href === "/blog" || href === "/blog/") href = "/blogs/";
    if (href.startsWith("/") && !href.endsWith("/") && !href.includes("#") && !href.includes("?")) {
      href = `${href}/`;
    }
    return { label: link.label, href };
  });

  const servicesListRaw = (servicesData?.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);
  const servicesDataList = servicesListRaw.slice(0, 6).map((svc: any) => ({
    label: svc.title,
    href: `/${svc.slug}/`
  }));

  const socialLinks: any[] = (footer as any)?.social?.items || (footer as any)?.social || [];

  return (
    <footer className="bg-[#0B1726] border-t border-white/[0.08] text-white">
      {/* ── Dynamic Telemetry Strip (Only rendered if phone or address present) ── */}
      {(phoneText || addressText || hoursText) && (
        <div className="bg-[#08101C] border-b border-white/[0.08] py-4">
          <div className="site-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-white/75">
              {addressText && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C98A2E]"></span>
                  <span className="text-white font-bold tracking-wider">{addressText.split(',')[0]} FACILITY</span>
                </div>
              )}
              {hoursText && (
                <div className="flex items-center gap-1.5 text-white/70">
                  <Clock size={12} className="text-[#C98A2E]" />
                  <span>{hoursText.replace(/\n/g, ' • ')}</span>
                </div>
              )}
            </div>

            {phoneText && (
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${phoneText.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C98A2E]/10 border border-[#C98A2E]/40 text-[#C98A2E] hover:bg-[#C98A2E] hover:text-[#0B1726] transition-all rounded-sm text-[11px] font-bold tracking-wider uppercase font-mono"
                >
                  <Phone size={11} />
                  <span>CALL: {phoneText}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main Footer Columns ──────────────────────────────── */}
      <div className="pt-16 pb-12">
        <div className="site-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.4fr] gap-10 lg:gap-12 pb-12 border-b border-white/[0.08]">
            
            {/* Col 1 — Company Profile */}
            <div className="flex flex-col items-start text-left">
              <FooterLogo
                logoUrl={(navbar as any)?.logo}
                siteTitle={(navbar as any)?.siteTitle}
                logoText1={(navbar as any)?.logoText1}
                logoText2={(navbar as any)?.logoText2}
              />
              {brandDescriptionText && (
                <p className="text-[#A9AFB5] text-[13.5px] leading-[1.8] mb-4 max-w-[300px]">
                  {brandDescriptionText}
                </p>
              )}
              <SocialIcons socialItems={socialLinks} />
            </div>

            {/* Col 2 — Quick Navigation */}
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] font-mono tracking-widest text-[#C98A2E] uppercase font-bold mb-5 block">
                NAVIGATION
              </span>
              <ul className="space-y-2.5">
                {quickLinksData.map((link: any, idx: number) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-[#A9AFB5] hover:text-white text-[13.5px] transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C98A2E]/40 group-hover:bg-[#C98A2E] transition-colors" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Downhole Services & Equipment */}
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] font-mono tracking-widest text-[#C98A2E] uppercase font-bold mb-5 block">
                EQUIPMENT LINES
              </span>
              <ul className="space-y-2.5">
                {servicesDataList.map((svc: any, idx: number) => (
                  <li key={idx}>
                    <Link
                      href={svc.href}
                      className="text-[#A9AFB5] hover:text-white text-[13.5px] transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C98A2E]/40 group-hover:bg-[#C98A2E] transition-colors" />
                      <span>{svc.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Facility Coordinates & Map */}
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] font-mono tracking-widest text-[#C98A2E] uppercase font-bold mb-5 block">
                FACILITY COORDINATES
              </span>
              <div className="space-y-2.5 text-[13px] text-[#A9AFB5]">
                {addressText && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#C98A2E] mt-0.5 flex-shrink-0" />
                    <span>{addressText}</span>
                  </div>
                )}
                {phoneText && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-[#C98A2E] flex-shrink-0" />
                    <a href={`tel:${phoneText.replace(/[^\d+]/g, '')}`} className="hover:text-white font-mono">
                      {phoneText}
                    </a>
                  </div>
                )}
                {emailText && (
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-[#C98A2E] flex-shrink-0" />
                    <a href={`mailto:${emailText}`} className="hover:text-white">
                      {emailText}
                    </a>
                  </div>
                )}
              </div>

              <MapEmbed addressText={addressText} iframeHtml={contactInfo?.mapUrl} />
            </div>

          </div>

          {/* ── Bottom Bar ───────────────────────────────────── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5E6670] font-mono">
            <p className="text-center sm:text-left">
              {copyrightText}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy/" className="hover:text-[#A9AFB5] transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms/" className="hover:text-[#A9AFB5] transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <a
                href="https://mohsindesigns.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C98A2E] hover:underline"
              >
                Mohsin Design
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}