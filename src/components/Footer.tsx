import Link from 'next/link';
import Image from 'next/image';
import { IconifyIcon, LocationIcon, PhoneIcon, EmailIcon } from '@/components/icons';

export function Footer() {
  return (
    <footer className="bg-[#04263A] border-t border-gray-700 text-gray-300 font-body text-xs leading-relaxed py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-5 md:px-8">
        <div>
          <Image
            src="/images/Digtech Academy Logo White.png"
            alt="Digtech Academy"
            width={160}
            height={40}
            className="h-9 w-auto object-contain mb-3"
          />
          <p className="max-w-xs text-gray-400 text-xs leading-relaxed">
            Uganda's premier online learning platform. Practical, tutor-led courses in tech, business and trades — pay in UGX via PesaPal, learn on any connection.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-gray-400">
            {[
              { icon: 'lucide:facebook', href: 'https://www.facebook.com/digtechsolutionshub/', label: 'Facebook' },
              { icon: 'lucide:instagram', href: 'https://instagram.com/digtechacademy', label: 'Instagram' },
              { icon: 'lucide:twitter', href: 'https://x.com/Digtech1', label: 'X (Twitter)' },
              { icon: 'mdi:tiktok', href: 'https://www.tiktok.com/@korabusiness/video/7543967921161112888', label: 'TikTok' },
              { icon: 'lucide:linkedin', href: 'https://ug.linkedin.com/company/digtech-solutions-hub', label: 'LinkedIn' },
              { icon: 'lucide:youtube', href: 'https://www.youtube.com/@DigiTechFX', label: 'YouTube' },
              { icon: 'mdi:whatsapp', href: 'https://wa.me/256770613201', label: 'WhatsApp' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#28C0F4] hover:scale-110 transition-all shadow-sm"
              >
                <IconifyIcon icon={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-display font-bold text-white text-sm mb-3">Learn</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/courses" className="text-gray-400 hover:text-[#28C0F4] transition-colors">Browse Courses</Link></li>
            <li><Link href="/live-courses" className="text-gray-400 hover:text-[#28C0F4] transition-colors">Live Online Classes</Link></li>
            <li><Link href="/internship" className="text-gray-400 hover:text-[#28C0F4] transition-colors">Internship Program</Link></li>
            <li><Link href="/auth/signup?role=tutor" className="text-gray-400 hover:text-[#28C0F4] transition-colors">Become a Tutor</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-white text-sm mb-3">Resources</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="text-gray-400 hover:text-[#28C0F4] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-[#28C0F4] transition-colors">Contact</Link></li>
            <li><Link href="/faqs" className="text-gray-400 hover:text-[#28C0F4] transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-white text-sm mb-3">Whitepapers</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/whitepapers/digital-skills-uganda-2024.pdf" className="text-gray-400 hover:text-[#28C0F4] transition-colors flex items-center gap-1.5">
                <IconifyIcon icon="lucide:file-text" className="h-3.5 w-3.5" />
                Digital Skills Report 2024
              </a>
            </li>
            <li>
              <a href="/whitepapers/online-education-framework.pdf" className="text-gray-400 hover:text-[#28C0F4] transition-colors flex items-center gap-1.5">
                <IconifyIcon icon="lucide:file-text" className="h-3.5 w-3.5" />
                Online Education Framework
              </a>
            </li>
            <li>
              <a href="/whitepapers/payment-integration-guide.pdf" className="text-gray-400 hover:text-[#28C0F4] transition-colors flex items-center gap-1.5">
                <IconifyIcon icon="lucide:file-text" className="h-3.5 w-3.5" />
                Payment Integration Guide
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-white text-sm mb-3">Support & Contact</h5>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <LocationIcon className="h-4 w-4 text-[#28C0F4] flex-shrink-0 mt-0.5" /> 
              <span>Level 2 Grand West Arcade, High Street Mbarara City - Uganda</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-[#28C0F4] flex-shrink-0" /> 
              <a href="tel:+256770613201" className="hover:text-white transition-colors">+256 (0) 770 613 201</a>
            </li>
            <li className="flex items-center gap-2">
              <EmailIcon className="h-4 w-4 text-[#28C0F4] flex-shrink-0" /> 
              <a href="mailto:info@digtechsolutionshub.com" className="hover:text-white transition-colors">info@digtechsolutionshub.com</a>
            </li>
            <li className="pt-2 border-t border-gray-700">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#28C0F4] hover:text-white transition-colors">
                <IconifyIcon icon="lucide:shield-check" className="h-4 w-4" /> Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 mt-8">
        <div className="rounded-2xl overflow-hidden border border-gray-600 h-44 shadow-sm">
          <iframe
            src="https://www.google.com/maps?ll=-0.606781,30.661901&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=8763999400868403491"
            className="h-full w-full border-0"
            loading="lazy"
            title="Digtech Academy Mbarara Location"
          />
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-[11px] text-gray-400 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Digtech Academy. All rights reserved.</span>
        <span>Payment Gateway: <strong className="text-[#28C0F4]">PesaPal Uganda</strong></span>
      </div>
    </footer>
  );
}
