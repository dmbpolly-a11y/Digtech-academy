'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { SearchBar } from '@/components/SearchBar';

const LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/live-courses', label: 'Live Classes' },
  { href: '/internship', label: 'Internship' },
  { href: '/about', label: 'About' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/courses?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-y border-slate-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Digtech Academy Logo.png"
            alt="Digtech Academy"
            width={176}
            height={44}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-[#1A4095]">
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Search"
          >
            <IconifyIcon icon="lucide:search" className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-[#1A4095] transition-colors hover:bg-slate-50"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-[#28C0F4] px-4.5 py-2 text-xs font-semibold text-[#04263A] transition-all hover:bg-[#1fb3e6] shadow-sm hover:shadow"
          >
            Get started
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <IconifyIcon icon="lucide:x" className="h-6 w-6 text-slate-700" />
          ) : (
            <IconifyIcon icon="lucide:menu" className="h-6 w-6 text-slate-700" />
          )}
        </button>
      </nav>

      {/* Search bar overlay */}
      {searchOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:px-8">
          <SearchBar onSearch={handleSearch} className="mx-auto max-w-2xl" />
        </div>
      )}

      {open && (
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 pt-2 border-t border-slate-100">
            <Link
              href="/auth/login"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-xs font-semibold text-[#1A4095]"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="flex-1 rounded-lg bg-[#28C0F4] px-4 py-2 text-center text-xs font-semibold text-[#04263A]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
