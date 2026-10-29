import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Building2, Megaphone } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { advertiserRanking, agencyRanking, withPositions, type RankingEntry } from '../data/ranking';

const GOLD = '#B89650';
const INK = '#0a0a0a';
const SURFACE = 'rgba(17, 17, 17, 0.72)';
const RULE = '#2a2a2a';
const TEXT_MUTED = '#B8B8B8';
const TEXT_SUBTLE = '#999999';
const PAGE_TITLE = 'Ranking 2026 | Effie Paraguay';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89650]';

const pointsLabel = (points: number) => `${points} ${points === 1 ? 'punto' : 'puntos'}`;

type RankingListProps = {
  id: string;
  title: string;
  entries: RankingEntry[];
};

function RankingList({ id, title, entries }: RankingListProps) {
  const top = entries[0]?.points ?? 1;
  return (
    <section aria-labelledby={id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
      <h2 id={id} className="px-5 md:px-6 py-5 border-b text-xl md:text-2xl" style={{ color: GOLD, fontWeight: 450, borderColor: RULE }}>
        {title}
      </h2>
      <ol>
        {withPositions(entries).map((entry, index) => (
          <li
            key={entry.name}
            className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 gap-y-2 px-5 md:px-6 py-4 border-b last:border-b-0"
            style={{ borderColor: '#222222' }}
          >
            <span className="text-sm tabular-nums" style={{ color: index === 0 ? GOLD : TEXT_SUBTLE }}>
              {entry.position}º
            </span>
            <span translate="no" className="min-w-0 break-words" style={{ color: '#FFFFFF', fontWeight: index === 0 ? 500 : 400 }}>
              {entry.name}
            </span>
            <span className="text-sm tabular-nums whitespace-nowrap" style={{ color: index === 0 ? GOLD : TEXT_MUTED }}>
              {pointsLabel(entry.points)}
            </span>
            <span className="col-start-2 col-span-2 h-1 rounded-full" style={{ backgroundColor: '#1f1f1f' }} aria-hidden="true">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(entry.points / top) * 100}%`, backgroundColor: index === 0 ? GOLD : '#5a4a2a' }}
              />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RankingPage() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const intro = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: 'easeOut' as const } };

  const champions = [
    { label: 'Agencia del año', icon: Building2, entry: agencyRanking[0] },
    { label: 'Avisador del año', icon: Megaphone, entry: advertiserRanking[0] },
  ];

  return (
    <main className="min-h-screen relative overflow-x-clip pt-36 pb-24" style={{ backgroundColor: INK }}>
      <DotsPattern />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.header {...intro} className="mb-12 md:mb-16">
            <a
              href="/"
              className={`inline-flex min-h-11 items-center text-sm mb-6 rounded transition-colors hover:text-white ${focusRing}`}
              style={{ color: GOLD }}
            >
              Volver al inicio
            </a>

            <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: GOLD, fontWeight: 500 }}>
              Effie Paraguay 2026
            </p>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <h1 className="text-5xl md:text-7xl leading-[1.05] text-balance" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                Ranking
              </h1>
              <p className="max-w-xl text-base md:text-lg leading-relaxed text-pretty" style={{ color: TEXT_MUTED }}>
                Las agencias y los avisadores que más puntos sumaron con sus casos finalistas y
                ganadores en la primera edición de Effie Paraguay.
              </p>
            </div>
          </motion.header>

          <div className="grid gap-4 md:grid-cols-2 mb-12 md:mb-16">
            {champions.map(({ label, icon: Icon, entry }) => (
              <div
                key={label}
                className="rounded-3xl border p-6 md:p-8"
                style={{
                  borderColor: 'rgba(184, 150, 80, 0.35)',
                  background: `radial-gradient(circle at 85% 15%, rgba(184, 150, 80, 0.14), transparent 60%), ${SURFACE}`,
                }}
              >
                <p className="flex items-center gap-2 text-sm uppercase tracking-[0.2em]" style={{ color: GOLD, fontWeight: 500 }}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </p>
                <p translate="no" className="mt-4 text-4xl md:text-5xl leading-tight break-words" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                  {entry.name}
                </p>
                <p className="mt-2 text-sm tabular-nums" style={{ color: TEXT_MUTED }}>
                  {pointsLabel(entry.points)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <RankingList id="top-agencias" title="Top agencias 2026" entries={agencyRanking} />
            <RankingList id="top-avisadores" title="Top avisadores 2026" entries={advertiserRanking} />
          </div>

          <div
            className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border px-6 py-6"
            style={{ backgroundColor: SURFACE, borderColor: RULE }}
          >
            <p className="text-pretty" style={{ color: TEXT_MUTED }}>
              ¿Querés ver los casos que sumaron estos puntos?
            </p>
            <a
              href="/ganadores"
              className={`group inline-flex min-h-11 shrink-0 items-center gap-2 px-6 rounded-full font-medium transition-colors touch-manipulation hover:bg-[#d1b06a] ${focusRing}`}
              style={{ backgroundColor: GOLD, color: '#000000' }}
            >
              Ver ganadores
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
