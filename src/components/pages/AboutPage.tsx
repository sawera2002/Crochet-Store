import React from 'react';
import { CROCHET_BENEFITS, CUSTOMER_REVIEWS, getWhatsAppUrl } from '../../data/contentData';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  Heart,
  Star,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Leaf,
  Users
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  const handleWhatsAppChat = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I read about your crochet studio in Karachi and would love to know more.`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#faf8f2] text-[#012f3d] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Intro Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
            <span> Our Karachi Story</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#012f3d] tracking-tight">
            About Zarsal Handmade Crochet
          </h1>

          <p className="text-[#2d5560] text-sm sm:text-base leading-relaxed">
            Founded with a deep love for traditional artisanal <strong>crochet</strong> handwork,
            <strong> Zarsal</strong> is a homegrown artisan studio based in Karachi. We blend timeless crochet stitches
            with modern aesthetics to create heirloom bags, daisy bucket hats, and floral accessories that celebrate slow, conscious fashion.
          </p>
        </section>

        {/* Benefits Section: "Kia Faisda He Ye Sb" */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6ac8c1]">
              Real Crochet Benefits • Craft Advantages
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#012f3d] mt-1">
              What Makes Handmade Crochet So Special?
            </h2>
            <p className="text-[#2d5560] text-xs sm:text-sm mt-2">
              Why invest in handcrafted crochet over cheap factory plastic goods? Here are the real benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CROCHET_BENEFITS.map((benefit, index) => (
              <div
                key={benefit.id}
                className="bg-white rounded-2xl p-6 border border-[#6ac8c1]/30 hover:border-[#012f3d] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#faf8f2] border border-[#6ac8c1]/30 flex items-center justify-center text-2xl mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#012f3d]">
                    {benefit.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#6ac8c1] mb-2.5 font-sans">
                    {benefit.urduTitle}
                  </p>
                  <p className="text-xs text-[#2d5560] leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f1ede1] flex items-center gap-1.5 text-[11px] font-semibold text-[#012f3d]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6ac8c1]" />
                  <span>Verified 100% Natural Material</span>
                </div>
              </div>
            ))}

            {/* Additional highlight card for Karachi Women Artisans */}
            <div className="bg-[#012f3d] text-[#faf8f2] rounded-2xl p-6 border border-[#012f3d] flex flex-col justify-between shadow-md">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4">
                  👩‍🎨
                </div>
                <h3 className="font-serif font-bold text-xl text-white">
                  Local Karachi Artisan Impact
                </h3>
                <p className="text-xs font-semibold text-[#6ac8c1] mb-2.5 font-sans">
                  Empowering Women Artisans
                </p>
                <p className="text-xs text-[#faf8f2]/80 leading-relaxed">
                  Every order placed on Zarsal directly pays fair wages to skilled female craftswomen working from their homes across Karachi. You are not just buying a bag—you are sustaining a heritage art form.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/15 flex items-center gap-1.5 text-[11px] font-semibold text-[#6ac8c1]">
                <Users className="w-3.5 h-3.5" />
                <span>Fair Trade • Karachi Powered</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews & Testimonials Section */}
        <section className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6ac8c1]">
              Customer Feedback • Karachi Reviews
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#012f3d] mt-1">
              Loved by Karachi’s Crochet Lovers
            </h2>
            <p className="text-[#2d5560] text-xs sm:text-sm mt-2">
              Real feedback from customers across Clifton, DHA, Gulshan, North Nazimabad, and PECHS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-[#6ac8c1]/30 hover:border-[#6ac8c1] shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#012f3d] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f1ede1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[#012f3d] block">
                        {rev.customerName}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-[#2d5560] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#6ac8c1]" />
                        <span>{rev.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#4a707a]">
                      {rev.date}
                    </span>
                  </div>

                  {/* Item Purchased Pill */}
                  <div className="mt-2.5 px-2.5 py-1 bg-[#faf8f2] rounded-lg border border-[#6ac8c1]/20 text-[10px] text-[#2d5560] font-medium truncate">
                    Purchased: {rev.purchasedItem}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Karachi Care Instructions Banner */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#6ac8c1]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6ac8c1]">
                Longevity &amp; Washing • Care Guide
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#012f3d]">
                How to Care for Your Milk Cotton Crochet
              </h3>
              <p className="text-xs sm:text-sm text-[#2d5560] leading-relaxed">
                Because milk cotton is a delicate natural thread, follow these simple washing steps:
              </p>
              <ul className="space-y-2 text-xs text-[#2d5560]">
                <li className="flex items-start gap-2">
                  <span className="text-[#6ac8c1] font-bold">1.</span>
                  <span>Hand wash only in lukewarm or cool water with gentle baby shampoo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6ac8c1] font-bold">2.</span>
                  <span>Never wring or twist. Squeeze gently inside a dry towel to absorb water.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6ac8c1] font-bold">3.</span>
                  <span>Lay flat in the shade to dry. Never hang on a hanger when wet.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#faf8f2] rounded-2xl p-6 border border-[#6ac8c1]/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#012f3d] text-[#6ac8c1] flex items-center justify-center mx-auto text-xl">
                💬
              </div>
              <h4 className="font-serif font-bold text-lg text-[#012f3d]">
                Have Custom Questions or Orders?
              </h4>
              <p className="text-xs text-[#2d5560]">
                Chat directly with our craft studio in Karachi on WhatsApp. We answer in minutes!
              </p>
              <button
                onClick={handleWhatsAppChat}
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Message on WhatsApp ({settings.whatsappNumber})</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
