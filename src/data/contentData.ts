import { Review, BlogPost } from '../types';

export const KARACHI_AREAS: string[] = [
  'Clifton (Blocks 1-9)',
  'DHA (Phases 1-8)',
  'Gulshan-e-Iqbal (Blocks 1-19)',
  'Gulistan-e-Johar (Blocks 1-20)',
  'North Nazimabad',
  'Nazimabad',
  'PECHS (Blocks 2, 3, 6)',
  'Bahadurabad & Tariq Road',
  'Federal B Area',
  'Gulberg Karachi',
  'Saddar & Cantt',
  'Malir Cantt & Model Colony',
  'Korangi & Creek Vista',
  'Defence View & Akhtar Colony',
  'North Karachi & New Karachi',
  'Scheme 33 & Safoora',
  'Other Area in Karachi'
];

export const CROCHET_BENEFITS = [
  {
    id: 'natural-yarn',
    title: '100% Soft Milk Cotton & Wool',
    urduTitle: 'Pure Milk Cotton Crochet',
    desc: 'Never scratchy or harsh. We source hypoallergenic 5-ply combed milk cotton yarn that feels velvety against the skin and breathes naturally in Karachi weather.',
    icon: '🌸'
  },
  {
    id: 'slow-fashion',
    title: 'Heirloom Stitches That Last Years',
    urduTitle: 'Durable Hand-Knotted Crochet',
    desc: 'Unlike factory-made polyester fast fashion, each crochet stitch is individually knotted and locked. Hand-crocheted items retain their shape and charm for years.',
    icon: '🪡'
  },
  {
    id: 'eco-friendly',
    title: 'Zero Waste & Eco-Conscious',
    urduTitle: 'Sustainable Zero-Waste Crochet',
    desc: 'Every inch of wool and yarn is utilized. Handcrafted crochet emits zero factory carbon, leaves no plastic microfibers, and supports sustainable conscious fashion.',
    icon: '🌿'
  },
  {
    id: 'local-artisans',
    title: 'Empowering Karachi Women Artisans',
    urduTitle: 'Artisan Crochet Craftsmanship',
    desc: 'Every purchase directly supports passionate home-based women artisans in Karachi, preserving heritage handcraft traditions with fair compensation.',
    icon: '✨'
  },
  {
    id: 'custom-unique',
    title: '100% Bespoke & Unique',
    urduTitle: 'Bespoke Handmade Crochet',
    desc: 'No two crochet pieces are ever carbon copies. From petal placement on daisy hats to color blending in granny squares, your piece is exclusively yours.',
    icon: '🎀'
  }
];

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Areeba Kashif',
    location: 'DHA Phase 6, Karachi',
    rating: 5,
    comment: 'I ordered the Vintage Granny Square Tote and honestly pictures don’t do justice! The wool is so soft and thick milk cotton. The rider arrived in 2 days at DHA. Packaging was scented and included a cute crochet flower freebie!',
    purchasedItem: 'Vintage Meadow Granny Square Tote',
    date: '3 days ago'
  },
  {
    id: 'rev-2',
    customerName: 'Hafsa Naveed',
    location: 'Gulshan-e-Iqbal Block 13, Karachi',
    rating: 5,
    comment: 'The strawberry keychain and daisy bucket hat are so aesthetic! My friends at IBA asked me where I bought it from. Ordered via WhatsApp and paid Cash on Delivery easily.',
    purchasedItem: 'Pastel Daisy Bucket Hat & Strawberry Charm',
    date: '1 week ago'
  },
  {
    id: 'rev-3',
    customerName: 'Maryam Siddiqui',
    location: 'North Nazimabad Block H, Karachi',
    rating: 5,
    comment: 'It is so hard to find authentic crochet work with such neat stitching nowadays. The lace handkerchief border is flawless! EasyPaisa payment was smooth and received confirmation immediately.',
    purchasedItem: 'Heirloom Scalloped Lace Handkerchief',
    date: '2 weeks ago'
  },
  {
    id: 'rev-4',
    customerName: 'Nimra Bilal',
    location: 'Clifton Block 4, Karachi',
    rating: 5,
    comment: 'Ordered custom matching floral friendship bracelets for me and my sister. The sliding lock fits perfectly and the colors are vibrant yet pastel. Best crochet brand in Karachi!',
    purchasedItem: 'Blooming Flora Crochet Friendship Bracelets',
    date: '2 weeks ago'
  },
  {
    id: 'rev-5',
    customerName: 'Dr. Sadia Rehman',
    location: 'PECHS Block 3, Karachi',
    rating: 5,
    comment: 'Super fast delivery across Karachi! The owner answered all my queries on WhatsApp promptly about custom color options. 10/10 craftsmanship.',
    purchasedItem: 'Daisy Blossom Crossbody Shoulder Pouch',
    date: 'Last month'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-care-guide',
    title: 'How to Wash & Care for Handmade Crochet Pieces',
    subtitle: 'Essential laundry tips so your milk cotton bags and bucket hats never shrink or fray.',
    category: 'Care & Longevity',
    readTime: '3 min read',
    date: 'September 18, 2026',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    content: [
      'Handmade crochet items created with milk cotton yarn are soft and resilient, but require a little tenderness to maintain their shape for years.',
      '1. Always hand-wash in cool or lukewarm water. Hot water can cause natural cotton fibers to shrink or relax too much.',
      '2. Use a mild baby shampoo or gentle wool liquid detergent. Never use harsh bleaches or chlorine.',
      '3. Gently submerge and squeeze the soapy water through the stitches. Do not wring or twist violently, as this pulls the yarn out of symmetry.',
      '4. Rinse in clean cool water, then roll in a clean cotton towel to absorb excess moisture.',
      '5. Dry flat on a clean dry towel in the shade. Never hang a wet crochet bag or hat on a hook, as the weight of water will stretch the loops.'
    ]
  },
  {
    id: 'blog-milk-cotton',
    title: 'Why Milk Cotton & Wool Yarn is Best for Karachi Weather',
    subtitle: 'Exploring the science behind breathable natural fibers and why we never use synthetic nylon.',
    category: 'Material Guide',
    readTime: '4 min read',
    date: 'September 14, 2026',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
    content: [
      'Karachi’s humid coastal climate demands fibers that absorb moisture while allowing air to circulate freely around your skin.',
      'Standard acrylic and nylon yarns found in factory fast fashion trap body heat, cause sweat buildup, and irritate sensitive skin.',
      'At Zarsal, we strictly select 5-ply combed milk cotton yarn. The cotton provides natural tensile strength and airflow, while natural milk protein fiber adds an ultra-smooth sheen that feels like silk.',
      'Whether you are wearing our scalloped daisy bucket hat under the Clifton seaside sun or carrying a granny square tote to university, your accessories remain fresh and comfortable all day.'
    ]
  },
  {
    id: 'blog-granny-square',
    title: 'The Art of the Granny Square: Vintage Charm Meets Modern Streetwear',
    subtitle: 'How 1970s artisanal crochet became the biggest trending aesthetic among Karachi youth.',
    category: 'Style & Trends',
    readTime: '3 min read',
    date: 'September 05, 2026',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    content: [
      'The traditional granny square, known locally as part of timeless crochet craft, has made a resounding comeback in modern street style and everyday chic.',
      'From earthy terracotta palettes to pastel matcha tones, these geometric motifs bring warmth, character, and individuality that cookie-cutter mass production can never replicate.',
      'Pair our Vintage Meadow Tote with a crisp white kurti, raw denim, or summer linen dresses for an effortless, curated bohemian aesthetic in Karachi.'
    ]
  }
];

export const getWhatsAppUrl = (phone = '923047891234', message = 'Hello Zarsal! I would like to inquire about your handmade crochet pieces in Karachi.') => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
