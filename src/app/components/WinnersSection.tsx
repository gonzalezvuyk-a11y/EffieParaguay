import { motion } from 'motion/react';
import { ArrowRight, Trophy } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { AwardBadge } from './AwardBadge';
import { AWARDS, AWARD_COLORS } from '../data/awards';
import { winners } from '../data/finalists';

const GOLD = '#B89650';

const collator = new Intl.Collator('es', { sensitivity: 'base' });
const goldWinners = winners
  .filter((w) => w.award === 'Oro')
  .sort((a, b) => collator.compare(a.category, b.category));

/** Home teaser for the 2026 winners: medal count and the Oro cases, linking to /ganadores. */
export function WinnersSection() {
  return (
    <section
      id="ganadores-preview"
      aria-labelledby="ganadores-preview-title"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <DotsPattern />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ backgroundColor: 'rgba(17, 17, 17, 0.8)', borderColor: '#333333' }}
          >
            <Trophy className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
            <span className="text-sm" style={{ color: '#999999' }}>Premiación 2026</span>
          </div>

          <h2 id="ganadores-preview-title" className="text-4xl md:text-6xl mb-6" style={{ color: '#FFFFFF', fontWeight: 450 }}>
            Ganadores 2026
          </h2>

          <p className="text-lg leading-relaxed text-pretty" style={{ color: '#B8B8B8' }}>
            Estos son los casos más efectivos del año en Paraguay, premiados el 15 de octubre.
          </p>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm tabular-nums">
            {AWARDS.map((award) => (
              <span key={award} style={{ color: AWARD_COLORS[award] }}>
                {winners.filter((w) => w.award === award).length} {award}
              </span>
            ))}
          </p>
        </motion.div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {goldWinners.map((winner, index) => (
            <motion.li
              key={`${winner.category}|${winner.caseName}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col gap-3 rounded-2xl border p-5"
              style={{ backgroundColor: 'rgba(17, 17, 17, 0.72)', borderColor: '#2a2a2a' }}
            >
              <AwardBadge award={winner.award} size="sm" />
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color: '#999999' }}>
                {winner.category}
              </p>
              <h3 translate="no" className="text-lg leading-snug text-pretty" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                {winner.caseName}
              </h3>
              <p className="mt-auto text-sm" style={{ color: '#B8B8B8' }}>
                <span translate="no">{winner.brand}</span>
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, agencia </span>
                <span translate="no" style={{ color: GOLD }}>{winner.agency}</span>
              </p>
            </motion.li>
          ))}
        </ul>

        <div className="text-center mt-12">
          <motion.a
            href="/ganadores"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex min-h-11 items-center gap-2 px-8 py-4 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89650]"
            style={{ backgroundColor: GOLD, color: '#000000' }}
          >
            <span>Ver todos los ganadores</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
