import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppUrl, KARACHI_AREAS } from '../../data/contentData';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState(KARACHI_AREAS[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsAppDirect = () => {
    const url = getWhatsAppUrl(
      settings.whatsappNumber,
      `Hello ${settings.storeName}! I am contacting from Karachi regarding handmade crochet pieces.`
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill out your name, contact number, and inquiry message', 'error');
      return;
    }

    const compiledMsg = `*New Inquiry for Zarsal Karachi*\n*Name:* ${name}\n*Phone:* ${phone}\n*Karachi Area:* ${area}\n*Message:* ${message}`;
    const url = getWhatsAppUrl(settings.whatsappNumber, compiledMsg);

    setSubmitted(true);
    showToast('Inquiry received! Opening WhatsApp chat...', 'success');
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  return (
    <div className="bg-[#faf8f2] text-[#012f3d] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#6ac8c1]/40 text-[#012f3d] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6ac8c1]" />
            <span>Studio Support • Karachi Contact</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#012f3d] tracking-tight">
            Get in Touch with Zarsal
          </h1>

          <p className="text-[#2d5560] text-sm leading-relaxed">
            Have a question about custom wool colors, flower patterns, or delivery time in your Karachi neighborhood? We reply quickly on WhatsApp and call.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct WhatsApp & Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-[#012f3d] text-[#faf8f2] rounded-3xl p-7 shadow-lg border border-[#012f3d] relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#6ac8c1]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md shrink-0">
                  <MessageCircle className="w-6 h-6 fill-white text-white" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6ac8c1] block">
                    Fastest Response
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Direct WhatsApp Chat
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#faf8f2]/80 leading-relaxed mb-5">
                For custom orders, quick photo exchanges of crochet work, or payment confirmation via EasyPaisa, WhatsApp is our primary channel in Karachi.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#faf8f2]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#6ac8c1] shrink-0" />
                  <span>Instant confirmation &amp; parcel tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#faf8f2]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#6ac8c1] shrink-0" />
                  <span>Custom color palette selection via photos</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20b858] text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-md cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp: {settings.whatsappNumber}</span>
              </button>
            </div>

            {/* Karachi Delivery Scope Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#6ac8c1]/30 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#012f3d]">
                <MapPin className="w-5 h-5 text-[#6ac8c1]" />
                <h4 className="font-serif font-bold text-base">
                  Exclusive Karachi Delivery Coverage
                </h4>
              </div>

              <p className="text-xs text-[#2d5560] leading-relaxed">
                We deliver via dedicated Karachi courier riders to your doorstep within <strong>2 to 3 business days</strong>. Areas covered include:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {KARACHI_AREAS.slice(0, 10).map((areaName) => (
                  <span
                    key={areaName}
                    className="px-2.5 py-1 bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-lg text-[11px] font-medium text-[#012f3d]"
                  >
                    {areaName}
                  </span>
                ))}
                <span className="px-2.5 py-1 bg-[#6ac8c1]/20 rounded-lg text-[11px] font-semibold text-[#012f3d]">
                  + all other Karachi sectors
                </span>
              </div>
            </div>

            {/* Helpline & Studio Details */}
            <div className="bg-white rounded-3xl p-6 border border-[#6ac8c1]/30 shadow-2xs space-y-3 text-xs text-[#2d5560]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#012f3d]" />
                <div>
                  <span className="font-bold text-[#012f3d] block">Phone Helpline</span>
                  <span>{settings.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#f1ede1]">
                <Mail className="w-4 h-4 text-[#012f3d]" />
                <div>
                  <span className="font-bold text-[#012f3d] block">Studio Email</span>
                  <span>{settings.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#f1ede1]">
                <Clock className="w-4 h-4 text-[#012f3d]" />
                <div>
                  <span className="font-bold text-[#012f3d] block">Working Hours</span>
                  <span>Mon – Sat: 10:00 AM – 9:00 PM (Karachi Time)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Order & Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-[#6ac8c1]/30 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6ac8c1]">
                Direct Inquiry • Message Form
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#012f3d] mt-1">
                Send a Design Inquiry or Question
              </h3>
              <p className="text-xs sm:text-sm text-[#2d5560] mt-1">
                Fill this quick form and it will prepare your order note directly for our Karachi studio on WhatsApp.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your message was formatted and WhatsApp chat has been initiated.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#012f3d] mb-1.5">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#012f3d] mb-1.5">
                  Your Area in Karachi *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d] cursor-pointer"
                >
                  {KARACHI_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#012f3d] mb-1.5">
                  Your Inquiry / Custom Order Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what you want (e.g. Lavender Granny Square tote with extra long handles, or matching strawberry keychains for 3 friends)..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f2] border border-[#6ac8c1]/30 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6ac8c1] text-[#012f3d]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#012f3d] hover:bg-[#024357] text-[#faf8f2] font-semibold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 text-[#6ac8c1]" />
                  <span>Send Inquiry to Studio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
