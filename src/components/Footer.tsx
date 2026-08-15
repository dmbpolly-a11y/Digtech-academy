import Link from 'next/link';
import Image from 'next/image';
import { LocationIcon, PhoneIcon, EmailIcon } from '@/components/icons';

export function Footer() {
  return (
    <footer className="bg-[#0F2A5E] text-[#B9C4E0] font-body text-xs leading-relaxed">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4 md:px-8">
        <div>
          <Image
            src="/images/digitechlogo.png"
            alt="Digtech Academy"
            width={160}
            height={40}
            className="h-8 w-auto object-contain rounded bg-white/90 p-1 mb-3"
          />
          <p className="max-w-xs text-[#9AA7C7] text-xs leading-relaxed">
            Skills training built for Ugandan learners. Practical, tutor-led courses in tech, business and trades — pay in UGX, learn on any connection.
          </p>
          <div className="mt-4 flex gap-3 text-[#9AA7C7]">
            <IconifyIcon icon="lucide:facebook" className="h-4 w-4 hover:text-[#28C0F4] transition-colors" />
            <IconifyIcon icon="lucide:twitter" className="h-4 w-4 hover:text-[#28C0F4] transition-colors" />
            <IconifyIcon icon="lucide:instagram" className="h-4 w-4 hover:text-[#28C0F4] transition-colors" />
            <IconifyIcon icon="lucide:linkedin" className="h-4 w-4 hover:text-[#28C0F4] transition-colors" />
          </div>
        </div>

        <div>
          <h5 className="font-display font-semibold text-white text-sm mb-3">Learn</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/courses" className="hover:text-[#28C0F4] transition-colors">Courses</Link></li>
            <li><Link href="/live-courses" className="hover:text-[#28C0F4] transition-colors">Live Classes</Link></li>
            <li><Link href="/internship" className="hover:text-[#28C0F4] transition-colors">Internship</Link></li>
            <li><Link href="/auth/signup?role=tutor" className="hover:text-[#28C0F4] transition-colors">Become a Tutor</Link></li>
            <li><Link href="/verify" className="hover:text-[#28C0F4] transition-colors">Verify Certificate</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-semibold text-white text-sm mb-3">Company</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-[#28C0F4] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#28C0F4] transition-colors">Contact</Link></li>
            <li><Link href="/faqs" className="hover:text-[#28C0F4] transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-semibold text-white text-sm mb-3">Contact</h5>
          <ul className="space-y-2 text-xs font-mono text-[#9AA7C7]">
            <li className="flex items-center gap-2"><PhoneIcon className="h-3.5 w-3.5" /> +256 (0) 770 613 201</li>
            <li className="flex items-center gap-2"><EmailIcon className="h-3.5 w-3.5" /> info@digtechsolutionshub.com</li>
            <li className="flex items-center gap-2"><LocationIcon className="h-3.5 w-3.5" /> Level 2 Grand West Arcade, High Street Mbarara City - Uganda</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-[#6C7A9E]">
        © {new Date().getFullYear()} Digtech Academy. All rights reserved.
      </div>
    </footer>
  );
}
