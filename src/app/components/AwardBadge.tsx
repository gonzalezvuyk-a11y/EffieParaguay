import { Award as AwardIcon } from 'lucide-react';
import { AWARD_COLORS, type Award } from '../data/awards';

type AwardBadgeProps = {
  award: Award;
  size?: 'sm' | 'md';
};

/** Medal pill for an Effie level. Always spells the level out so it never relies on color alone. */
export function AwardBadge({ award, size = 'md' }: AwardBadgeProps) {
  const color = AWARD_COLORS[award];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border whitespace-nowrap ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}14`, fontWeight: 500 }}
    >
      <AwardIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
      Effie {award}
    </span>
  );
}
