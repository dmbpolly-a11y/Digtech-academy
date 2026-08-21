'use client';

import React from 'react';
import IconifyIcon from './IconifyIcon';

export { IconifyIcon };
export default IconifyIcon;

export const LocationIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:map-pin', className });

export const PhoneIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:phone', className });

export const EmailIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:mail', className });

export const MapIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:map', className });

export const ClockIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:clock', className });

export const StarIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:star', className });

export const HandshakeIcon = ({ className = 'w-4 h-4' }: { className?: string }) =>
  React.createElement(IconifyIcon, { icon: 'lucide:handshake', className });
