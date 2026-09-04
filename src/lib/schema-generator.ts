
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service" | "Article" | "BlogPosting";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
  servicesList?: Array<{ name: string; description?: string }>;
  datePublished?: string;
  dateModified?: string;
}

export function getHomepageSchemas(servicesList?: Array<{ name: string }>, faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string }>) {
  const defaultServices = [
    { name: "Deep Tissue Massage" },
    { name: "Sports Massage" },
    { name: "Myofascial Release" },
    { name: "Cupping Therapy" },
    { name: "Stretch Therapy" },
    { name: "Hot Stone Massage" }
  ];

  const serviceOffers = (servicesList && servicesList.length > 0 ? servicesList : defaultServices).map(s => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": s.name
    }
  }));

  const yoastGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/`,
        "url": `${BASE_URL}/`,
        "name": "Trinity Pump & Supply | Downhole Rod Pumps & Oilfield Supplies",
        "isPartOf": {
          "@id": `${BASE_URL}/#website`
        },
        "about": {
          "@id": `${BASE_URL}/#organization`
        },
        "datePublished": "2025-02-07T15:28:30+00:00",
        "dateModified": "2026-07-24T16:08:21+00:00",
        "description": "Your trusted partner for downhole rod pumps and oilfield supplies. Delivering high-quality USA-manufactured pump parts across Texas and New Mexico.",
        "breadcrumb": {
          "@id": `${BASE_URL}/#breadcrumb`
        },
        "inLanguage": "en",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              `${BASE_URL}/`
            ]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": `${BASE_URL}/`,
        "name": "Trinity Pump & Supply",
        "description": "Your Trusted Partner for Downhole Rod Pumps and Oilfield Supplies",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${BASE_URL}/?s={search_term_string}`
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "en"
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Trinity Pump & Supply",
        "url": `${BASE_URL}/`,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en",
          "@id": `${BASE_URL}/#/schema/logo/image/`,
          "url": "",
          "contentUrl": "",
          "caption": "Trinity Pump & Supply"
        },
        "image": {
          "@id": `${BASE_URL}/#/schema/logo/image/`
        },
        "sameAs": []
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Downhole Rod Pumps & Oilfield Supplies",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Trinity Pump & Supply",
      "image": `${BASE_URL}/logo.png`,
      "url": `${BASE_URL}/`,
      "telephone": "830-279-3996",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2501 FM 866",
        "addressLocality": "Odessa",
        "addressRegion": "TX",
        "postalCode": "79763",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "Place",
      "name": "Texas & New Mexico (Permian Basin)"
    },
    "description": "Trinity Pump & Supply provides high-quality USA-manufactured downhole rod pump parts, repair services, and oilfield supplies across Texas and New Mexico.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Oilfield Services & Supplies",
      "itemListElement": serviceOffers
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Trinity Pump & Supply",
    "image": `${BASE_URL}/logo.png`,
    "@id": `${BASE_URL}/`,
    "url": `${BASE_URL}/`,
    "telephone": "830-279-3996",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2501 FM 866",
      "addressLocality": "Odessa",
      "addressRegion": "TX",
      "postalCode": "79763",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.8457,
      "longitude": -102.3676
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "07:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [],
    "description": "Trinity Pump & Supply in Odessa, Texas specializes in manufacturing, building, and repairing downhole sucker rod pumps, rod rotators, and oilfield equipment across Texas and New Mexico."
  };

  let faqSchema: any = null;
  const validFaqs = (faqs || []).filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
  if (validFaqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${BASE_URL}/#faq`,
      "mainEntity": validFaqs.map(f => ({
        "@type": "Question",
        "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
        }
      }))
    };
  }

  return {
    yoastGraph,
    serviceSchema,
    localBusinessSchema,
    faqSchema
  };
}

