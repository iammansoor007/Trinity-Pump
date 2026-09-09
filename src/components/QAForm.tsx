"use client";

import { useState } from "react";
import { Send, Plus, Minus, Phone, MapPin, Clock, Check } from "lucide-react";
import { useContent } from "../hooks/useContent";

interface QAFormProps {
  data?: any;
  pageData?: any;
}

export default function ContactFaqSection({ data, pageData }: QAFormProps = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { contactFaq: hookContactFaq, footer, services: hookServices } = useContent();

  const contactFaq = data || pageData?.content?.contactFaq || pageData?.content?.quote || hookContactFaq || {};
  const servicesData = pageData?.content?.services || hookServices || {};

  const {
    label,
    faqLabel,
    faqTitle,
    formLabel,
    formTitle,
    formNameLabel = contactFaq.nameLabel || "Full Name",
    formNamePlaceholder = "",
    formEmailLabel = contactFaq.emailLabel || "Email Address",
    formEmailPlaceholder = "",
    formPhoneLabel = contactFaq.phoneLabel || "Phone Number",
    formPhonePlaceholder = "",
    formServiceLabel = contactFaq.serviceLabel || "Service / Equipment",
    formServicePlaceholder = "Select an option",
    formMessageLabel = contactFaq.messageLabel || "Message",
    formMessagePlaceholder = "",
    formBtnSubmit = "Send Request",
    formBtnSuccess = "Request Sent Successfully",
    formSuccessToast = "Thank you! Your inquiry has been sent. We will respond promptly.",
    formBtnReset = "Submit Another Request",
    formBtnSubmitting = "Sending...",
    trustHipa,
    trustResponse,
    formServicesOptions = [],
    faqs = [],
    contactInfo,
    hotlineLabel,
    dispatchBadge,
    locationTitle
  } = contactFaq || {};

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Dynamic service dropdown options
  const serviceOptions = (formServicesOptions && formServicesOptions.length > 0)
    ? formServicesOptions
    : (servicesData?.services || []).map((s: any) => s.title || s.name).filter(Boolean);

  // Dynamic contact details
  const shopPhone = contactInfo?.phone || contactFaq?.phone || footer?.contact?.phone || "";
  const shopAddress = contactInfo?.address || contactFaq?.address || footer?.contact?.address || "";
  const shopHours = contactInfo?.hours || contactFaq?.hours || footer?.contact?.hours || "";
  const displayHotlineLabel = hotlineLabel || contactFaq?.phoneLabel || footer?.contact?.hotlineLabel || "";
  const displayDispatch = dispatchBadge || contactFaq?.statusLabel || "";
  const displayLocationTitle = locationTitle || contactFaq?.addressTitle || footer?.contact?.locationTitle || "";

  // Dynamic FAQs resolution
  const resolvedFaqItems = (faqs && faqs.length > 0)
    ? faqs
    : (pageData?.content?.faq?.items || hookContactFaq?.faqs || []);

  const activeFaqs = (resolvedFaqItems && resolvedFaqItems.length > 0) ? resolvedFaqItems.map((f: any) => ({
    q: typeof f?.question === 'string' ? f.question : (typeof f?.q === 'string' ? f.q : (typeof f?.title === 'string' ? f.title : "")),
    a: typeof f?.answer === 'string' ? f.answer : (typeof f?.a === 'string' ? f.a : (typeof f?.desc === 'string' ? f.desc : (typeof f?.description === 'string' ? f.description : "")))
  })).filter((f: any) => f.q && f.a) : [];

  const displayFaqLabel = typeof (pageData?.content?.faq?.section?.badge || pageData?.faqBadge || pageData?.content?.faqBadge || faqLabel) === 'string'
    ? (pageData?.content?.faq?.section?.badge || pageData?.faqBadge || pageData?.content?.faqBadge || faqLabel)
    : "";
  const displayFaqTitle = typeof (pageData?.content?.faq?.section?.headline || pageData?.content?.faq?.section?.title || pageData?.faqTitle || pageData?.content?.faqTitle || faqTitle) === 'string'
    ? (pageData?.content?.faq?.section?.headline || pageData?.content?.faq?.section?.title || pageData?.faqTitle || pageData?.content?.faqTitle || faqTitle)
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: "Contact & FAQ Section"
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || "Failed to submit request. Please reach out directly.");
      }
    } catch {
      setErrorMessage("Network error. Please try again or reach out directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRightColumn = Boolean(displayFaqTitle || (activeFaqs && activeFaqs.length > 0) || shopAddress || shopHours);

  return (
    <section id="contact" className="bg-paper-pure section-y border-y border-line">
      <div className="site-container">

        {/* Header */}
        {(formLabel || label || formTitle) && (
          <div className="max-w-2xl mb-14">
            {(formLabel || label) && (
              <div className="eyebrow mb-6">{formLabel || label}</div>
            )}
            {formTitle && <h2 className="h-section text-balance">{formTitle}</h2>}
          </div>
        )}

        <div className={`grid grid-cols-1 ${hasRightColumn ? "lg:grid-cols-12 gap-10 lg:gap-14" : "max-w-2xl"} items-start`}>

          {/* ── Form ── */}
          <div className={`${hasRightColumn ? "lg:col-span-7" : "w-full"} bg-paper border border-line rounded p-7 sm:p-9`}>

            {/* Hotline */}
            {shopPhone && (
              <div className="mb-8 pb-8 border-b border-line flex flex-wrap items-center justify-between gap-4">
                <div>
                  {displayHotlineLabel && (
                    <span className="meta block mb-2">{displayHotlineLabel}</span>
                  )}
                  <a
                    href={`tel:${shopPhone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-2.5 font-heading text-[21px] sm:text-[24px] font-medium tracking-tight text-ink-900 hover:text-gold-ink transition-colors tnum"
                  >
                    <Phone size={17} className="text-gold" />
                    <span>{shopPhone}</span>
                  </a>
                </div>
                {displayDispatch && (
                  <span className="meta inline-flex items-center gap-2 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {displayDispatch}
                  </span>
                )}
              </div>
            )}

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full border border-gold text-gold flex items-center justify-center mx-auto mb-5">
                  <Check size={22} strokeWidth={2.5} />
                </div>
                <h3 className="h-sub mb-3">{formBtnSuccess}</h3>
                <p className="copy max-w-md mx-auto">{formSuccessToast}</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline btn-sm mt-7"
                >
                  {formBtnReset}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {formNameLabel && <label className="field-label">{formNameLabel}</label>}
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={formNamePlaceholder}
                      className="field"
                    />
                  </div>

                  <div>
                    {formEmailLabel && <label className="field-label">{formEmailLabel}</label>}
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={formEmailPlaceholder}
                      className="field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {formPhoneLabel && <label className="field-label">{formPhoneLabel}</label>}
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={formPhonePlaceholder}
                      className="field"
                    />
                  </div>

                  <div>
                    {formServiceLabel && <label className="field-label">{formServiceLabel}</label>}
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="field cursor-pointer"
                    >
                      <option value="">{formServicePlaceholder}</option>
                      {serviceOptions.map((opt: any, oIdx: number) => {
                        const optLabel = typeof opt === 'string' ? opt : (opt?.label || opt?.name || opt?.title || opt?.value || "");
                        const optValue = typeof opt === 'string' ? opt : (opt?.value || opt?.id || opt?.label || "");
                        return (
                          <option key={oIdx} value={optValue}>
                            {optLabel}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  {formMessageLabel && <label className="field-label">{formMessageLabel}</label>}
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={formMessagePlaceholder}
                    className="field resize-y"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[13px] text-red-700">{errorMessage}</p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full sm:w-auto disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? formBtnSubmitting : formBtnSubmit}</span>
                    <Send size={13} />
                  </button>

                  {(trustHipa || trustResponse) && (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      {trustHipa && typeof trustHipa === 'string' && (
                        <span className="meta inline-flex items-center gap-1.5">
                          <Check size={12} className="text-gold" strokeWidth={3} />{trustHipa}
                        </span>
                      )}
                      {trustResponse && typeof trustResponse === 'string' && (
                        <span className="meta inline-flex items-center gap-1.5">
                          <Check size={12} className="text-gold" strokeWidth={3} />{trustResponse}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* ── FAQ + location ── */}
          {hasRightColumn && (
            <div className="lg:col-span-5">
              {displayFaqLabel && <div className="eyebrow mb-6">{displayFaqLabel}</div>}

              {displayFaqTitle && (
                <h3 className="h-sub text-balance mb-7">{displayFaqTitle}</h3>
              )}

              {activeFaqs && activeFaqs.length > 0 && (
                <div className="border-t border-line">
                  {activeFaqs.map((faq: any, fIdx: number) => {
                    const isOpen = openIdx === fIdx;
                    return (
                      <div key={fIdx} className="border-b border-line">
                        <button
                          onClick={() => setOpenIdx(isOpen ? null : fIdx)}
                          aria-expanded={isOpen}
                          className="w-full py-5 flex items-start justify-between gap-5 text-left cursor-pointer group"
                        >
                          <span className={`text-[15px] font-medium leading-snug transition-colors ${isOpen ? "text-gold-ink" : "text-ink-900 group-hover:text-gold-ink"}`}>
                            {faq.q}
                          </span>
                          <span className="flex-shrink-0 mt-0.5 text-gold">
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        </button>

                        {isOpen && faq.a && (
                          <div className="pb-6 pr-8 copy">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {(shopAddress || shopHours) && (
                <div className="mt-10 p-7 bg-paper border border-line rounded">
                  {displayLocationTitle && (
                    <span className="meta block mb-5">{displayLocationTitle}</span>
                  )}
                  {shopAddress && (
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] leading-relaxed text-[color:var(--text-body)] whitespace-pre-line">
                        {shopAddress}
                      </span>
                    </div>
                  )}
                  {shopHours && (
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] leading-relaxed text-[color:var(--text-body)] whitespace-pre-line">
                        {shopHours}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
