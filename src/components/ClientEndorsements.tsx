/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award } from 'lucide-react';
import { ClientReview } from '../types';

interface ClientEndorsementsProps {
  reviews: ClientReview[];
  className?: string;
}

export default function ClientEndorsements({ reviews, className = '' }: ClientEndorsementsProps) {
  return (
    <div className={`border-t border-white/[0.06] pt-16 pb-12 ${className}`}>
      <div className="flex items-center gap-2 mb-10">
        <Award className="w-5 h-5 text-yellow-500" />
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight uppercase text-white">
          CLIENT ENDORSEMENTS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-onyx-900 border border-white/[0.04] flex flex-col justify-between hover:bg-white/[0.02]"
            id={`endorsement-review-${idx}`}
          >
            <p className="text-xs sm:text-sm text-onyx-300 font-sans italic leading-relaxed mb-6">
              "{review.comment}"
            </p>
            <div>
              <p className="text-xs font-display font-medium text-white">{review.name}</p>
              <p className="font-mono text-[9px] text-onyx-500 uppercase tracking-wider">
                {review.role}, <span className="text-onyx-400 font-medium">{review.company}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
