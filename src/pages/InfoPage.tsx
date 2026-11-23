import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const INFO_CONTENT = {
  about: {
    title: 'About CampusCart',
    subtitle: 'Built for students navigating college budgets, hostel moves, and study setups.',
    body: [
      'CampusCart is an informational shopping guide and peer-review platform tailored for university students. Instead of pushing impulsive flash sales or checkout funnels, CampusCart helps you compare specifications side by side, check student-tested pros and cons, and view sample INR budget benchmarks.',
      'When you find the right item—whether a study lamp for power cuts or a quiet mouse for reading rooms—CampusCart links out transparently to external retailer websites where purchases take place.',
    ],
  },
  help: {
    title: 'Help & Frequently Asked Questions',
    subtitle: 'How product comparisons, sample prices, and student reviews work.',
    body: [
      'How do I compare products? Click "Compare" on any 2 or 3 product cards, then open the Compare tab in the top navigation bar. Differences in price, rating, and specifications are automatically highlighted.',
      'Does CampusCart sell products directly? No. CampusCart is strictly a product discovery and comparison platform. Clicking "Visit Store" opens an external retailer website in a new tab.',
      'Why do submitted reviews show "Pending Review"? To keep campus recommendations trustworthy, newly submitted reviews appear in the Admin moderation queue before publishing to everyone.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Local browser storage and demonstration data practices.',
    body: [
      'In this frontend prototype, your demo account details, profile category preferences, comparison selections, and submitted reviews are stored locally in your browser via localStorage.',
      'No personal data is transmitted to external analytics trackers or third-party ad networks. You can clear your session anytime via Logout or reset demonstration records from the Admin Console.',
    ],
  },
} as const;

export function InfoPage() {
  const { section } = useParams<{ section: string }>();
  const [contactSent, setContactSent] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (section === 'contact') {
    const handleContact = (e: React.FormEvent) => {
      e.preventDefault();
      if (!contactEmail.trim() || !contactMessage.trim()) return;
      setContactSent(true);
      setContactEmail('');
      setContactMessage('');
    };

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] font-display">Contact CampusCart</h1>
          <p className="text-sm text-[#475569] mt-1">
            Suggest a student product, report outdated specifications, or reach the campus team.
          </p>
        </div>

        <form
          onSubmit={handleContact}
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
        >
          {contactSent && (
            <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] text-xs font-medium text-[#166534]">
              Message recorded! Thank you for helping improve CampusCart student listings.
            </div>
          )}

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold text-[#475569] mb-1">
              Your Campus Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@university.edu.in"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
            />
          </div>

          <div>
            <label htmlFor="contact-msg" className="block text-xs font-semibold text-[#475569] mb-1">
              Message or Product Suggestion
            </label>
            <textarea
              id="contact-msg"
              rows={4}
              required
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Tell us which product or category we should review next..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  }

  const content =
    INFO_CONTENT[(section as keyof typeof INFO_CONTENT) ?? 'about'] ?? INFO_CONTENT.about;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#1E293B] font-display">{content.title}</h1>
        <p className="text-base text-[#475569]">{content.subtitle}</p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4">
        {content.body.map((paragraph, idx) => (
          <p key={idx} className="text-sm sm:text-base text-[#475569] leading-relaxed">
            {paragraph}
          </p>
        ))}
        <div className="pt-4 border-t border-[#E2E8F0]">
          <Link to="/products" className="text-sm font-semibold text-[#2563EB] hover:underline">
            Explore student products &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
