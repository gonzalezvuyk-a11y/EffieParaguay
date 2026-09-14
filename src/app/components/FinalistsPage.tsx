import { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Award, Search, X } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { finalists, type Finalist } from '../data/finalists';

const GOLD = '#B89650';
const BORDER = '#2a2a2a';
const ALL_AGENCIES = '';

const collator = new Intl.Collator('es', { sensitivity: 'base' });

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const slugify = (value: string) =>
  normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const groupByCategory = (items: Finalist[]) => {
  const groups = new Map<string, Finalist[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([category, entries]) => ({
      category,
      slug: `categoria-${slugify(category)}`,
      entries: [...entries].sort((a, b) => collator.compare(a.brand, b.brand)),
    }));
};

const allGroups = groupByCategory(finalists);
const agencies = [...new Set(finalists.map((f) => f.agency))].sort(collator.compare);
const uniqueCases = new Set(finalists.map((f) => `${f.brand}|${f.caseName}`)).size;

export function FinalistsPage() {
  const [query, setQuery] = useState('');
  const [agency, setAgency] = useState(ALL_AGENCIES);
  const searchId = useId();
  const agencyId = useId();
  const reduceMotion = useReducedMotion();

  const groups = useMemo(() => {
    const term = normalize(query.trim());
    const filtered = finalists.filter((f) => {
      if (agency && f.agency !== agency) return false;
      if (!term) return true;
      return normalize(`${f.category} ${f.brand} ${f.caseName} ${f.agency}`).includes(term);
    });
    return groupByCategory(filtered);
  }, [query, agency]);

  const resultCount = groups.reduce((total, group) => total + group.entries.length, 0);
  const isFiltering = query.trim() !== '' || agency !== ALL_AGENCIES;

  const clearFilters = () => {
    setQuery('');
    setAgency(ALL_AGENCIES);
  };

  const fadeIn = (delay = 0) =>
    reduceMotion
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay } };

  return (
    <main
      className="min-h-screen relative overflow-hidden pt-36 pb-24"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <DotsPattern />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' }}
      />

      <section className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn()} className="mb-10">
            <a href="/" className="inline-flex items-center text-sm mb-8 py-2" style={{ color: GOLD }}>
              Volver al inicio
            </a>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.8)', borderColor: '#333333' }}
                >
                  <Award className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: '#999999' }}>Finalistas 2026</span>
                </div>

                <h1 className="text-4xl md:text-6xl leading-tight" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                  Finalistas Effie Paraguay 2026
                </h1>
              </div>

              <p className="max-w-xl text-base md:text-lg leading-relaxed" style={{ color: '#B8B8B8' }}>
                Los casos que superaron la primera ronda de evaluación del jurado y compiten por
                un Effie en cada categoría.
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-3 mt-10 max-w-xl">
              {[
                { label: 'Finalistas', value: finalists.length },
                { label: 'Casos', value: uniqueCases },
                { label: 'Categorías', value: allGroups.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border px-4 py-3"
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.72)', borderColor: BORDER }}
                >
                  <dt className="text-[0.65rem] sm:text-xs uppercase tracking-wide sm:tracking-wider truncate" style={{ color: '#999999' }}>
                    {stat.label}
                  </dt>
                  <dd className="text-2xl md:text-3xl mt-1" style={{ color: GOLD, fontWeight: 450 }}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div
            className="rounded-2xl border p-4 md:p-5 mb-6"
            style={{ backgroundColor: 'rgba(17, 17, 17, 0.72)', borderColor: BORDER }}
          >
            <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
              <div>
                <label htmlFor={searchId} className="block text-sm mb-2" style={{ color: '#B8B8B8' }}>
                  Buscar por marca, caso, agencia o categoría
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: '#999999' }}
                    aria-hidden="true"
                  />
                  <input
                    id={searchId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: Shell, Wild Fi, Retail…"
                    className="w-full min-h-11 rounded-lg border pl-10 pr-3 text-base bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ borderColor: '#333333', color: '#FFFFFF', outlineColor: GOLD }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={agencyId} className="block text-sm mb-2" style={{ color: '#B8B8B8' }}>
                  Agencia
                </label>
                <select
                  id={agencyId}
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full min-h-11 rounded-lg border px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ borderColor: '#333333', color: '#FFFFFF', backgroundColor: '#111111', outlineColor: GOLD }}
                >
                  <option value={ALL_AGENCIES}>Todas las agencias</option>
                  {agencies.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <nav aria-label="Ir a categoría" className="mt-5">
              <ul className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
                {groups.map((group) => (
                  <li key={group.slug} className="shrink-0">
                    <a
                      href={`#${group.slug}`}
                      className="inline-flex items-center gap-2 whitespace-nowrap min-h-11 rounded-full border px-4 text-sm transition-colors hover:border-[#B89650] hover:text-[#B89650] focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ borderColor: '#333333', color: '#E5E5E5', outlineColor: GOLD }}
                    >
                      {group.category}
                      <span className="text-xs" style={{ color: GOLD }}>{group.entries.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm" style={{ color: '#999999' }}>
              <p aria-live="polite">
                {resultCount === 1 ? '1 finalista' : `${resultCount} finalistas`}
                {isFiltering && ` de ${finalists.length}`}
              </p>
              {isFiltering && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 min-h-11 px-2 rounded-lg focus-visible:outline-2"
                  style={{ color: GOLD, outlineColor: GOLD }}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {groups.length === 0 ? (
            <div
              className="rounded-2xl border px-6 py-16 text-center"
              style={{ backgroundColor: 'rgba(17, 17, 17, 0.72)', borderColor: BORDER }}
            >
              <p className="text-lg" style={{ color: '#FFFFFF' }}>No encontramos finalistas con esos filtros.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 min-h-11 px-6 rounded-full font-medium"
                style={{ backgroundColor: GOLD, color: '#000000' }}
              >
                Ver todos los finalistas
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <section
                  key={group.slug}
                  id={group.slug}
                  aria-labelledby={`${group.slug}-title`}
                  className="rounded-2xl border overflow-hidden scroll-mt-28"
                  style={{ backgroundColor: 'rgba(17, 17, 17, 0.72)', borderColor: BORDER }}
                >
                  <div
                    className="flex items-center justify-between gap-4 px-5 md:px-6 py-5 border-b"
                    style={{ borderColor: BORDER }}
                  >
                    <h2 id={`${group.slug}-title`} className="text-xl md:text-2xl" style={{ color: GOLD, fontWeight: 450 }}>
                      {group.category}
                    </h2>
                    <span className="text-sm whitespace-nowrap" style={{ color: '#999999' }}>
                      {group.entries.length === 1 ? '1 finalista' : `${group.entries.length} finalistas`}
                    </span>
                  </div>

                  <ul>
                    {group.entries.map((entry) => (
                      <li
                        key={`${entry.brand}-${entry.caseName}`}
                        className="grid gap-1 md:grid-cols-[2fr_1.5fr_1.25fr] md:gap-6 md:items-baseline px-5 md:px-6 py-4 border-b last:border-b-0"
                        style={{ borderColor: '#222222' }}
                      >
                        <h3 className="text-lg leading-snug" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                          {entry.caseName}
                        </h3>
                        <p className="text-sm" style={{ color: '#B8B8B8' }}>
                          <span className="md:sr-only" style={{ color: '#999999' }}>Marca: </span>
                          {entry.brand}
                        </p>
                        <p className="text-sm" style={{ color: GOLD }}>
                          <span className="md:sr-only" style={{ color: '#999999' }}>Agencia: </span>
                          {entry.agency}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
