import Link from 'next/link';
import Image from 'next/image';
import { IconifyIcon, LocationIcon, PhoneIcon, EmailIcon } from '@/components/icons';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 font-body text-xs leading-relaxed py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4 md:px-8">
        <div>
          <Image
            src="/images/digitechlogo.png"
            alt="Digtech Academy"
            width={160}
            height={40}
            className="h-9 w-auto object-contain mb-3"
          />
          <p className="max-w-xs text-gray-500 text-xs leading-relaxed">
            Uganda's premier online learning platform. Practical, tutor-led courses in tech, business and trades — pay in UGX via PesaPal, learn on any connection.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-gray-600">
            {[
              { icon: 'lucide:facebook', href: 'https://facebook.com/digtechacademy', label: 'Facebook' },
              { icon: 'lucide:instagram', href: 'https://instagram.com/digtechacademy', label: 'Instagram' },
              { icon: 'lucide:twitter', href: 'https://x.com/digtechacademy', label: 'X (Twitter)' },
              { icon: 'mdi:tiktok', href: 'https://tiktok.com/@digtechacademy', label: 'TikTok' },
              { icon: 'lucide:linkedin', href: 'https://linkedin.com/company/digtechacademy', label: 'LinkedIn' },
              { icon: 'lucide:youtube', href: 'https://youtube.com/@digtechacademy', label: 'YouTube' },
              { icon: 'mdi:whatsapp', href: 'https://wa.me/256770613201', label: 'WhatsApp' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#1A4095] hover:scale-110 transition-all shadow-sm"
              >
                <IconifyIcon icon={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-display font-bold text-gray-900 text-sm mb-3">Learn</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/courses" className="text-gray-600 hover:text-[#1A4095] transition-colors">Browse Courses</Link></li>
            <li><Link href="/live-courses" className="text-gray-600 hover:text-[#1A4095] transition-colors">Live Online Classes</Link></li>
            <li><Link href="/internship" className="text-gray-600 hover:text-[#1A4095] transition-colors">Internship Program</Link></li>
            <li><Link href="/auth/signup?role=tutor" className="text-gray-600 hover:text-[#1A4095] transition-colors">Become a Tutor</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-gray-900 text-sm mb-3">Quick Links</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="text-gray-600 hover:text-[#1A4095] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-[#1A4095] transition-colors">Contact</Link></li>
            <li><Link href="/faqs" className="text-gray-600 hover:text-[#1A4095] transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-gray-900 text-sm mb-3">Support</h5>
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2"><LocationIcon className="h-4 w-4 text-[#1A4095] flex-shrink-0 mt-0.5" /> Level 2 Grand West Arcade, High Street Mbarara City - Uganda</li>
            <li className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-[#1A4095] flex-shrink-0" /> +256 (0) 770 613 201</li>
            <li className="flex items-center gap-2"><EmailIcon className="h-4 w-4 text-[#1A4095] flex-shrink-0" /> info@digtechsolutionshub.com</li>
            <li className="pt-2 border-t border-gray-100">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A4095] hover:text-[#28C0F4] transition-colors">
                <IconifyIcon icon="lucide:shield-check" className="h-4 w-4" /> Admin Portal Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 mt-8">
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-44 shadow-sm">
          <iframe
            src="https://www.google.com/maps?ll=-0.606781,30.661901&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=8763999400868403491"
            className="h-full w-full border-0"
            loading="lazy"
            title="Digtech Academy Mbarara Location"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-6 text-center text-[11px] text-gray-500 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Digtech Academy. All rights reserved.</span>
        <span>Payment Gateway: <strong className="text-[#1A4095]">PesaPal Uganda</strong></span>
      </div>
    </footer>
  );
}
