'use client';

import { Icon, type IconProps } from '@iconify/react';

interface IconifyIconProps extends Omit<IconProps, 'icon'> {
  icon: string;
}

export default function IconifyIcon({ icon, ...props }: IconifyIconProps) {
  return <Icon icon={icon} {...props} />;
}
