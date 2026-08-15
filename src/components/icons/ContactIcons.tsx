'use client';

import IconifyIcon from './IconifyIcon';

interface IconProps {
  className?: string;
}

export function LocationIcon({ className = 'h-5 w-5' }: IconProps) {
  return <IconifyIcon icon="lucide:map-pin" className={className} />;
}

export function PhoneIcon({ className = 'h-5 w-5' }: IconProps) {
  return <IconifyIcon icon="lucide:phone" className={className} />;
}

export function EmailIcon({ className = 'h-5 w-5' }: IconProps) {
  return <IconifyIcon icon="lucide:mail" className={className} />;
}

export function ClockIcon({ className = 'h-5 w-5' }: IconProps) {
  return <IconifyIcon icon="lucide:clock" className={className} />;
}

export function MapIcon({ className = 'h-5 w-5' }: IconProps) {
  return <IconifyIcon icon="lucide:map" className={className} />;
}
