'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import IconifyIcon from '@/components/icons/IconifyIcon';

export function PaymentSuccessToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const status = searchParams.get('payment');
    const amount = searchParams.get('amount');
    const course = searchParams.get('course');

    if (status === 'success') {
      setMessage(
        course 
          ? `Payment successful! You're now enrolled in ${decodeURIComponent(course)}.`
          : amount
          ? `Payment of UGX ${amount} received successfully!`
          : 'Payment completed successfully!'
      );
      setShow(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 shadow-2xl max-w-md">
        <div className="flex items-start gap-3 text-white">
          <div className="rounded-full bg-white/20 p-2">
            <IconifyIcon icon="lucide:check-circle" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-bold text-base mb-1">Payment Successful!</h4>
            <p className="text-sm text-white/90">{message}</p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <IconifyIcon icon="lucide:x" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
