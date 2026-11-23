import { Link } from 'react-router-dom';
import { Globe, Mail, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E2E8F0]">
          <div className="md:col-span-2 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-lg font-bold text-[#1E293B] font-display"
            >
              <span className="w-7 h-7 rounded-md bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">
                CC
              </span>
              <span>CampusCart</span>
            </Link>
            <p className="text-sm text-[#475569] max-w-md leading-relaxed">
              Student-centered shopping information and recommendation platform. Built to help
              university students compare specs, read peer reviews, and find budget-conscious gear.
            </p>
            <p className="text-xs text-[#64748B] max-w-md">
              Note: Product listings and INR prices are sample reference data for student
              evaluation. Purchases take place on external retailer websites.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1E293B] mb-3 font-display">Explore</h3>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <Link to="/products" className="hover:text-[#2563EB] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#2563EB] transition-colors">
                  Compare Products
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-[#2563EB] transition-colors">
                  Student Recommendations
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#2563EB] transition-colors">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1E293B] mb-3 font-display">Information</h3>
            <ul className="space-y-2.5 text-sm text-[#475569]">
              <li>
                <Link to="/info/about" className="hover:text-[#2563EB] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/info/contact" className="hover:text-[#2563EB] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/info/help" className="hover:text-[#2563EB] transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/info/privacy" className="hover:text-[#2563EB] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>&copy; {new Date().getFullYear()} CampusCart. Academic Demo Prototype.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/info/contact"
              aria-label="Email CampusCart"
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#2563EB] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Support</span>
            </Link>
            <Link
              to="/info/about"
              aria-label="Campus Community"
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#2563EB] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Campus Guide</span>
            </Link>
            <Link
              to="/recommendations"
              aria-label="Share Student Picks"
              className="inline-flex items-center gap-1.5 text-[#475569] hover:text-[#2563EB] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Student Picks</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
