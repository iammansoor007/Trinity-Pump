"use client";

import { useState } from "react";
import { Send, Plus, Minus, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
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
    <section id="contact" className="bg-[#F5F3EE] py-24 md:py-32 relative overflow-hidden border-t border-[#E8E6E0]">
      {/* Precision background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern-black pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        {(formLabel || label || formTitle) && (
          <div className="max-w-2xl mb-14 text-left">
            {(formLabel || label) && (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-[2px] bg-[#C98A2E]" />
                <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                  {formLabel || label}
                </p>
              </div>
            )}
            {formTitle && (
              <h2 className="display-heading text-[30px] min-[400px]:text-[36px] md:text-[44px] text-[#0B1726] leading-[1.12] font-extrabold tracking-tight">
                {formTitle}
              </h2>
            )}
          </div>
        )}

        {/* 2-Column Industrial Split */}
        <div className={`grid grid-cols-1 ${hasRightColumn ? "lg:grid-cols-12 gap-12" : "max-w-3xl mx-auto"} items-start`}>
          
          {/* ── Left Column: Form ── */}
          <div className={`${hasRightColumn ? "lg:col-span-7" : "w-full"} bg-white border border-[#D6D3CC] p-8 sm:p-10 rounded-sm shadow-sm text-left relative`}>
            {/* Top technical accent */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C98A2E]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C98A2E]" />

            {/* Direct Hotline Bar */}
            {shopPhone && (
              <div className="mb-8 p-4 bg-[#0B1726] border border-[#14243A] rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#14243A] border border-[#C98A2E]/40 flex items-center justify-center text-[#C98A2E]">
                    <Phone size={15} />
                  </div>
                  <div>
                    {displayHotlineLabel && (
                      <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest block">
                        {displayHotlineLabel}
                      </span>
                    )}
                    <a
                      href={`tel:${shopPhone.replace(/[^\d+]/g, '')}`}
                      className="text-[#C98A2E] font-mono text-[14px] font-bold hover:underline"
                    >
                      {shopPhone}
                    </a>
                  </div>
                </div>
                {displayDispatch && (
                  <span className="hidden sm:inline-block text-white/40 text-[10.5px] font-mono uppercase">
                    {displayDispatch}
                  </span>
                )}
              </div>
            )}

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#C98A2E]/10 border border-[#C98A2E] text-[#C98A2E] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-[20px] font-bold text-[#0B1726] mb-2 font-serif">
                  {formBtnSuccess}
                </h3>
                <p className="text-[#5E6670] text-[14px] max-w-md mx-auto">
                  {formSuccessToast}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-gold mt-6 text-[11px] font-mono uppercase tracking-widest px-6 py-2.5 cursor-pointer"
                >
                  {formBtnReset}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {formNameLabel && (
                      <label className="text-[#0B1726] text-[11px] font-mono uppercase tracking-wider font-bold block mb-1.5">
                        {formNameLabel}
                      </label>
                    )}
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={formNamePlaceholder}
                      className="w-full bg-[#F5F3EE] border border-[#D6D3CC] focus:border-[#C98A2E] focus:outline-none px-4 py-3 text-[14px] text-[#0B1726] rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    {formEmailLabel && (
                      <label className="text-[#0B1726] text-[11px] font-mono uppercase tracking-wider font-bold block mb-1.5">
                        {formEmailLabel}
                      </label>
                    )}
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={formEmailPlaceholder}
                      className="w-full bg-[#F5F3EE] border border-[#D6D3CC] focus:border-[#C98A2E] focus:outline-none px-4 py-3 text-[14px] text-[#0B1726] rounded-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {formPhoneLabel && (
                      <label className="text-[#0B1726] text-[11px] font-mono uppercase tracking-wider font-bold block mb-1.5">
                        {formPhoneLabel}
                      </label>
                    )}
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={formPhonePlaceholder}
                      className="w-full bg-[#F5F3EE] border border-[#D6D3CC] focus:border-[#C98A2E] focus:outline-none px-4 py-3 text-[14px] text-[#0B1726] rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    {formServiceLabel && (
                      <label className="text-[#0B1726] text-[11px] font-mono uppercase tracking-wider font-bold block mb-1.5">
                        {formServiceLabel}
                      </label>
                    )}
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D6D3CC] focus:border-[#C98A2E] focus:outline-none px-4 py-3 text-[14px] text-[#0B1726] rounded-sm font-sans"
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
                  {formMessageLabel && (
                    <label className="text-[#0B1726] text-[11px] font-mono uppercase tracking-wider font-bold block mb-1.5">
                      {formMessageLabel}
                    </label>
                  )}
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={formMessagePlaceholder}
                    className="w-full bg-[#F5F3EE] border border-[#D6D3CC] focus:border-[#C98A2E] focus:outline-none px-4 py-3 text-[14px] text-[#0B1726] rounded-sm font-sans"
                  />
                </div>

                {errorMessage && (
                  <p className="text-rose-600 text-xs font-mono">{errorMessage}</p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[11.5px] font-mono uppercase tracking-widest px-8 py-3.5 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? formBtnSubmitting : formBtnSubmit}</span>
                    <Send size={13} />
                  </button>

                  {(trustHipa || trustResponse) && (
                    <div className="flex items-center gap-4 text-[11.5px] text-[#5E6670] font-mono">
                      {trustHipa && typeof trustHipa === 'string' && <span>✓ {trustHipa}</span>}
                      {trustResponse && typeof trustResponse === 'string' && <span>✓ {trustResponse}</span>}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* ── Right Column: Dynamic FAQ & Coordinates ── */}
          {hasRightColumn && (
            <div className="lg:col-span-5 text-left flex flex-col justify-between">
              <div>
                {displayFaqLabel && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-[2px] bg-[#C98A2E]" />
                    <p className="text-[#C98A2E] text-[11px] font-mono tracking-[0.2em] uppercase font-bold">
                      {displayFaqLabel}
                    </p>
                  </div>
                )}

                {displayFaqTitle && (
                  <h3 className="display-heading text-[24px] sm:text-[28px] md:text-[32px] text-[#0B1726] leading-tight font-bold mb-6">
                    {displayFaqTitle}
                  </h3>
                )}

                {/* Dynamic FAQ Accordion */}
                {activeFaqs && activeFaqs.length > 0 && (
                  <div className="space-y-3">
                    {activeFaqs.map((faq: any, fIdx: number) => {
                      const isOpen = openIdx === fIdx;
                      return (
                        <div
                          key={fIdx}
                          className="bg-white border border-[#D6D3CC] rounded-sm overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => setOpenIdx(isOpen ? null : fIdx)}
                            className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#F5F3EE]/50 transition-colors"
                          >
                            <span className="text-[#0B1726] text-[14.5px] font-semibold leading-snug">
                              {faq.q}
                            </span>
                            <span className="text-[#C98A2E] flex-shrink-0">
                              {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </span>
                          </button>

                          {isOpen && faq.a && (
                            <div className="px-5 pb-5 pt-1 border-t border-[#E8E6E0] text-[#5E6670] text-[14px] leading-[1.75]">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Shop Coordinates Card */}
              {(shopAddress || shopHours) && (
                <div className="mt-8 p-6 bg-[#E8E6E0] border border-[#D6D3CC] rounded-sm text-left">
                  {displayLocationTitle && (
                    <span className="text-[#0B1726] font-mono text-[11px] font-bold uppercase tracking-wider block mb-3">
                      {displayLocationTitle}
                    </span>
                  )}
                  {shopAddress && (
                    <div className="flex items-start gap-2.5 text-[13px] text-[#5E6670] mb-2">
                      <MapPin size={15} className="text-[#C98A2E] mt-0.5 flex-shrink-0" />
                      <span>{shopAddress}</span>
                    </div>
                  )}
                  {shopHours && (
                    <div className="flex items-start gap-2.5 text-[13px] text-[#5E6670]">
                      <Clock size={15} className="text-[#C98A2E] mt-0.5 flex-shrink-0" />
                      <span>{shopHours}</span>
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