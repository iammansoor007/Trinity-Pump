const { MongoClient, ObjectId } = require('mongodb');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://ammansoor0077_db_user:7DgsNDPSTSi3PX7f@cluster0.sqgewel.mongodb.net/eagle_revolution?retryWrites=true&w=majority&appName=Cluster0";

// Mapping of service slugs to new Trinity image paths
const serviceImages = {
  'downhole-rod-pumps': '/images/trinity/downhole_rod_pumps.jpg',
  'hd-rod-rotator': '/images/trinity/hd_rod_rotator.jpg',
  'downhole-supplies': '/images/trinity/downhole_supplies.jpg',
  'general-oilfield-supplies': '/images/trinity/general_oilfield_supplies.jpg',
  'poly-pipe-and-fittings': '/images/trinity/poly_pipe_fittings.jpg',
  'battery-wellhead-supplies': '/images/trinity/battery_wellhead_supplies.jpg'
};

const serviceAlts = {
  'downhole-rod-pumps': 'Downhole Rod Pumps - Precision USA-Manufactured Parts',
  'hd-rod-rotator': 'Burleson HD Rod Rotator Installed on Wellhead',
  'downhole-supplies': 'Downhole Supplies - Tubing Anchors & Separators',
  'general-oilfield-supplies': 'General Oilfield Supplies - Valves & Flanges',
  'poly-pipe-and-fittings': 'Poly Pipe & SDR Pressure Fittings',
  'battery-wellhead-supplies': 'Battery & Wellhead Supplies - Manifolds & Flowlines'
};

// Map old Cloudinary massage URLs to new Trinity images
const urlReplacements = {
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788186993/trinity_home_page_banner_1788186993646.jpg': '/images/trinity/hero_banner.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788187863/12_Conditions_We_Commonly_Help_With_1788187862994.jpg': '/images/trinity/wellsite_servicing.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188108/corrective_1788188108828.png': '/images/trinity/downhole_rod_pumps.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188207/sports-massage_1788188207599.png': '/images/trinity/hd_rod_rotator.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188234/infrared_1788188234520.jpg': '/images/trinity/downhole_supplies.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788190458/stretch_1788190458587.jpg': '/images/trinity/general_oilfield_supplies.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188380/hot-towel_1788188380929.jpg': '/images/trinity/poly_pipe_fittings.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188415/myofascial-massage_1788188415171.png': '/images/trinity/battery_wellhead_supplies.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188515/deep-tissue_1788188515542.png': '/images/trinity/downhole_rod_pumps.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188488/hot-stones_1788188488844.jpg': '/images/trinity/facility_shop.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188441/acupressure_1788188449964.png': '/images/trinity/quality_inspection.jpg',
  'https://res.cloudinary.com/dytytwyp6/image/upload/v1788188465/cupping-therapy_1788188465171.jpg': '/images/trinity/field_operations.jpg',
  '/images/theraphist.jpeg': '/images/trinity/olin_brown.jpg',
  '/images/service-massage.webp': '/images/trinity/downhole_rod_pumps.jpg',
  '/images/hero-bg.webp': '/images/trinity/hero_banner.jpg'
};

function replaceStringUrls(str) {
  if (typeof str !== 'string') return str;
  let res = str;
  for (const [oldUrl, newUrl] of Object.entries(urlReplacements)) {
    if (res.includes(oldUrl)) {
      res = res.split(oldUrl).join(newUrl);
    }
  }
  return res;
}

function recursiveReplace(val) {
  if (val === null || val === undefined) return val;
  if (val instanceof ObjectId || val instanceof Date) return val;
  if (typeof val === 'string') return replaceStringUrls(val);
  if (Array.isArray(val)) return val.map(recursiveReplace);
  if (typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = recursiveReplace(v);
    }
    return out;
  }
  return val;
}

