const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const fs = require('fs');
const path = require('path');
const { MongoClient, BSON } = require('mongodb');

const exportDir = path.resolve(__dirname, '../backup/mongodb_export');
const targetUri = process.env.MONGODB_URI || 
  'mongodb+srv://ammansoor0077_db_user:7DgsNDPSTSi3PX7f@cluster0.sqgewel.mongodb.net/eagle_revolution?retryWrites=true&w=majority&appName=Cluster0';

const clientData = {
  companyName: "Trinity Pump & Supply",
  tagline: "Your Trusted Partner for Downhole Rod Pumps and Oilfield Supplies",
  subTagline: "Delivering High-Quality USA-Manufactured Pump Parts and Services Across Texas and New Mexico.",
  description: "At Trinity Pump & Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in manufacturing, building, and repairing downhole sucker rod pumps. Operating throughout Texas and New Mexico, we serve oilfield operators with a focus on lowering pump-related lifting costs and maximizing production efficiency.",
  philosophy: "In the oilfield industry, it’s not just about what you pay, but how many times you pay it. By focusing on producing high-quality, long-lasting pump parts, we help you minimize pulling costs and extend the lifespan of your equipment. With every pump we build or repair, our goal is to lower your pump-related lifting costs and maximize the longevity of your well’s performance.",
  domain: "https://trinitypumpsupply.com",
  phone: "830-279-3996",
  email: "trinitypumpsupply@gmail.com",
  address: "2501 FM 866, Odessa, TX 79763",
  mapUrl: "https://maps.app.goo.gl/weqJ228Rxmmatg7L8",
  hours: "Mon–Fri: 7:00 AM – 6:00 PM | 24/7 Field & Emergency Support",
  team: [
    { name: "Olin Brown", title: "President", phone: "830-279-3996", email: "trinitypumpsupply@gmail.com" },
    { name: "Sim Brown", title: "Project Manager", phone: "432-413-1110", email: "trinitypumpsupply@gmail.com" },
    { name: "Josh Storey", title: "Shop Manager", phone: "432-556-5733", email: "trinitypumpsupply@gmail.com" }
  ],
  services: [
    {
      id: "01",
      number: "01",
      name: "Downhole Rod Pumps",
      title: "Downhole Rod Pumps",
      slug: "downhole-rod-pumps",
      tag: "Rod Pumps",
      icon: "Settings",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788188108/corrective_1788188108828.png",
      status: "published",
      subheadline: "Precision Engineering for Maximum Pump Life",
      description: "Our downhole rod pumps are built to last, with bore sizes ranging from 1-1/16” to 3-3/4”. Whether you need a new pump or a repair, we use only the highest quality materials and proven engineering techniques to ensure long-lasting, reliable performance. Each pump we manufacture or repair is designed to minimize downtime and reduce lifting costs, giving you the peace of mind that your operations are running efficiently.",
      offerings: [
        "New downhole rod pump construction",
        "Pump repair and reconditioning",
        "Pump design customized to your well conditions",
        "Longer pump run life to reduce pulling costs"
      ],
      benefits: [
        { title: "Customized Pump Design", description: "Engineered specifically for your well depth, fluid gravity, and production volume." },
        { title: "USA-Made High-Quality Alloys", description: "Alloy steel, 316 Stainless, and Monel parts designed for high durability and corrosion resistance." },
        { title: "Lower Lifting Costs", description: "Longer pump runs minimize pulling unit frequency and equipment downtime." },
        { title: "Precision Reconditioning", description: "Thorough teardown, inspection, re-barreling, and testing before reinstallation." }
      ]
    },
    {
      id: "02",
      number: "02",
      name: "Burleson HD Rod Rotator",
      title: "Burleson HD Rod Rotator",
      slug: "hd-rod-rotator",
      tag: "Rod Rotator",
      icon: "RotateCw",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788188207/sports-massage_1788188207599.png",
      status: "published",
      subheadline: "Field-Proven Rod Rotator Engineered to Outperform",
      description: "Gave Trinity Pump & Supply a chance with their rod rotators and they have not skipped a beat. With recommended maintenance (greasing accordingly), our Burleson HD Rod Rotators have proven themselves to be bulletproof. Designed for operators who want equipment they can 'set it and forget it' without loose arm issues.",
      offerings: [
        "Heavy-duty internal gearing and robust arm design",
        "Continuous and reliable rod string rotation",
        "Even wear distribution along tubing and rod strings",
        "Field-tested reliability across harsh Permian Basin conditions"
      ],
      benefits: [
        { title: "Eliminates Loose Arm Failures", description: "Proven design that stays tight and rotates continuously under heavy loads." },
        { title: "Extends Rod & Tubing Lifespan", description: "Even rod wear prevents premature tubing cuts and rod parting." },
        { title: "Low Maintenance Requirement", description: "Routine greasing keeps the rotator operating flawlessly for extended cycles." },
        { title: "Outperforms Big-Name Competitors", description: "Built with rugged materials that withstand extreme field demands." }
      ]
    },
    {
      id: "03",
      number: "03",
      name: "Downhole Supplies",
      title: "Downhole Supplies",
      slug: "downhole-supplies",
      tag: "Downhole",
      icon: "Package",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788188234/infrared_1788188234520.jpg",
      status: "published",
      subheadline: "Comprehensive Inventory for Your Operational Needs",
      description: "We stock a full range of downhole supplies to support your oilfield operations. Our inventory includes everything you need to keep your wells producing efficiently, from replacement parts to essential tools. With Trinity Pump & Supply, you can count on timely delivery and top-quality materials designed to withstand the rigors of oilfield work.",
      offerings: [
        "Tubing and rod string equipment",
        "Multiple Gas/Sand separator options",
        "Tubing Anchor Catchers (TAC)",
        "On-off tools, seating nipples, and hold-downs"
      ],
      benefits: [
        { title: "Immediate Inventory Availability", description: "Ready-to-deploy downhole components in stock at our Odessa shop." },
        { title: "Effective Gas & Sand Separation", description: "Protect your downhole pumps against gas interference and abrasive sand." },
        { title: "Reliable String Anchoring", description: "Tubing anchor catchers engineered to hold securely and release easily when needed." },
        { title: "Rigorous Quality Assurance", description: "All components inspected to meet or exceed industry standards." }
      ]
    },
    {
      id: "04",
      number: "04",
      name: "General Oilfield Supplies",
      title: "General Oilfield Supplies",
      slug: "general-oilfield-supplies",
      tag: "Oilfield Supplies",
      icon: "Wrench",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788190458/stretch_1788190458587.jpg",
      status: "published",
      subheadline: "Everything You Need for Oilfield Maintenance and Operation",
      description: "From general equipment to complete battery hookups to complete Wellhead hookups, Trinity Pump & Supply offers a comprehensive range of oilfield supplies. Whether you need valves, fittings, or other essential materials, we have you covered with products that meet the highest industry standards. Our goal is to provide the best supplies that support the smooth operation of your wells.",
      offerings: [
        "Valves (ball valves, check valves, plug valves)",
        "Wellhead hookups, BOPs, Stuffing Boxes, and Flanges",
        "Tank battery supplies and manifold equipment",
        "High-pressure fittings, swages, and nipples"
      ],
      benefits: [
        { title: "Complete Wellhead Solutions", description: "From stuffing box packing to flowline connections, we supply full hookups." },
        { title: "Pressure-Rated Reliability", description: "Valves and fittings certified for demanding Permian Basin pressure regimes." },
        { title: "Battery Connections", description: "Everything required for reliable tank battery plumbing and manifold setups." },
        { title: "Fast Delivery to Wellsite", description: "Prompt dispatch across Texas and New Mexico to keep workovers on schedule." }
      ]
    },
    {
      id: "05",
      number: "05",
      name: "Poly Pipe and Fittings",
      title: "Poly Pipe and Fittings",
      slug: "poly-pipe-and-fittings",
      tag: "Piping & Fittings",
      icon: "Layers",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788188380/hot-towel_1788188380929.jpg",
      status: "published",
      subheadline: "Durable, High-Quality Materials for Your Oilfield Operations",
      description: "We supply a wide range of poly pipe and fittings designed for oilfield applications. Our poly pipe solutions are built to last, providing the strength and flexibility needed to perform under the most demanding conditions. From installations to repairs, we ensure you have the right materials to get the job done efficiently.",
      offerings: [
        "Poly pipe for water transportation and well servicing",
        "A variety of sizes and pressure ratings (SDR ratings)",
        "Electrofusion and butt-fusion poly fittings",
        "Expert guidance on selecting the right materials for your operation"
      ],
      benefits: [
        { title: "Corrosion-Free Longevity", description: "Poly pipe withstands harsh produced water, chemicals, and corrosive fluids." },
        { title: "Flexible & High-Strength", description: "Absorbs terrain variations and pressure surges without cracking." },
        { title: "Full Range of Fittings", description: "Tees, elbows, transition fittings, and flanged adapters in stock." },
        { title: "Proven Field Performance", description: "Trusted by operators across the Permian Basin for reliable transfer lines." }
      ]
    },
    {
      id: "06",
      number: "06",
      name: "Battery & Well head Supplies",
      title: "Battery & Well head Supplies",
      slug: "battery-wellhead-supplies",
      tag: "Wellhead & Battery",
      icon: "Shield",
      image: "https://res.cloudinary.com/dytytwyp6/image/upload/v1788188415/myofascial-massage_1788188415171.png",
      status: "published",
      subheadline: "Complete Battery Hookups and Wellhead Solutions",
      description: "Comprehensive wellhead and tank battery equipment designed to keep production moving safely. From blowout preventers (BOPs) to stuffing boxes, flanges, and battery header manifolds, Trinity Pump & Supply delivers quality and durability.",
      offerings: [
        "Complete wellhead hookups and flow tees",
        "Stuffing boxes and high-durability cone packing",
        "Blowout preventers (BOPs) and rod locks",
        "Tank battery headers, dump valves, and level controls"
      ],
      benefits: [
        { title: "Leak-Free Wellhead Integrity", description: "Premium stuffing boxes and packings prevent fluid leakage and environmental contamination." },
        { title: "Safety First", description: "BOPs and certified pressure components keep crews and well sites secure." },
        { title: "Streamlined Battery Plumb", description: "Pre-fabricated and modular components for rapid battery hookups." },
        { title: "Expert Sizing & Configuration", description: "Our shop team assists in matching exact hookup specs to your wellhead." }
      ]
    }
  ],
  testimonials: [
    {
      name: "Major Oil/Gas Company",
      position: "Production Operations",
      company: "Permian Basin",
      rating: 5,
      text: "We were recently using rod rotators from a well-known competitor and occasionally had to have crews return to sites due reports of the arms being completely loose with a 'not connected to anything' kind of feel, and/or not rotating entirely. The competitor continued to give excuses as to why we had reoccurring issues when we would take them in for a repair/exchange. Gave Trinity Pump & Supply a chance with their rod rotators and they have not skipped a beat. With the recommended maintenance (greasing accordingly) they have proven themselves to be bulletproof. Their products can be put up against any of the big name companies and Trinity’s rotator will outperform them all. At this point I will not even consider giving any other company an opportunity to test their rotator and spend the time listing to their sales pitch. If you want a product in the field that you can essentially 'set it and forget it', a rod rotator from Trinity Pump & Supply will check off that box."
    },
    {
      name: "Michael Snider",
      position: "Operations",
      company: "ConocoPhillips",
      rating: 5,
      text: "Been doing business with Olin and his team over at Trinity Pump & Supply for a couple years now and can’t say enough great things about them. With every request and task that has been thrown their way, they have gone above and beyond to ensure we’re not left hanging. The service they provide and expertise on their products is unmatched. They might still be considered as a small outfit now, but I believe it won’t take long for them to become a leader in the industry."
    },
    {
      name: "Sabinal Energy",
      position: "Field Operations",
      company: "Permian Basin",
      rating: 5,
      text: "The quickest most reliable service we have ever received in the Permian Basin."
    }
  ],
  commitments: [
    { num: "01", title: "Honesty and Transparency", desc: "Clear communication and trustworthy business practices on every order." },
    { num: "02", title: "Timely Delivery", desc: "We meet your deadlines, every time, to keep your rigs and wells running." },
    { num: "03", title: "Quality at All Costs", desc: "We never compromise on the quality of our USA-made downhole parts." },
    { num: "04", title: "Service Excellence", desc: "We aim to exceed expectations with every project and repair." },
    { num: "05", title: "Competitive Pricing", desc: "Unmatched value without sacrificing the durability of your equipment." }
  ],
  whyChoose: [
    { label: "Over 100+ Years of Expertise", desc: "Our team’s extensive experience guarantees you receive the highest quality products and the best solutions tailored to your needs.", suitability: "100+ YRS" },
    { label: "Quality You Can Trust", desc: "We exclusively use high-quality USA manufactured alloy steel, 316 Stainless, and Monel for our downhole pump parts.", suitability: "USA-MADE" },
    { label: "Lower Lifting Costs", desc: "We focus on extending the lifespan of your pump parts, minimizing replacements and repairs to lower your overall lifting costs.", suitability: "COST EFFICIENCY" },
    { label: "Timely Delivery and Service", desc: "We understand the importance of timely service in the oilfield, ensuring on-time deliveries and constant communication.", suitability: "24/7 SUPPORT" }
  ],
  faqs: [
    { question: "What bore sizes do your downhole rod pumps support?", answer: "Our downhole rod pumps are built to last, with bore sizes ranging from 1-1/16” to 3-3/4”. Whether you need new construction or pump reconditioning, we tailor the pump design to your specific well conditions." },
    { question: "What materials are used for your downhole pump parts?", answer: "We exclusively use high-quality USA-manufactured alloy steel, 316 Stainless, and Monel for our downhole pump parts to ensure longer pump runs and significantly lower pulling costs." },
    { question: "What geographic areas do you serve?", answer: "We proudly operate throughout Texas and New Mexico, with our central shop and yard conveniently located at 2501 FM 866 in Odessa, TX." },
    { question: "What makes the Burleson HD Rod Rotator outperform competitors?", answer: "Our Burleson HD Rod Rotators are engineered with heavy-duty gearing and arms that eliminate loose arm failures. With routine greasing, they provide reliable 'set it and forget it' rotation." },
    { question: "Do you offer emergency delivery and well evaluations?", answer: "Yes. Our team brings over 100+ years of combined experience and is available for well evaluations, pump inspections, and rapid parts delivery across the Permian Basin." }
  ]
};