export function generateSchema(options: SchemaOptions) {
  const {
    title,
    description,
    slug = "",
    type = "WebPage",
    faqs,
    breadcrumbTitle,
    isService,
    image,
    servicesList,
    datePublished = "2025-02-07T15:28:30+00:00",
    dateModified = "2026-07-24T16:08:21+00:00"
  } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const isRoot = normalizedSlug === '/' || normalizedSlug === '';

  if (isRoot) {
    return getHomepageSchemas(servicesList, faqs);
  }

  const pageUrl = `${BASE_URL}${normalizedSlug.endsWith('/') ? normalizedSlug : `${normalizedSlug}/`}`;

  // 1. Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Trinity Pump & Supply",
    "url": `${BASE_URL}/`,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://trinitypumpsupply.com/"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "Trinity Pump & Supply",
    "image": `${BASE_URL}/logo.png`,
    "telephone": "830-279-3996",
    "email": "trinitypumpsupply@gmail.com",
    "url": `${BASE_URL}/`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2501 FM 866",
      "addressLocality": "Odessa",
      "addressRegion": "TX",
      "postalCode": "79763",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.8457,
      "longitude": -102.3676
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Texas" },
      { "@type": "AdministrativeArea", "name": "New Mexico" },
      { "@type": "AdministrativeArea", "name": "Permian Basin" },
      { "@type": "AdministrativeArea", "name": "Odessa" },
      { "@type": "AdministrativeArea", "name": "Midland" }
    ],
    "priceRange": "$$"
  };

  // 3. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": `${BASE_URL}/`,
    "name": "Trinity Pump & Supply",
    "publisher": { "@id": `${BASE_URL}/#organization` }
  };

  // 4. BreadcrumbList Schema
  const pathSegments = (isService ? [safeSlug.replace(/^services\//, '').replace(/^\/+|\/+$/g, '')] : safeSlug.split('/')).filter(Boolean);
  const breadcrumbList = pathSegments.length > 0 ? {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      },
      ...pathSegments.map((segment, index) => {
        const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}/`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  } : null;

  // 5. WebPage / Service Schema
  const mainEntitySchema: any = {
    "@type": isService ? "Service" : type,
    "@id": `${pageUrl}#${(isService ? "service" : type).toLowerCase()}`,
    "url": pageUrl,
    "name": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {}),
    ...(image ? {
      "image": {
        "@type": "ImageObject",
        "url": image
      },
      "primaryImageOfPage": {
        "@id": `${pageUrl}#primaryimage`
      }
    } : {})
  };

  if (isService) {
    mainEntitySchema["provider"] = { "@id": `${BASE_URL}/#organization` };
    mainEntitySchema["serviceType"] = title;
  }

  // Companion WebPage schema for Service pages so both Service & WebPage have dates & relations
  const companionWebPageSchema: any = isService ? {
    "@type": "WebPage",
    "@id": `${pageUrl}`,
    "url": pageUrl,
    "name": `${title} | Trinity Pump & Supply`,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "inLanguage": "en",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "about": { "@id": `${pageUrl}#service` },
    ...(breadcrumbList ? { "breadcrumb": { "@id": `${pageUrl}#breadcrumb` } } : {})
  } : null;

  const graph: any[] = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema
  ];

  if (breadcrumbList) {
    graph.push(breadcrumbList);
  }

  if (companionWebPageSchema) {
    graph.push(companionWebPageSchema);
  }

  graph.push(mainEntitySchema);

  if (image) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}#primaryimage`,
      "url": image,
      "contentUrl": image
    });
  }

  if (faqs && Array.isArray(faqs) && faqs.length > 0) {
    const validFaqs = faqs.filter(f => (f.question || (f as any).q) && (f.answer || (f as any).a));
    if (validFaqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": validFaqs.map(f => ({
          "@type": "Question",
          "name": (f.question || (f as any).q || "").replace(/<[^>]*>/g, "").trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": (f.answer || (f as any).a || "").replace(/<[^>]*>/g, "").trim()
          }
        }))
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
