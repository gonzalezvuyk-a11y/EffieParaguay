import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { AWARDS, AWARD_COLORS, awardSlug, type Award } from '../data/awards';
import { finalists, winners, type Winner } from '../data/finalists';

const GOLD = '#B89650';
const INK = '#0a0a0a';
const SURFACE = 'rgba(17, 17, 17, 0.72)';
const RULE = '#2a2a2a';
const TEXT_MUTED = '#B8B8B8';
const TEXT_SUBTLE = '#999999';
const PAGE_TITLE = 'Ganadores 2026 | Effie Paraguay';

const collator = new Intl.Collator('es', { sensitivity: 'base' });

// Same rule as the finalists list: "Oniria TBWA - Paru" counts toward Oniria TBWA.
const primaryAgency = (value: string) => value.split(' - ')[0].trim();

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

const winnersByAward = AWARDS.map((award) => ({
  award,
  entries: winners
    .filter((w) => w.award === award)
    .sort((a, b) => collator.compare(a.category, b.category)),
}));

type AgencyTally = { agency: string } & Record<Award, number>;

const agencyTally: AgencyTally[] = [
  ...winners
    .reduce((map, w) => {
      const agency = primaryAgency(w.agency);
      const row = map.get(agency) ?? { agency, Oro: 0, Plata: 0, Bronce: 0 };
      row[w.award] += 1;
      return map.set(agency, row);
    }, new Map<string, AgencyTally>())
    .values(),
].sort(
  (a, b) =>
    b.Oro - a.Oro || b.Plata - a.Plata || b.Bronce - a.Bronce || collator.compare(a.agency, b.agency)
);

const categoryCount = new Set(finalists.map((f) => f.category)).size;

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89650]';

function WinnerCard({ winner }: { winner: Winner }) {
  return (
    <li
      className="flex h-full flex-col gap-3 rounded-2xl border p-5 md:p-6"
      style={{ backgroundColor: SURFACE, borderColor: RULE, borderTopColor: AWARD_COLORS[winner.award] }}
    >
      <p className="text-xs uppercase tracking-[0.15em] text-pretty" style={{ color: TEXT_SUBTLE }}>
        {winner.category}
      </p>
      <h3
        translate="no"
        className="text-xl leading-snug text-pretty break-words"
        style={{ color: '#FFFFFF', fontWeight: 450 }}
      >
        {winner.caseName}
      </h3>
      <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 pt-3 border-t text-sm" style={{ borderColor: '#222222' }}>
        <dt style={{ color: TEXT_SUBTLE }}>Marca</dt>
        <dd translate="no" className="min-w-0 break-words" style={{ color: TEXT_MUTED }}>{winner.brand}</dd>
        <dt style={{ color: TEXT_SUBTLE }}>Agencia</dt>
        <dd translate="no" className="min-w-0 break-words" style={{ color: GOLD }}>{winner.agency}</dd>
      </dl>
    </li>
  );
}

export function WinnersPage() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const intro = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: 'easeOut' as const } };

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
                Ganadores
              </h1>

              <p className="max-w-xl text-base md:text-lg leading-relaxed text-pretty" style={{ color: TEXT_MUTED }}>
                Los casos que el jurado premió en la primera edición de Effie Paraguay, anunciados en la
                noche de premiación del <span className="whitespace-nowrap" style={{ color: '#FFFFFF' }}>15 de octubre</span>.{' '}
                {pluralize(winners.length, 'Effie entregado', 'Effies entregados')} entre {finalists.length} finalistas
                de {categoryCount} categorías.
              </p>
            </div>
          </motion.header>

          <nav aria-label="Niveles de premio" className="mb-12 md:mb-16">
            <ul className="grid grid-cols-3 gap-3">
              {winnersByAward.map(({ award, entries }) => (
                <li key={award}>
                  <a
                    href={`#${awardSlug(award)}`}
                    className={`group flex h-full min-h-11 flex-col gap-1 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 transition-colors hover:border-[#555555] touch-manipulation ${focusRing}`}
                    style={{ backgroundColor: SURFACE, borderColor: RULE }}
                  >
                    <span className="text-3xl sm:text-4xl tabular-nums" style={{ color: AWARD_COLORS[award], fontWeight: 450 }}>
                      {entries.length}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm" style={{ color: TEXT_MUTED }}>
                      Effie {award}
                      <ArrowRight
                        className="w-4 h-4 rotate-90 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
                        style={{ color: GOLD }}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16 md:space-y-20">
            {winnersByAward.map(({ award, entries }) => (
              <section key={award} id={awardSlug(award)} aria-labelledby={`${awardSlug(award)}-title`} className="scroll-mt-28">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b" style={{ borderColor: RULE }}>
                  <h2
                    id={`${awardSlug(award)}-title`}
                    className="text-3xl md:text-4xl"
                    style={{ color: AWARD_COLORS[award], fontWeight: 450 }}
                  >
                    Effie {award}
                  </h2>
                  <span className="text-sm tabular-nums" style={{ color: TEXT_SUBTLE }}>
                    {pluralize(entries.length, 'caso', 'casos')}
                  </span>
                </div>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {entries.map((winner) => (
                    <WinnerCard key={`${winner.category}|${winner.caseName}`} winner={winner} />
                  ))}
                </ul>
              </section>
            ))}

            <section aria-labelledby="medallero-title">
              <h2
                id="medallero-title"
                className="text-3xl md:text-4xl mb-6 pb-4 border-b"
                style={{ color: '#FFFFFF', fontWeight: 450, borderColor: RULE }}
              >
                Effies por agencia
              </h2>
              <div className="overflow-x-auto rounded-2xl border" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
                <table className="w-full min-w-[28rem] text-sm">
                  <caption className="sr-only">Cantidad de Effies Oro, Plata y Bronce por agencia</caption>
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-[0.15em]" style={{ borderColor: RULE, color: TEXT_SUBTLE }}>
                      <th scope="col" className="px-5 py-3 text-left font-normal">Agencia</th>
                      {AWARDS.map((award) => (
                        <th key={award} scope="col" className="px-4 py-3 text-right font-normal">{award}</th>
                      ))}
                      <th scope="col" className="px-5 py-3 text-right font-normal">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencyTally.map((row) => (
                      <tr key={row.agency} className="border-b last:border-b-0" style={{ borderColor: '#222222' }}>
                        <th scope="row" translate="no" className="px-5 py-3 text-left font-normal" style={{ color: '#FFFFFF' }}>
                          {row.agency}
                        </th>
                        {AWARDS.map((award) => (
                          <td
                            key={award}
                            className="px-4 py-3 text-right tabular-nums"
                            style={{ color: row[award] ? AWARD_COLORS[award] : '#666666' }}
                          >
                            {row[award]}
                          </td>
                        ))}
                        <td className="px-5 py-3 text-right tabular-nums" style={{ color: '#FFFFFF' }}>
                          {row.Oro + row.Plata + row.Bronce}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border px-6 py-6"
            style={{ backgroundColor: SURFACE, borderColor: RULE }}
          >
            <p className="text-pretty" style={{ color: TEXT_MUTED }}>
              ¿Querés ver todos los casos que llegaron a la final?
            </p>
            <a
              href="/finalistas"
              className={`group inline-flex min-h-11 shrink-0 items-center gap-2 px-6 rounded-full font-medium transition-colors touch-manipulation hover:bg-[#d1b06a] ${focusRing}`}
              style={{ backgroundColor: GOLD, color: '#000000' }}
            >
              Ver finalistas
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
