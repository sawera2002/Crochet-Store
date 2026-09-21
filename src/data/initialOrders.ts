import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-9104',
    createdAt: '2026-09-20T14:32:00Z',
    customer: {
      fullName: 'Amina Fatima',
      phone: '0321-4567890',
      whatsapp: '03214567890',
      email: 'amina.fatima@example.com',
      address: 'House #42, Street 8, Block 13-D',
      karachiArea: 'Gulshan-e-Iqbal (Blocks 1-19)',
      city: 'Karachi',
      postalCode: '75300',
      notes: 'Please pack in gift paper if possible. It is a birthday gift for my sister!'
    },
    items: [
      {
        productId: 'prod-bag-1',
        name: 'Vintage Meadow Granny Square Tote Bag',
        category: 'bags',
        price: 3200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
        yarnType: '100% Milk Cotton & Natural Linen Lining'
      },
      {
        productId: 'prod-key-1',
        name: 'Mini Sweet Strawberry Crochet Charm',
        category: 'keychains',
        price: 490,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
        yarnType: 'Milk Cotton Yarn & Hypoallergenic Polyfill'
      }
    ],
    subtotal: 4180,
    shippingFee: 0, // Free shipping on orders > 2500
    total: 4180,
    paymentMethod: 'easypaisa',
    easyPaisaDetails: {
      senderMobileNumber: '0321-4567890',
      transactionId: 'EP-98241038291',
      senderName: 'Amina Fatima'
    },
    status: 'crafting',
    statusNotes: 'EasyPaisa payment verified. Currently hand-stitching final strap seams.'
  },
  {
    id: 'ORD-2026-9105',
    createdAt: '2026-09-21T08:15:00Z',
    customer: {
      fullName: 'Zainab Tariq',
      phone: '0300-8765432',
      whatsapp: '03008765432',
      email: 'zainab.t@example.com',
      address: 'Flat 4B, Sea Breeze Apartments, Clifton Block 5, Near Ocean Mall',
      karachiArea: 'Clifton (Blocks 1-9)',
      city: 'Karachi',
      postalCode: '75600',
      notes: 'Call on mobile or WhatsApp before delivery please.'
    },
    items: [
      {
        productId: 'prod-hat-1',
        name: 'Pastel Daisy Scalloped Brim Bucket Hat',
        category: 'hats',
        price: 1850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
        yarnType: '100% Breathable Milk Cotton'
      },
      {
        productId: 'prod-brac-1',
        name: 'Blooming Flora Crochet Friendship Bracelet',
        category: 'bracelets',
        price: 450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1611591475825-792942dd56e1?auto=format&fit=crop&w=900&q=80',
        yarnType: 'Mercerized Egyptian Cotton Floss'
      }
    ],
    subtotal: 2300,
    shippingFee: 180,
    total: 2480,
    paymentMethod: 'cod',
    status: 'confirmed',
    statusNotes: 'Customer confirmed order via WhatsApp/phone. Rider scheduled for Clifton route.'
  },
  {
    id: 'ORD-2026-9106',
    createdAt: '2026-09-21T09:40:00Z',
    customer: {
      fullName: 'Hiba Bilal',
      phone: '0333-1122334',
      whatsapp: '03331122334',
      email: 'hiba.bilal@example.com',
      address: 'Bungalow 78/2, 26th Street, DHA Phase 6',
      karachiArea: 'DHA (Phases 1-8)',
      city: 'Karachi',
      postalCode: '75500',
      notes: 'Deliver between 2 PM and 6 PM'
    },
    items: [
      {
        productId: 'prod-hank-1',
        name: 'Heirloom Scalloped Lace Edge Linen Handkerchief',
        category: 'handkerchiefs',
        price: 850,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=900&q=80',
        yarnType: 'Fine Size 40 Crochet Thread & 100% Cotton Cambric'
      }
    ],
    subtotal: 1700,
    shippingFee: 180,
    total: 1880,
    paymentMethod: 'easypaisa',
    easyPaisaDetails: {
      senderMobileNumber: '0333-1122334',
      transactionId: 'EP-44192084712',
      senderName: 'Hiba Bilal'
    },
    status: 'pending_payment',
    statusNotes: 'Awaiting admin TRX verification in EasyPaisa business dashboard.'
  }
];