async function updateDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas.');
    const db = client.db('eagle_revolution');

    // 1. UPDATE site_contents
    console.log('\n--- 1. Updating site_contents ---');
    const siteCol = db.collection('site_contents');
    const completeDoc = await siteCol.findOne({ key: 'complete_data' });
    if (completeDoc && completeDoc.data) {
      let data = recursiveReplace(completeDoc.data);

      // Explicitly ensure hero
      if (data.hero) {
        data.hero.image = '/images/trinity/hero_banner.jpg';
        data.hero.images = ['/images/trinity/hero_banner.jpg'];
        data.hero.imageAlt = 'Trinity Pump & Supply - Permian Basin Oilfield Pump Jacks at Golden Hour';
      }

      // Explicitly ensure leadership
      if (data.leadership) {
        data.leadership.image = '/images/trinity/olin_brown.jpg';
        data.leadership.imageAlt = 'Olin Brown - President, Trinity Pump & Supply';
      }

      // Explicitly ensure services items and services array
      if (data.services) {
        ['items', 'services'].forEach(arrKey => {
          if (Array.isArray(data.services[arrKey])) {
            data.services[arrKey].forEach(s => {
              if (s.slug && serviceImages[s.slug]) {
                s.image = serviceImages[s.slug];
                s.imageAlt = serviceAlts[s.slug];
              }
            });
          }
        });
      }

      // Explicitly ensure portfolio
      if (data.portfolio && Array.isArray(data.portfolio.projects)) {
        data.portfolio.projects.forEach(p => {
          if (p.slug && serviceImages[p.slug]) {
            p.image = serviceImages[p.slug];
          }
        });
      }

      // Explicitly ensure testimonials avatars
      if (data.testimonials && Array.isArray(data.testimonials.items)) {
        const avatars = ['/images/trinity/avatar_1.jpg', '/images/trinity/avatar_2.jpg', '/images/trinity/avatar_3.jpg'];
        data.testimonials.items.forEach((t, i) => {
          t.avatar = avatars[i % avatars.length];
        });
      }

      await siteCol.updateOne(
        { _id: completeDoc._id },
        { $set: { data: data, updatedAt: new Date() } }
      );
      console.log('✓ site_contents (complete_data) updated with new Trinity images.');
    }

    // 2. UPDATE pages
    console.log('\n--- 2. Updating pages collection ---');
    const pagesCol = db.collection('pages');
    const pages = await pagesCol.find({}).toArray();

    for (const p of pages) {
      let updatedDoc = recursiveReplace(p);
      let changed = false;

      // Service pages
      if (serviceImages[p.slug]) {
        updatedDoc.featuredImage = serviceImages[p.slug];
        if (updatedDoc.content && updatedDoc.content.service) {
          updatedDoc.content.service.image = serviceImages[p.slug];
          updatedDoc.content.service.imageAlt = serviceAlts[p.slug] || `${p.title} - Trinity Pump & Supply`;
        }
        changed = true;
      }

      // Home page
      if (p.slug === 'home') {
        updatedDoc.featuredImage = '/images/trinity/hero_banner.jpg';
        changed = true;
      }

      // About Us
      if (p.slug === 'about-us') {
        updatedDoc.featuredImage = '/images/trinity/facility_shop.jpg';
        changed = true;
      }

      // Gallery page
      if (p.slug === 'gallery') {
        updatedDoc.title = 'Oilfield Equipment & Downhole Pump Gallery | Trinity Pump & Supply';
        updatedDoc.featuredImage = '/images/trinity/downhole_rod_pumps.jpg';
        if (updatedDoc.content && updatedDoc.content.galleryPage) {
          updatedDoc.content.galleryPage.header = {
            titlePrefix: 'Our ',
            titleHighlight: 'Oilfield Equipment ',
            titleSuffix: 'Gallery',
            badge: 'QUALITY WORKMANSHIP',
            description: '<p>Explore our USA-manufactured downhole rod pumps, Burleson HD rod rotator installations, precision pump shop reconditioning, and Permian Basin oilfield supplies.</p>',
            ctaBook: 'Request a Quote'
          };
        }
        if (updatedDoc.content && updatedDoc.content.portfolio) {
          updatedDoc.content.portfolio.projects = [
            {
              title: 'Precision Downhole Rod Pump Construction',
              category: 'Downhole Pumps',
              year: '2026',
              desc: 'USA-manufactured downhole rod pump assembly built with precision-machined barrels, plungers, and API valves.',
              image: '/images/trinity/downhole_rod_pumps.jpg',
              number: '01',
              location: 'Odessa, TX',
              architect: 'Trinity Pump & Supply',
              accent: 'from-amber-600 to-amber-700',
              featured: true
            },
            {
              title: 'Burleson HD Rod Rotator Field Installation',
              category: 'Rod Rotators',
              year: '2026',
              desc: 'Heavy-duty mechanical rod rotator installed on active wellhead sucker rod in the Permian Basin.',
              image: '/images/trinity/hd_rod_rotator.jpg',
              number: '02',
              location: 'Permian Basin, TX',
              architect: 'Trinity Field Services',
              accent: 'from-amber-600 to-amber-700',
              featured: true
            },
            {
              title: 'Permian Basin Wellsite Operations',
              category: 'Field Operations',
              year: '2026',
              desc: 'Active pumping units operating smoothly with Trinity downhole components and routine greasing maintenance.',
              image: '/images/trinity/hero_banner.jpg',
              number: '03',
              location: 'West Texas',
              architect: 'Field Operations',
              accent: 'from-amber-600 to-amber-700',
              featured: true
            },
            {
              title: 'Tank Battery & Wellhead Hookups',
              category: 'Wellhead Supplies',
              year: '2026',
              desc: 'Complete high-pressure wellhead manifolds, flowlines, and tank battery connections.',
              image: '/images/trinity/battery_wellhead_supplies.jpg',
              number: '04',
              location: 'Midland & Odessa, TX',
              architect: 'Wellhead Team',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'Poly Pipe & SDR Pressure Fittings',
              category: 'Poly Pipe',
              year: '2026',
              desc: 'High-density polyethylene water transfer lines and SDR fittings for oilfield infrastructure.',
              image: '/images/trinity/poly_pipe_fittings.jpg',
              number: '05',
              location: 'New Mexico & Texas',
              architect: 'Piping Specialists',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'Modern Odessa Pump Shop & Testing Facility',
              category: 'Pump Shop',
              year: '2026',
              desc: 'Full-service repair, reconditioning, and dynamometer testing facility at 2501 FM 866.',
              image: '/images/trinity/facility_shop.jpg',
              number: '06',
              location: 'Odessa, TX',
              architect: 'Josh Storey, Shop Manager',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'Downhole Supplies & Gas Separator Assemblies',
              category: 'Downhole Supplies',
              year: '2026',
              desc: 'Tubing anchor catchers, sand and gas separators, and API sucker rod couplings.',
              image: '/images/trinity/downhole_supplies.jpg',
              number: '07',
              location: 'Odessa, TX',
              architect: 'Supply Division',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'General Oilfield Supplies & High-Pressure Valves',
              category: 'Oilfield Supplies',
              year: '2026',
              desc: 'Blowout preventers (BOPs), stuffing boxes, and API gate valves ready for field deployment.',
              image: '/images/trinity/general_oilfield_supplies.jpg',
              number: '08',
              location: 'Permian Basin',
              architect: 'Supply Division',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'Precision Quality Inspection & Caliper Tolerances',
              category: 'Quality Assurance',
              year: '2026',
              desc: 'Every pump barrel and plunger is rigorously measured and verified to tight API tolerances.',
              image: '/images/trinity/quality_inspection.jpg',
              number: '09',
              location: 'Odessa Shop',
              architect: 'QA/QC Team',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            },
            {
              title: 'Wellsite Servicing & 24/7 Field Delivery',
              category: 'Field Delivery',
              year: '2026',
              desc: '24/7 emergency response and rapid delivery across Texas and New Mexico.',
              image: '/images/trinity/wellsite_servicing.jpg',
              number: '10',
              location: 'Texas & New Mexico',
              architect: 'Field Delivery Fleet',
              accent: 'from-amber-600 to-amber-700',
              featured: false
            }
          ];
        }
        if (updatedDoc.seo) {
          updatedDoc.seo.metaTitle = 'Oilfield Equipment & Downhole Pump Gallery | Trinity Pump & Supply';
          updatedDoc.seo.metaDescription = 'Explore our gallery of USA-manufactured downhole rod pumps, Burleson HD rod rotators, wellhead supplies, and Odessa TX pump shop facility.';
          updatedDoc.seo.focusKeyword = 'Oilfield Equipment Gallery';
          updatedDoc.seo.ogTitle = 'Oilfield Equipment & Downhole Pump Gallery | Trinity Pump & Supply';
          updatedDoc.seo.ogDescription = 'Explore our gallery of USA-manufactured downhole rod pumps, Burleson HD rod rotators, and Permian Basin oilfield supplies.';
          updatedDoc.seo.twitterTitle = 'Oilfield Equipment & Downhole Pump Gallery | Trinity Pump & Supply';
          updatedDoc.seo.twitterDescription = 'Explore our gallery of USA-manufactured downhole rod pumps, Burleson HD rod rotators, and Permian Basin oilfield supplies.';
        }
        changed = true;
      }

      // Legacy Maryland service detail pages: update their featured images and set to draft
      if (p.slug && (p.slug.includes('maryland') || p.slug.includes('therapy') || p.slug.includes('massage'))) {
        updatedDoc.featuredImage = '/images/trinity/downhole_rod_pumps.jpg';
        if (updatedDoc.content) {
          updatedDoc.content.image = '/images/trinity/downhole_rod_pumps.jpg';
          updatedDoc.content.featuredImage = '/images/trinity/downhole_rod_pumps.jpg';
        }
        updatedDoc.status = 'draft';
        changed = true;
      }

      // Check if general replacement modified the document
      if (JSON.stringify(p) !== JSON.stringify(updatedDoc)) {
        changed = true;
      }

      if (changed) {
        delete updatedDoc._id;
        await pagesCol.updateOne({ _id: p._id }, { $set: updatedDoc });
        console.log(`✓ Updated page [${p.slug}] with Trinity images.`);
      }
    }

    // 3. UPDATE media library
    console.log('\n--- 3. Registering New Media Items in media Collection ---');
    const mediaCol = db.collection('media');
    const newMediaItems = [
      {
        name: 'hero_banner.jpg',
        url: '/images/trinity/hero_banner.jpg',
        type: 'image/jpeg',
        alt: 'Trinity Pump & Supply - Permian Basin Oilfield Pump Jacks at Golden Hour',
        title: 'Permian Basin Pump Jacks Hero',
        category: 'Oilfield Facilities',
        tags: ['hero', 'pump-jack', 'permian-basin', 'texas']
      },
      {
        name: 'downhole_rod_pumps.jpg',
        url: '/images/trinity/downhole_rod_pumps.jpg',
        type: 'image/jpeg',
        alt: 'Downhole Rod Pumps - USA-Manufactured Parts & Barrels',
        title: 'Downhole Rod Pumps Assembly',
        category: 'Downhole Rod Pumps',
        tags: ['rod-pumps', 'pump-shop', 'manufacturing', 'odessa']
      },
      {
        name: 'hd_rod_rotator.jpg',
        url: '/images/trinity/hd_rod_rotator.jpg',
        type: 'image/jpeg',
        alt: 'Burleson HD Rod Rotator Installed on Wellhead',
        title: 'Burleson HD Rod Rotator',
        category: 'Rod Rotators',
        tags: ['hd-rod-rotator', 'burleson', 'wellhead', 'wear-prevention']
      },
      {
        name: 'downhole_supplies.jpg',
        url: '/images/trinity/downhole_supplies.jpg',
        type: 'image/jpeg',
        alt: 'Downhole Supplies - Tubing Anchors & Separators',
        title: 'Downhole Supplies & Separators',
        category: 'Downhole Supplies',
        tags: ['downhole', 'tac', 'separators', 'couplings']
      },
      {
        name: 'general_oilfield_supplies.jpg',
        url: '/images/trinity/general_oilfield_supplies.jpg',
        type: 'image/jpeg',
        alt: 'General Oilfield Supplies - High Pressure Valves & Flanges',
        title: 'General Oilfield Supplies',
        category: 'General Supplies',
        tags: ['valves', 'flanges', 'bop', 'stuffing-box']
      },
      {
        name: 'poly_pipe_fittings.jpg',
        url: '/images/trinity/poly_pipe_fittings.jpg',
        type: 'image/jpeg',
        alt: 'Poly Pipe & SDR Pressure Fittings',
        title: 'Poly Pipe & SDR Fittings',
        category: 'Poly Pipe',
        tags: ['poly-pipe', 'sdr-fittings', 'water-transfer', 'oilfield']
      },
      {
        name: 'battery_wellhead_supplies.jpg',
        url: '/images/trinity/battery_wellhead_supplies.jpg',
        type: 'image/jpeg',
        alt: 'Battery & Wellhead Supplies - Tank Battery Manifolds',
        title: 'Tank Battery & Wellhead Supplies',
        category: 'Wellhead Supplies',
        tags: ['battery', 'wellhead', 'manifolds', 'flowlines']
      },
      {
        name: 'facility_shop.jpg',
        url: '/images/trinity/facility_shop.jpg',
        type: 'image/jpeg',
        alt: 'Trinity Pump & Supply Odessa TX Pump Shop Facility',
        title: 'Odessa Pump Shop Facility',
        category: 'Facilities',
        tags: ['shop', 'facility', 'odessa', 'reconditioning']
      },
      {
        name: 'olin_brown.jpg',
        url: '/images/trinity/olin_brown.jpg',
        type: 'image/jpeg',
        alt: 'Olin Brown - President, Trinity Pump & Supply',
        title: 'Olin Brown Portrait',
        category: 'Leadership',
        tags: ['leadership', 'olin-brown', 'president']
      },
      {
        name: 'sim_brown.jpg',
        url: '/images/trinity/sim_brown.jpg',
        type: 'image/jpeg',
        alt: 'Sim Brown - Project Manager, Trinity Pump & Supply',
        title: 'Sim Brown Portrait',
        category: 'Leadership',
        tags: ['leadership', 'sim-brown', 'project-manager']
      },
      {
        name: 'josh_storey.jpg',
        url: '/images/trinity/josh_storey.jpg',
        type: 'image/jpeg',
        alt: 'Josh Storey - Shop Manager, Trinity Pump & Supply',
        title: 'Josh Storey Portrait',
        category: 'Leadership',
        tags: ['leadership', 'josh-storey', 'shop-manager']
      }
    ];

    for (const item of newMediaItems) {
      const existing = await mediaCol.findOne({ url: item.url });
      if (!existing) {
        await mediaCol.insertOne({
          ...item,
          size: 150000,
          width: 1200,
          height: 800,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✓ Inserted media library entry: ${item.name}`);
      } else {
        await mediaCol.updateOne({ _id: existing._id }, { $set: item });
        console.log(`✓ Updated media library entry: ${item.name}`);
      }
    }

    console.log('\n=========================================');
    console.log('DATABASE IMAGE TRANSFORMATION COMPLETE');
    console.log('=========================================\n');

  } catch (err) {
    console.error('Error during database image update:', err);
  } finally {
    await client.close();
  }
}

updateDatabase();