async function transformAndSeed() {
  console.log('--- TRANSFORMING DATA FOR TRINITY PUMP & SUPPLY ---');

  // 1. Transform site_contents.json
  const scPath = path.join(exportDir, 'site_contents.json');
  const scData = BSON.EJSON.parse(fs.readFileSync(scPath, 'utf8'), { relaxed: false });
  const completeDoc = scData.find(x => x.key === 'complete_data');

  if (completeDoc && completeDoc.data) {
    const d = completeDoc.data;

    // Settings
    d.settings = {
      ...d.settings,
      siteTitle: "Trinity Pump & Supply | Downhole Rod Pumps & Oilfield Supplies",
      siteTemplate: "| Trinity Pump & Supply",
      siteDescription: "Delivering High-Quality USA-Manufactured Pump Parts and Services Across Texas and New Mexico. 100+ Years Combined Oilfield Experience.",
      siteUrl: clientData.domain,
      companyName: clientData.companyName,
      contactEmail: clientData.email,
      contactPhone: clientData.phone,
      contactAddress: clientData.address
    };

    // Company
    d.company = {
      name: clientData.companyName,
      tagline: clientData.tagline,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      hours: clientData.hours,
      mapUrl: clientData.mapUrl
    };

    // Navbar
    d.navbar = {
      ...d.navbar,
      logoText1: "TRINITY",
      logoText2: "PUMP & SUPPLY",
      siteTitle: "Trinity Pump & Supply",
      bookBtn: "CONTACT US",
      logoAlt: "Trinity Pump & Supply Logo",
      companyLinks: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "HD Rod Rotator", href: "/hd-rod-rotator" },
        { label: "About Us", href: "/about-us" },
        { label: "Reviews", href: "/#reviews" },
        { label: "Contact Us", href: "/contact-us" }
      ],
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "HD Rod Rotator", href: "/hd-rod-rotator" },
        { label: "About Us", href: "/about-us" },
        { label: "Reviews", href: "/#reviews" },
        { label: "Contact Us", href: "/contact-us" }
      ]
    };

    // Hero
    d.hero = {
      ...d.hero,
      badge: "DELIVERING ACROSS TEXAS & NEW MEXICO",
      label: "TRUSTED DOWNHOLE OILFIELD SOLUTIONS",
      title1: "Your Trusted Partner for",
      title2: "Downhole Rod Pumps & Oilfield Supplies",
      description: clientData.subTagline + " At Trinity Pump & Supply, we are dedicated to providing industry-leading solutions with over 100+ years of combined experience.",
      ctaBook: "CALL NOW: 830-279-3996",
      ctaServices: "EXPLORE SERVICES",
      socialProofText: "100+ Yrs Combined Experience • USA-Manufactured Parts • Texas & New Mexico",
      imageAlt: "Trinity Pump and Supply downhole rod pumps"
    };

    // Stats
    d.stats = {
      ...d.stats,
      label: "PROVEN OILFIELD PERFORMANCE",
      titleLine1: "Lower Lifting Costs With",
      titleLine2: "High-Quality",
      titleItalicWord: "USA Parts",
      description: clientData.philosophy,
      items: [
        { value: "100+", label: "Years Combined Experience" },
        { value: "100%", label: "USA-Made Quality Parts" },
        { value: "TX & NM", label: "Permian Operations" },
        { value: "24/7", label: "Field & Shop Support" }
      ]
    };

    // Services
    const serviceItems = clientData.services.map((s, idx) => ({
      ...s,
      backLink: "Back to All Services",
      heroSectionLabel: "OILFIELD EXCELLENCE",
      heroDescription: s.description,
      specDurationValue: "Custom Build",
      specIntensityValue: "USA Alloy Steel",
      specFocusValue: "Lower Lifting Costs",
      bookingCta: "Request Quote Now",
      bookingCtaUrl: "/contact-us",
      heroCtaSecondary: "EXPLORE SPECIFICATIONS",
      heroCtaSecondaryUrl: "#overview",
      statsItem1Val: "100+",
      statsItem1Label: "Years Combined Experience",
      statsItem2Val: "5.0 ★",
      statsItem2Label: "Client Satisfaction",
      statsItem3Val: "100%",
      statsItem3Label: "USA-Manufactured Parts",
      statsItem4Val: "24/7",
      statsItem4Label: "Support Availability",
      overviewSectionLabel: "INDUSTRY-LEADING SOLUTIONS",
      overviewTitle1: s.title,
      overviewTitle2: s.subheadline,
      overviewWatermark: "TRINITY PUMP & SUPPLY • ODESSA, TX",
      overviewSuccessRate: "100+ YRS EXPERIENCE",
      tailoredLabel: "100% Tailored To Well Conditions",
      tailoredSub: "Custom Specifications",
      overviewDescription: `<p>${s.description}</p>`,
      overviewCtaText: "CALL 830-279-3996 FOR QUOTE",
      overviewCtaUrl: "tel:830-279-3996",
      overviewHipaaText: "USA-Made Quality & Timely Delivery Guaranteed",
      benefits: s.benefits,
      candidateSectionLabel: "WHY CHOOSE TRINITY PUMP & SUPPLY",
      candidateTitle1: "Engineered For Durability.",
      candidateTitle2: "Built For The Permian Basin.",
      candidateDescription: "In the oilfield industry, it’s not just about what you pay, but how many times you pay it. We focus on producing high-quality, long-lasting pump parts to minimize pulling costs.",
      profileBadgePrefix: "ADVANTAGE",
      candidateSuitability: "OILFIELD STANDARD",
      whoProfiles: clientData.whyChoose,
      protocolSectionLabel: "MANUFACTURING & SERVICE WORKFLOW",
      protocolTitle1: "How We Deliver Reliable",
      protocolTitle2: "Pump Performance.",
      protocolDescription: "Our process ensures every pump and component delivers maximum run life under demanding well conditions.",
      protocolPhasePrefix: "STEP",
      protocolDurations: ["EVALUATION", "CUSTOM BUILD", "QUALITY QC", "TIMELY DELIVERY"],
      sessionSteps: [
        { num: "01", title: "Well Condition Evaluation", desc: "We evaluate your well depth, fluid gravity, gas interference, and corrosive conditions." },
        { num: "02", title: "Precision Manufacturing", desc: "Constructed with USA alloy steel, 316 Stainless, or Monel to exact bore tolerances (1-1/16” to 3-3/4”)." },
        { num: "03", title: "Inspection & Quality Check", desc: "Rigorous testing to ensure long-lasting, reliable performance before dispatch." },
        { num: "04", title: "Timely Field Delivery", desc: "Fast on-site delivery across Texas and New Mexico to minimize rig standby time." }
      ],
      protocolBannerBadge: "MAXIMIZE PUMP RUN TIME",
      protocolBannerTitlePrefix: "Ready to order",
      protocolBannerTitleSuffix: `${s.title}?`,
      protocolBannerCta: "CALL NOW: 830-279-3996",
      protocolBannerCtaUrl: "tel:830-279-3996",
      protocolBannerDescription: "Call 830-279-3996 or visit our shop at 2501 FM 866, Odessa, TX 79763.",
      faqBadge: "FAQ",
      faqTitle: "Frequently Asked Questions",
      faqDescription: "Everything you need to know about our products and oilfield services.",
      faq: clientData.faqs,
      seo: {
        metaTitle: `${s.title} | Trinity Pump & Supply Odessa TX`,
        metaDescription: s.description.slice(0, 155),
        focusKeyword: s.title.toLowerCase(),
        canonicalUrl: `${clientData.domain}/${s.slug}/`,
        metaRobotsIndex: "index",
        metaRobotsFollow: "follow",
        ogTitle: `${s.title} | Trinity Pump & Supply`,
        ogDescription: s.description.slice(0, 155)
      }
    }));

    d.services = {
      label: "OUR OILFIELD SERVICES & SUPPLIES",
      titleLine1: "Precision Engineering",
      titleLine2: "For Maximum",
      titleLine3: "Pump Life",
      titleItalicWord: "In Permian Basin",
      description: "At Trinity Pump & Supply, we specialize in manufacturing, building, and repairing downhole sucker rod pumps with bore sizes from 1-1/16” to 3-3/4”, alongside comprehensive oilfield supplies.",
      ctaAll: "VIEW ALL SERVICES",
      ctaLearnMore: "LEARN MORE",
      services: serviceItems,
      items: serviceItems,
      badge: "OUR SERVICES"
    };

    // Leadership
    d.leadership = {
      label: "LEADERSHIP & EXPERTISE",
      title: "Meet Our Leadership",
      tagline: "Over 100+ Years of Combined Oilfield Experience",
      desc1: "At Trinity Pump & Supply, we are dedicated to providing industry-leading solutions for your oilfield operations. With over 100+ years of combined experience, our team specializes in manufacturing, building, and repairing downhole sucker rod pumps.",
      desc2: "Operating throughout Texas and New Mexico, our leadership team—led by Olin Brown (President), Sim Brown (Project Manager), and Josh Storey (Shop Manager)—serves operators with a relentless focus on lowering pump-related lifting costs and maximizing production efficiency.",
      photoBadge: "100+ YRS EXPERIENCE",
      ctaMore: "CONTACT OUR TEAM",
      ctaLink: "/contact-us",
      signatureName: "Olin Brown",
      signatureTitle: "President, Trinity Pump & Supply",
      image: "/images/theraphist.jpeg",
      imageAlt: "Olin Brown - Trinity Pump & Supply"
    };

    // Process / Commitments
    d.process = {
      label: "OUR COMMITMENTS",
      title: "Dedicated to Oilfield Excellence.",
      description: "At Trinity Pump & Supply, we are dedicated to honesty, timely delivery, and quality at all costs.",
      phaseLabel: "VALUE",
      items: clientData.commitments.map((c, i) => ({
        step: c.num,
        title: c.title,
        desc: c.desc,
        tag: `COMMITMENT ${c.num}`
      }))
    };

    // Testimonials
    d.testimonials = {
      label: "CLIENT TESTIMONIALS",
      title1: "Trusted by Operators.",
      title2: "Proven in the Permian.",
      quoteIcon: "\"",
      dash: "—",
      items: clientData.testimonials.map(t => ({
        author: t.name,
        role: t.position,
        company: t.company,
        quote: t.text,
        rating: t.rating
      })),
      results: [
        { value: "100+", label: "Years Combined Experience" },
        { value: "5.0 ★", label: "Client Satisfaction Rating" },
        { value: "100%", label: "USA-Manufactured Parts" },
        { value: "24/7", label: "Field Response Support" }
      ]
    };

    // CtaBanner
    d.ctaBanner = {
      tagline: "READY TO OPTIMIZE YOUR OILFIELD OPERATIONS?",
      title: "Get in Touch With Trinity Pump & Supply Today",
      description: "Let us help you reduce operational lifting costs and improve efficiency with our top-tier USA-manufactured pump parts and services.",
      button: "CALL NOW: 830-279-3996",
      btnUrl: "tel:830-279-3996",
      buttonUrl: "tel:830-279-3996"
    };

    // Contact FAQ / Quote
    d.contactFaq = {
      label: "REQUEST A FREE QUOTE",
      faqLabel: "FAQ",
      faqTitle: "Frequently Asked Questions",
      formLabel: "REQUEST A FREE QUOTE",
      formTitle: "Ready to Optimize Your Oilfield Operations?",
      formClinicPortal: "CALL OUR ODESSA SHOP",
      formClinicPortalSub: "Direct Office: 830-279-3996",
      formStyleSeatBtn: "CALL 830-279-3996",
      formNameLabel: "YOUR FULL NAME / COMPANY",
      formNamePlaceholder: "Your Name / Operator Name",
      formEmailLabel: "EMAIL ADDRESS",
      formEmailPlaceholder: "your.email@company.com",
      formPhoneLabel: "PHONE NUMBER",
      formPhonePlaceholder: "830-279-3996",
      formServiceLabel: "EQUIPMENT / SERVICE CATEGORY",
      formServicePlaceholder: "Select oilfield service or product",
      formMessageLabel: "YOUR MESSAGE / WELL SPECIFICATIONS",
      formMessagePlaceholder: "Please describe your well depth, pump size, or supply needs...",
      formBtnSubmit: "SEND REQUEST",
      formBtnSuccess: "REQUEST SENT!",
      formSuccessToast: "Thank you! Your quote request has been sent. We will respond promptly.",
      trustHipa: "USA-Made Quality Guaranteed",
      trustResponse: "Fast Field Response",
      formServicesOptions: clientData.services.map(s => s.name),
      faqs: clientData.faqs.map(f => ({ question: f.question, answer: f.answer })),
      contactInfo: {
        address: clientData.address,
        mapUrl: clientData.mapUrl,
        phone: clientData.phone,
        email: clientData.email,
        hours: clientData.hours,
        team: clientData.team
      }
    };

    // Quote form config
    d.quote = {
      section: {
        badge: "REQUEST A FREE QUOTE",
        headline: "Ready to Optimize Your Oilfield Operations?",
        description: "Contact Trinity Pump & Supply for high-quality downhole pumps and oilfield supplies across Texas and New Mexico."
      },
      formClinicPortal: "DIRECT FIELD DISPATCH",
      formClinicPortalSub: "Call our Odessa office at 830-279-3996",
      formStyleSeatBtn: "CALL 830-279-3996",
      formBtnSubmit: "REQUEST QUOTE",
      formSuccessToast: "Thank you! Your quote request has been sent. We will reply promptly.",
      trustHipa: "High-Quality USA-Manufactured Parts",
      trustResponse: "Prompt 24/7 Field Support",
      services: clientData.services.map(s => ({ label: s.name, value: s.slug }))
    };

    // Hours
    d.hours = {
      monday: "7:00 AM – 6:00 PM",
      tuesday: "7:00 AM – 6:00 PM",
      wednesday: "7:00 AM – 6:00 PM",
      thursday: "7:00 AM – 6:00 PM",
      friday: "7:00 AM – 6:00 PM",
      saturday: "On Call / Field Support",
      sunday: "On Call / Field Support"
    };

    // BlogSection
    d.blogSection = {
      ...d.blogSection,
      subtitle: "OILFIELD TECHNICAL INSIGHTS",
      title: "Latest News & Technical Articles",
      description: "Downhole rod pump engineering, rod rotator maintenance, and Permian Basin production tips from Trinity Pump & Supply.",
      ctaAll: "VIEW ALL ARTICLES",
      ctaReadMore: "READ ARTICLE"
    };

    // Footer
    d.footer = {
      company: {
        name: clientData.companyName,
        tagline: clientData.tagline,
        description: clientData.subTagline
      },
      contact: {
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        hours: clientData.hours,
        mapUrl: clientData.mapUrl
      },
      bottom: {
        copyright: "All Rights Reserved Trinity Pump & Supply | Designed & Developed by Mohsin Designs",
        rights: "All Rights Reserved."
      },
      services: {
        selectedServices: clientData.services.map(s => s.name)
      }
    };

    // Portfolio / Gallery
    d.portfolio = {
      projects: clientData.services.map((s, idx) => ({
        title: s.name,
        category: s.tag,
        year: "2026",
        desc: s.subheadline,
        image: s.image,
        number: `0${idx + 1}`,
        location: "Texas & New Mexico",
        architect: "Trinity Pump & Supply",
        accent: "from-primary to-primary/80",
        featured: idx < 3
      }))
    };
  }

  fs.writeFileSync(scPath, BSON.EJSON.stringify(scData, { relaxed: false }, 2), 'utf8');
  console.log(' -> Successfully updated backup/mongodb_export/site_contents.json');

  // 2. Transform pages.json
  const pagesPath = path.join(exportDir, 'pages.json');
  let pagesData = BSON.EJSON.parse(fs.readFileSync(pagesPath, 'utf8'), { relaxed: false });

  // Update existing pages or create missing ones
  const pageMap = new Map();
  pagesData.forEach(p => pageMap.set(p.slug, p));

  // Home page
  const homePage = pageMap.get('home') || pageMap.get('/');
  if (homePage) {
    homePage.title = "Trinity Pump & Supply | Downhole Rod Pumps & Oilfield Supplies";
    homePage.seo = {
      ...homePage.seo,
      metaTitle: "Trinity Pump & Supply | Downhole Rod Pumps & Oilfield Supplies",
      metaDescription: clientData.subTagline,
      focusKeyword: "downhole rod pumps odessa tx",
      canonicalUrl: `${clientData.domain}/`,
      ogTitle: "Trinity Pump & Supply | Downhole Rod Pumps & Oilfield Supplies",
      ogDescription: clientData.subTagline
    };
  }

  // About page
  let aboutPage = pageMap.get('about') || pageMap.get('about-us');
  if (aboutPage) {
    aboutPage.title = "About Us | Trinity Pump & Supply";
    aboutPage.slug = "about-us";
    aboutPage.seo = {
      metaTitle: "About Us | Trinity Pump & Supply Odessa TX",
      metaDescription: "With over 100+ years of combined experience, Trinity Pump & Supply manufactures and repairs downhole sucker rod pumps across Texas and New Mexico.",
      canonicalUrl: `${clientData.domain}/about-us/`,
      focusKeyword: "about trinity pump supply",
      metaRobotsIndex: "index",
      metaRobotsFollow: "follow",
      ogTitle: "About Us | Trinity Pump & Supply",
      ogDescription: "Over 100+ years combined oilfield experience lowering lifting costs across Texas and New Mexico."
    };
    aboutPage.content = {
      ...aboutPage.content,
      description: clientData.description,
      philosophy: clientData.philosophy,
      commitments: clientData.commitments,
      whyChoose: clientData.whyChoose,
      team: clientData.team
    };
  }

  // Contact Us page
  let contactPage = pageMap.get('contact-us') || pageMap.get('contact');
  if (contactPage) {
    contactPage.title = "Contact Us | Trinity Pump & Supply";
    contactPage.slug = "contact-us";
    contactPage.address = clientData.address;
    contactPage.phone = clientData.phone;
    contactPage.email = clientData.email;
    contactPage.seo = {
      metaTitle: "Contact Trinity Pump & Supply | Odessa TX Oilfield Supplies",
      metaDescription: "Contact Trinity Pump & Supply at 2501 FM 866, Odessa, TX 79763 or call 830-279-3996 for downhole rod pumps and oilfield supplies.",
      canonicalUrl: `${clientData.domain}/contact-us/`,
      focusKeyword: "contact trinity pump supply",
      metaRobotsIndex: "index",
      metaRobotsFollow: "follow",
      ogTitle: "Contact Trinity Pump & Supply",
      ogDescription: "2501 FM 866, Odessa, TX 79763 | Phone: 830-279-3996"
    };
    if (contactPage.content && contactPage.content.info) {
      contactPage.content.info = {
        phone: clientData.phone,
        email: clientData.email,
        address: clientData.address
      };
    }
  }

  // Reviews page
  let reviewsPage = pageMap.get('reviews');
  if (reviewsPage) {
    reviewsPage.title = "Client Reviews & Testimonials | Trinity Pump & Supply";
    reviewsPage.seo = {
      metaTitle: "Client Reviews & Testimonials | Trinity Pump & Supply",
      metaDescription: "Read reviews and testimonials from oilfield operators across Texas and New Mexico who trust Trinity Pump & Supply.",
      canonicalUrl: `${clientData.domain}/reviews/`,
      metaRobotsIndex: "index",
      metaRobotsFollow: "follow"
    };
    reviewsPage.content = {
      ...reviewsPage.content,
      testimonials: {
        section: {
          badge: "CLIENT TESTIMONIALS",
          headline: "What Oilfield Operators Say",
          description: "Real feedback from Permian Basin operators and energy leaders."
        },
        testimonials: clientData.testimonials.map((t, idx) => ({
          id: idx + 1,
          name: t.name,
          position: t.position,
          company: t.company,
          avatar: t.name.slice(0, 2).toUpperCase(),
          text: t.text,
          rating: t.rating
        }))
      }
    };
  }

  // Services index page
  let servicesPage = pageMap.get('services');
  if (servicesPage) {
    servicesPage.title = "Oilfield Services & Downhole Rod Pumps | Trinity Pump & Supply";
    servicesPage.seo = {
      metaTitle: "Oilfield Services & Downhole Rod Pumps | Trinity Pump & Supply",
      metaDescription: "Explore our downhole rod pumps, Burleson HD rod rotators, downhole supplies, poly pipe, and wellhead equipment across Texas and New Mexico.",
      canonicalUrl: `${clientData.domain}/services/`,
      metaRobotsIndex: "index",
      metaRobotsFollow: "follow"
    };
    servicesPage.content = {
      ...servicesPage.content,
      services: {
        badge: "Our Oilfield Services",
        headline: { prefix: "High-Quality ", highlight: "USA-Made Pumps ", suffix: "in Texas & New Mexico" },
        description: clientData.description,
        services: clientData.services
      }
    };
  }

  // Update or add individual service pages for the 6 services
  clientData.services.forEach(svc => {
    let existingPage = pageMap.get(svc.slug);
    if (!existingPage) {
      const newSvcPage = {
        _id: new BSON.ObjectId(),
        title: `${svc.name} | Trinity Pump & Supply`,
        slug: svc.slug,
        template: "service-detail",
        status: "published",
        isTrashed: false,
        seo: {
          metaTitle: `${svc.name} | Trinity Pump & Supply Odessa TX`,
          metaDescription: svc.description.slice(0, 155),
          canonicalUrl: `${clientData.domain}/${svc.slug}/`,
          metaRobotsIndex: "index",
          metaRobotsFollow: "follow"
        },
        content: {
          service: svc
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      pagesData.push(newSvcPage);
      pageMap.set(svc.slug, newSvcPage);
    } else {
      existingPage.title = `${svc.name} | Trinity Pump & Supply`;
      existingPage.seo = {
        metaTitle: `${svc.name} | Trinity Pump & Supply Odessa TX`,
        metaDescription: svc.description.slice(0, 155),
        canonicalUrl: `${clientData.domain}/${svc.slug}/`,
        metaRobotsIndex: "index",
        metaRobotsFollow: "follow"
      };
      existingPage.content = {
        ...existingPage.content,
        service: svc
      };
    }
  });

  // Ensure unique slugs across all pages
  const uniquePages = [];
  const seenSlugs = new Set();
  for (const page of pagesData) {
    if (!seenSlugs.has(page.slug)) {
      seenSlugs.add(page.slug);
      uniquePages.push(page);
    }
  }
  pagesData = uniquePages;

  fs.writeFileSync(pagesPath, BSON.EJSON.stringify(pagesData, { relaxed: false }, 2), 'utf8');
  console.log(` -> Successfully updated backup/mongodb_export/pages.json (${pagesData.length} pages total)`);

  // 3. Transform users.json (admin email)
  const usersPath = path.join(exportDir, 'users.json');
  if (fs.existsSync(usersPath)) {
    let usersData = BSON.EJSON.parse(fs.readFileSync(usersPath, 'utf8'), { relaxed: false });
    usersData = usersData.map(u => {
      if (u.username === 'admin') {
        u.email = clientData.email;
      }
      return u;
    });
    fs.writeFileSync(usersPath, BSON.EJSON.stringify(usersData, { relaxed: false }, 2), 'utf8');
    console.log(' -> Successfully updated backup/mongodb_export/users.json');
  }

  // 4. Update manifest.json
  const manifestPath = path.join(exportDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.collections.pages.count = pagesData.length;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(' -> Updated manifest.json');
  }

  // 5. Connect to MongoDB and seed into the live cluster
  console.log('\n--- SEEDING UPDATED DATA INTO NEW CLUSTER ---');
  const client = new MongoClient(targetUri, { serverSelectionTimeoutMS: 15000 });

  try {
    await client.connect();
    console.log('Connected to target MongoDB Atlas cluster!');
    const db = client.db('eagle_revolution');

    // Ensure proper BSON ObjectId for all collections
    function sanitizeDocs(docs) {
      return docs.map(doc => {
        const d = { ...doc };
        if (d._id && d._id.$oid) {
          d._id = new BSON.ObjectId(d._id.$oid);
        } else if (typeof d._id === 'string' && /^[0-9a-fA-F]{24}$/.test(d._id)) {
          d._id = new BSON.ObjectId(d._id);
        }
        return d;
      });
    }

    // Seed site_contents
    const scCol = db.collection('site_contents');
    await scCol.deleteMany({});
    await scCol.insertMany(sanitizeDocs(scData));
    console.log(` -> Seeded ${scData.length} documents into 'site_contents'.`);

    // Seed pages
    const pagesCol = db.collection('pages');
    await pagesCol.deleteMany({});
    await pagesCol.insertMany(sanitizeDocs(pagesData));
    console.log(` -> Seeded ${pagesData.length} documents into 'pages'.`);

    // Seed users
    const usersCol = db.collection('users');
    const usersContent = BSON.EJSON.parse(fs.readFileSync(usersPath, 'utf8'), { relaxed: false });
    await usersCol.deleteMany({});
    await usersCol.insertMany(sanitizeDocs(usersContent));
    console.log(` -> Seeded ${usersContent.length} documents into 'users'.`);

    console.log('\n=========================================');
    console.log('TRANSFORMATION & SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Brand: Trinity Pump & Supply');
    console.log('Location: 2501 FM 866, Odessa, TX 79763');
    console.log('Phone: 830-279-3996 | Email: trinitypumpsupply@gmail.com');
    console.log('Services: 6 Oilfield services active');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Seeding to database failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

transformAndSeed();
