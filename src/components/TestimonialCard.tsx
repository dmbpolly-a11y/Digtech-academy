'use client';

import { useState } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';

interface TestimonialCardProps {
  id: number;
  quote: string;
  student_name: string;
  course_title?: string | null;
  full_review?: string | null;
}

export function TestimonialCard({ quote, student_name, course_title, full_review }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Check if there's more content to show
  const hasMore = full_review && full_review.length > quote.length;
  const displayText = expanded && full_review ? full_review : quote;
  const shouldTruncate = !expanded && displayText.length > 150;
  const truncatedText = shouldTruncate ? displayText.slice(0, 150) + '...' : displayText;

  return (
    <blockquote className="rounded-xl2 border border-brand-light bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action/10 font-display font-bold text-action">
          {student_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm">{student_name}</p>
          {course_title && <p className="text-xs text-ink/50 mt-0.5">{course_title}</p>}
        </div>
        <div className="flex items-center gap-0.5 text-gold">
          {[...Array(5)].map((_, i) => (
            <IconifyIcon key={i} icon="lucide:star" className="h-3 w-3 fill-gold" />
          ))}
        </div>
      </div>
      
      <p className="mt-3 text-sm text-ink/80 leading-relaxed">
        <span className="text-action/60">&ldquo;</span>
        {truncatedText}
        <span className="text-action/60">&rdquo;</span>
      </p>
      
      {(hasMore || shouldTruncate) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-action hover:text-action-dark transition-colors"
        >
          {expanded ? (
            <>
              <IconifyIcon icon="lucide:chevron-up" className="h-3.5 w-3.5" />
              Show less
            </>
          ) : (
            <>
              <IconifyIcon icon="lucide:chevron-down" className="h-3.5 w-3.5" />
              Read more
            </>
          )}
        </button>
      )}
    </blockquote>
  );
}
