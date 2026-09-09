"use client";

import { useContent } from "../hooks/useContent";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

/* ── Logo ──────────────────────────────────────────────── */
function FooterLogo({ logoUrl, siteTitle, logoText1, logoText2 }: { logoUrl?: string; siteTitle?: string; logoText1?: string; logoText2?: string }) {
  if (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/uploads') || logoUrl.startsWith('/cdn-images'))) {
    return (
      <Link href="/" className="inline-flex items-center gap-3 mb-6">
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
    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
      <div className="w-10 h-11 bg-ink-700 border border-gold/50 flex items-center justify-center rounded-sm group-hover:border-gold transition-colors">
        <svg width="24" height="28" viewBox="0 0 42 48" fill="none">
          <path d="M21 1L40 9.5V25C40 36.5 31.5 44.5 21 47C10.5 44.5 2 36.5 2 25V9.5L21 1Z" fill="#C98A2E" />
          <text x="21" y="33" textAnchor="middle" fill="#0B1726" fontFamily="sans-serif" fontSize="22" fontWeight="bold">T</text>
        </svg>
      </div>
      <span className="flex flex-col text-left">
        <span className="font-heading text-[17px] font-bold tracking-[0.12em] text-white leading-none">
          {logoText1 || "TRINITY"}
        </span>
        <span className="font-mono text-[9.5px] font-semibold tracking-[0.2em] text-gold mt-1.5 leading-none uppercase">
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
    <div className="flex gap-2 mt-6 justify-start">
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
            className="w-9 h-9 rounded-sm border border-white/12 flex items-center justify-center text-white/55 hover:text-gold hover:border-gold/60 transition-colors duration-200"
          >
            <IconComponent size={14} strokeWidth={1.6} />
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
        className="mt-5 h-[130px] w-full rounded-sm overflow-hidden border border-white/12 relative grayscale-[0.35]"
        dangerouslySetInnerHTML={{ __html: styledIframe }}
      />
    );
  }
  if (!addressText) return null;
  const encoded = encodeURIComponent(addressText);
  return (
    <div className="mt-5 h-[130px] w-full rounded-sm overflow-hidden border border-white/12 relative grayscale-[0.35]">
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
    <footer className="on-ink bg-ink-900 border-t border-white/10 text-white">

      {/* ── Utility strip ── */}
      {(phoneText || addressText || hoursText) && (
        <div className="border-b border-white/10">
          <div className="site-container flex flex-col md:flex-row items-center justify-between gap-4 py-5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-7">
              {addressText && (
                <span className="meta text-white/85">
                  {addressText.split(',')[0]} Facility
                </span>
              )}
              {hoursText && (
                <span className="meta meta-on-ink inline-flex items-center gap-2">
                  <Clock size={12} className="text-gold" />
                  {hoursText.replace(/\n/g, ' • ')}
                </span>
              )}
            </div>

            {phoneText && (
              <a
                href={`tel:${phoneText.replace(/[^\d+]/g, '')}`}
                className="link-arrow link-arrow-on-ink"
              >
                <Phone size={12} />
                <span className="tnum">{phoneText}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Columns ── */}
      <div className="site-container pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.2fr_1.4fr] gap-12 lg:gap-14 pb-12 border-b border-white/10">

          {/* Company */}
          <div className="flex flex-col items-start text-left">
            <FooterLogo
              logoUrl={(navbar as any)?.logo}
              siteTitle={(navbar as any)?.siteTitle}
              logoText1={(navbar as any)?.logoText1}
              logoText2={(navbar as any)?.logoText2}
            />
            {brandDescriptionText && (
              <p className="text-[13.5px] leading-[1.8] text-white/55 max-w-[320px]">
                {brandDescriptionText}
              </p>
            )}
            <SocialIcons socialItems={socialLinks} />
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-start text-left">
            <span className="meta text-gold-soft mb-6">Navigation</span>
            <ul className="space-y-3">
              {quickLinksData.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment lines */}
          <div className="flex flex-col items-start text-left">
            <span className="meta text-gold-soft mb-6">Equipment Lines</span>
            <ul className="space-y-3">
              {servicesDataList.map((svc: any, idx: number) => (
                <li key={idx}>
                  <Link
                    href={svc.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinates */}
          <div className="flex flex-col items-start text-left w-full">
            <span className="meta text-gold-soft mb-6">Facility Coordinates</span>
            <div className="space-y-3.5 text-[13.5px] text-white/60 w-full">
              {addressText && (
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{addressText}</span>
                </div>
              )}
              {phoneText && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-gold flex-shrink-0" />
                  <a href={`tel:${phoneText.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors tnum">
                    {phoneText}
                  </a>
                </div>
              )}
              {emailText && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-gold flex-shrink-0" />
                  <a href={`mailto:${emailText}`} className="hover:text-white transition-colors break-all">
                    {emailText}
                  </a>
                </div>
              )}
            </div>

            <MapEmbed addressText={addressText} iframeHtml={contactInfo?.mapUrl} />
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-white/40 text-center sm:text-left">
            {copyrightText}
          </p>
          <div className="flex items-center gap-5 text-[12.5px] text-white/40">
            <Link href="/privacy/" className="hover:text-white/75 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-white/75 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://mohsindesigns.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-soft hover:text-white transition-colors"
            >
              Mohsin Design
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
