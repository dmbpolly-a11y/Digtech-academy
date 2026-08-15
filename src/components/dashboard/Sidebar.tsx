'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import IconifyIcon from '@/components/icons/IconifyIcon';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export function DashboardSidebar({ items, roleLabel }: { items: NavItem[]; roleLabel: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    router.push('/auth/login');
  }

  const content = (
    <div className="flex h-full flex-col bg-[#0F2A5E] text-[#C7D2EE]">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <Link href="/">
          <Image
            src="/images/digitechlogo.png"
            alt="Digtech Academy"
            width={140}
            height={35}
            className="h-8 w-auto object-contain rounded bg-white/90 p-0.5"
          />
        </Link>
        <button className="md:hidden text-[#9AA7C7]" onClick={() => setOpen(false)} aria-label="Close menu">
          <IconifyIcon icon="lucide:x" className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pt-4 pb-1">
        <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-[#5E6C93] font-semibold">
          {roleLabel}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto py-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
                active
                  ? 'bg-[#28C0F4]/15 text-white border-l-2 border-[#28C0F4]'
                  : 'text-[#AEB9DA] hover:bg-white/5 hover:text-white'
              )}
            >
              <IconifyIcon icon={item.icon} className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <IconifyIcon icon="lucide:log-out" className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#0F2A5E] px-4 py-3 md:hidden">
        <Image
          src="/images/digitechlogo.png"
          alt="Digtech Academy"
          width={130}
          height={33}
          className="h-7 w-auto object-contain rounded bg-white/90 p-0.5"
        />
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <IconifyIcon icon="lucide:menu" className="h-6 w-6 text-white" />
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-[#1E2942] bg-[#0F2A5E] md:block shadow-xl">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0F2A5E] shadow-2xl">{content}</aside>
        </div>
      )}
    </>
  );
}
