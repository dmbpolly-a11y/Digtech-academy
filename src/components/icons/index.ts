'use client';

import React from 'react';
import IconifyIcon from './IconifyIcon';

export { IconifyIcon };
export default IconifyIcon;

export const LocationIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:map-pin" className={className} />
);
export const PhoneIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:phone" className={className} />
);
export const EmailIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:mail" className={className} />
);
export const MapIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:map" className={className} />
);
export const ClockIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:clock" className={className} />
);
export const StarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:star" className={className} />
);
export const HandshakeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <IconifyIcon icon="lucide:handshake" className={className} />
);
