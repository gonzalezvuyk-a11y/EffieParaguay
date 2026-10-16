export type Award = 'Oro' | 'Plata' | 'Bronce';

// Highest first: every list of winners and every medal count follows this order.
export const AWARDS: Award[] = ['Oro', 'Plata', 'Bronce'];

export const AWARD_COLORS: Record<Award, string> = {
  Oro: '#D4B062',
  Plata: '#C9CED6',
  Bronce: '#C98A5B',
};

export const awardSlug = (award: Award) => `effie-${award.toLowerCase()}`;
