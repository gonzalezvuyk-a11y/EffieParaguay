import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { finalists, type Finalist } from '../data/finalists';

const GOLD = '#B89650';
const INK = '#0a0a0a';
const SURFACE = 'rgba(17, 17, 17, 0.72)';
const RULE = '#2a2a2a';
const TEXT_MUTED = '#B8B8B8';
const TEXT_SUBTLE = '#999999';
const CEREMONY_DATE = new Date(2026, 9, 15);
const ALL_AGENCIES = '';
const ACTIVE_SECTION_OFFSET = 140;
const PAGE_TITLE = 'Finalistas 2026 | Effie Paraguay';

const collator = new Intl.Collator('es', { sensitivity: 'base' });
const ceremonyLabel = new Intl.DateTimeFormat('es-PY', { day: 'numeric', month: 'long' }).format(CEREMONY_DATE);

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const slugify = (value: string) =>
  `categoria-${normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

const caseKey = (item: Finalist) => `${item.brand}|${item.caseName}`;

const groupByCategory = (items: Finalist[]) => {
  const groups = new Map<string, Finalist[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([category, entries]) => ({
      category,
      slug: slugify(category),
      entries: [...entries].sort((a, b) => collator.compare(a.brand, b.brand)),
    }));
};

const allGroups = groupByCategory(finalists);
const agencies = [...new Set(finalists.map((f) => f.agency))].sort(collator.compare);

const categoriesByCase = finalists.reduce((map, item) => {
  map.set(caseKey(item), [...(map.get(caseKey(item)) ?? []), item.category]);
  return map;
}, new Map<string, string[]>());

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

const readParam = (key: string) => new URLSearchParams(window.location.search).get(key) ?? '';

export function FinalistsPage() {
  const [query, setQuery] = useState(() => readParam('q'));
  const [agency, setAgency] = useState(() => {
    const fromUrl = readParam('agencia');
    return agencies.includes(fromUrl) ? fromUrl : ALL_AGENCIES;
  });
  const [activeSlug, setActiveSlug] = useState(allGroups[0]?.slug ?? '');
  const deferredQuery = useDeferredValue(query);
  const mobileIndexRef = useRef<HTMLDetailsElement>(null);
  const searchId = useId();
  const agencyId = useId();
  const reduceMotion = useReducedMotion();

  const groups = useMemo(() => {
    const term = normalize(deferredQuery.trim());
    const filtered = finalists.filter((f) => {
      if (agency && f.agency !== agency) return false;
      if (!term) return true;
      return normalize(`${f.category} ${f.brand} ${f.caseName} ${f.agency}`).includes(term);
    });
    return groupByCategory(filtered);
  }, [deferredQuery, agency]);

  const resultCount = groups.reduce((total, group) => total + group.entries.length, 0);
  const isFiltering = query.trim() !== '' || agency !== ALL_AGENCIES;

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = query.trim();
    if (term) params.set('q', term);
    else params.delete('q');
    if (agency) params.set('agencia', agency);
    else params.delete('agencia');
    const search = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    );
  }, [query, agency]);

  useEffect(() => {
    const update = () => {
      let current = groups[0]?.slug ?? '';
      for (const group of groups) {
        const section = document.getElementById(group.slug);
        if (section && section.getBoundingClientRect().top <= ACTIVE_SECTION_OFFSET) current = group.slug;
      }
      setActiveSlug(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [groups]);

  const clearFilters = () => {
    setQuery('');
    setAgency(ALL_AGENCIES);
  };

  const filterByAgency = (name: string) => {
    setQuery('');
    setAgency(name);
    document.getElementById(searchId)?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const intro = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: 'easeOut' as const } };

  const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89650]';

  const categoryLinks = (onNavigate?: () => void) =>
    groups.map((group) => {
      const isActive = group.slug === activeSlug;
      return (
        <li key={group.slug}>
          <a
            href={`#${group.slug}`}
            onClick={onNavigate}
            aria-current={isActive ? 'location' : undefined}
            className={`group flex min-h-11 items-center justify-between gap-3 rounded-lg border-l-2 px-3 text-sm transition-colors touch-manipulation hover:bg-white/5 hover:text-white ${focusRing}`}
            style={{
              borderColor: isActive ? GOLD : 'transparent',
              color: isActive ? '#FFFFFF' : TEXT_MUTED,
              backgroundColor: isActive ? 'rgba(184, 150, 80, 0.08)' : undefined,
            }}
          >
            <span className="min-w-0 text-pretty">{group.category}</span>
            <span className="tabular-nums text-xs" style={{ color: GOLD }}>
              {group.entries.length}
            </span>
          </a>
        </li>
      );
    });

  return (
    <main
      className="min-h-screen relative overflow-x-clip pt-36 pb-24"
      style={{ backgroundColor: INK }}
    >
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
              <h1
                className="text-5xl md:text-7xl leading-[1.05] text-balance"
                style={{ color: '#FFFFFF', fontWeight: 450 }}
              >
                Finalistas
              </h1>

              <div className="max-w-xl">
                <p className="text-base md:text-lg leading-relaxed text-pretty" style={{ color: TEXT_MUTED }}>
                  Estos son los casos que el jurado eligió en la primera ronda. Los ganadores de cada
                  categoría se conocen en la premiación del{' '}
                  <span className="whitespace-nowrap" style={{ color: '#FFFFFF' }}>{ceremonyLabel}</span>.
                </p>
                <p className="mt-4 text-sm tabular-nums" style={{ color: TEXT_SUBTLE }}>
                  {pluralize(finalists.length, 'finalista', 'finalistas')} en{' '}
                  {pluralize(allGroups.length, 'categoría', 'categorías')}
                </p>
              </div>
            </div>
          </motion.header>

          <div
            role="search"
            className="rounded-2xl border p-4 md:p-5 mb-8"
            style={{ backgroundColor: SURFACE, borderColor: RULE }}
          >
            <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
              <div>
                <label htmlFor={searchId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>
                  Buscar por marca, caso, agencia o categoría
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: TEXT_SUBTLE }}
                    aria-hidden="true"
                  />
                  <input
                    id={searchId}
                    name="q"
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: Shell, Wild Fi, Retail…"
                    className={`w-full min-h-11 rounded-lg border pl-10 pr-3 text-base bg-transparent placeholder:text-[#8a8a8a] transition-colors hover:border-[#555555] ${focusRing}`}
                    style={{ borderColor: '#333333', color: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={agencyId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>
                  Agencia
                </label>
                <select
                  id={agencyId}
                  name="agencia"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className={`w-full min-h-11 rounded-lg border px-3 text-base transition-colors hover:border-[#555555] touch-manipulation ${focusRing}`}
                  style={{ borderColor: '#333333', color: '#FFFFFF', backgroundColor: '#111111', colorScheme: 'dark' }}
                >
                  <option value={ALL_AGENCIES}>Todas las agencias</option>
                  {agencies.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex min-h-11 items-center justify-between gap-4 text-sm" style={{ color: TEXT_SUBTLE }}>
              <p aria-live="polite" className="tabular-nums whitespace-nowrap">
                {isFiltering
                  ? `${pluralize(resultCount, 'finalista', 'finalistas')} de ${finalists.length}`
                  : pluralize(resultCount, 'finalista', 'finalistas')}
              </p>
              {isFiltering && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap min-h-11 px-2 rounded-lg transition-colors touch-manipulation hover:text-white ${focusRing}`}
                  style={{ color: GOLD }}
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
              style={{ backgroundColor: SURFACE, borderColor: RULE }}
            >
              <p className="text-lg text-balance" style={{ color: '#FFFFFF' }}>
                Ningún finalista coincide con “{query.trim() || agency}”.
              </p>
              <p className="mt-2 text-sm text-pretty" style={{ color: TEXT_MUTED }}>
                Probá con el nombre de una marca, una agencia o una categoría, por ejemplo Shell o Retail.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-6 min-h-11 px-6 rounded-full font-medium transition-colors touch-manipulation hover:bg-[#d1b06a] ${focusRing}`}
                style={{ backgroundColor: GOLD, color: '#000000' }}
              >
                Ver todos los finalistas
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12">
              <nav aria-label="Categorías" className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="px-3 mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: TEXT_SUBTLE }}>
                    Categorías
                  </p>
                  <ul className="space-y-1">{categoryLinks()}</ul>
                </div>
              </nav>

              <details
                ref={mobileIndexRef}
                className="lg:hidden rounded-2xl border group/index"
                style={{ backgroundColor: SURFACE, borderColor: RULE }}
              >
                <summary
                  className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 text-sm touch-manipulation [&::-webkit-details-marker]:hidden ${focusRing}`}
                  style={{ color: '#FFFFFF' }}
                >
                  <span>
                    Ir a una categoría{' '}
                    <span className="tabular-nums" style={{ color: GOLD }}>({groups.length})</span>
                  </span>
                  <ChevronDown
                    className="w-4 h-4 transition-transform group-open/index:rotate-180 motion-reduce:transition-none"
                    style={{ color: GOLD }}
                    aria-hidden="true"
                  />
                </summary>
                <nav aria-label="Categorías" className="border-t px-2 py-2" style={{ borderColor: RULE }}>
                  <ul className="space-y-1">
                    {categoryLinks(() => mobileIndexRef.current?.removeAttribute('open'))}
                  </ul>
                </nav>
              </details>

              <div className="space-y-6 min-w-0">
                {groups.map((group) => (
                  <section
                    key={group.slug}
                    id={group.slug}
                    aria-labelledby={`${group.slug}-title`}
                    className="rounded-2xl border overflow-hidden scroll-mt-28"
                    style={{ backgroundColor: SURFACE, borderColor: RULE }}
                  >
                    <div
                      className="flex items-baseline justify-between gap-4 px-5 md:px-6 py-5 border-b"
                      style={{ borderColor: RULE }}
                    >
                      <h2
                        id={`${group.slug}-title`}
                        className="text-xl md:text-2xl text-balance"
                        style={{ color: GOLD, fontWeight: 450 }}
                      >
                        {group.category}
                      </h2>
                      <span className="text-sm whitespace-nowrap tabular-nums" style={{ color: TEXT_SUBTLE }}>
                        {pluralize(group.entries.length, 'finalista', 'finalistas')}
                      </span>
                    </div>

                    <div
                      className="hidden md:grid md:grid-cols-[2fr_1.4fr_1.2fr] gap-6 px-6 pt-4 pb-1 text-xs uppercase tracking-[0.15em]"
                      style={{ color: TEXT_SUBTLE }}
                      aria-hidden="true"
                    >
                      <span>Caso</span>
                      <span>Marca</span>
                      <span>Agencia</span>
                    </div>

                    <ul>
                      {group.entries.map((entry) => {
                        const otherCategories = (categoriesByCase.get(caseKey(entry)) ?? []).filter(
                          (category) => category !== group.category
                        );
                        return (
                          <li
                            key={caseKey(entry)}
                            className="grid gap-1 md:grid-cols-[2fr_1.4fr_1.2fr] md:gap-6 md:items-baseline px-5 md:px-6 py-4 border-b last:border-b-0"
                            style={{ borderColor: '#222222' }}
                          >
                            <div className="min-w-0">
                              <h3
                                translate="no"
                                className="text-lg leading-snug text-pretty break-words"
                                style={{ color: '#FFFFFF', fontWeight: 450 }}
                              >
                                {entry.caseName}
                              </h3>
                              {otherCategories.length > 0 && (
                                <p className="mt-1.5 text-xs" style={{ color: TEXT_SUBTLE }}>
                                  También finalista en{' '}
                                  {otherCategories.map((category, index) => (
                                    <span key={category}>
                                      {index > 0 && ', '}
                                      <a
                                        href={`#${slugify(category)}`}
                                        className={`inline-flex items-center gap-0.5 rounded underline decoration-[#B89650]/40 underline-offset-4 transition-colors hover:text-white hover:decoration-[#B89650] ${focusRing}`}
                                        style={{ color: GOLD }}
                                      >
                                        {category}
                                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                                      </a>
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                            <p className="text-sm min-w-0 break-words" style={{ color: TEXT_MUTED }}>
                              <span className="md:sr-only" style={{ color: TEXT_SUBTLE }}>Marca: </span>
                              <span translate="no">{entry.brand}</span>
                            </p>
                            <p className="text-sm min-w-0">
                              <span className="md:sr-only" style={{ color: TEXT_SUBTLE }}>Agencia: </span>
                              {agency === entry.agency ? (
                                <span translate="no" style={{ color: GOLD }}>{entry.agency}</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => filterByAgency(entry.agency)}
                                  className={`-my-2 inline-flex min-h-11 items-center rounded text-left underline decoration-transparent underline-offset-4 transition-colors touch-manipulation hover:decoration-[#B89650] hover:text-white ${focusRing}`}
                                  style={{ color: GOLD }}
                                >
                                  <span translate="no">{entry.agency}</span>
                                  <span className="sr-only">: ver todos sus finalistas</span>
                                </button>
                              )}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
