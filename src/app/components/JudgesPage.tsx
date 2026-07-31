import { motion } from 'motion/react';
import { UsersRound } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import { judges } from '../data/judges';

export function JudgesPage() {
  return (
    <main
      className="min-h-screen relative overflow-hidden pt-36 pb-24"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <DotsPattern />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)',
        }}
      />

      <section className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <a
              href="/"
              className="inline-flex items-center text-sm mb-8 transition-colors"
              style={{ color: '#B89650' }}
            >
              Volver al inicio
            </a>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                  style={{
                    backgroundColor: 'rgba(17, 17, 17, 0.8)',
                    borderColor: '#333333',
                  }}
                >
                  <UsersRound className="w-4 h-4" style={{ color: '#B89650' }} />
                  <span className="text-sm" style={{ color: '#999999' }}>Jurado 2026</span>
                </div>

                <h1
                  className="text-4xl md:text-6xl leading-tight"
                  style={{ color: '#FFFFFF', fontWeight: 450 }}
                >
                  Jurado Effie Paraguay 2026
                </h1>
              </div>

              <p className="max-w-xl text-base md:text-lg leading-relaxed" style={{ color: '#B8B8B8' }}>
                Profesionales de marketing, comunicación, creatividad, medios, datos y negocios
                convocados para evaluar las ideas que demuestran efectividad.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(17, 17, 17, 0.72)',
              borderColor: '#2a2a2a',
            }}
          >
            <div
              className="flex items-center justify-between gap-4 px-5 md:px-6 py-5 border-b"
              style={{ borderColor: '#2a2a2a' }}
            >
              <h2 className="text-xl md:text-2xl" style={{ color: '#B89650', fontWeight: 450 }}>
                Nómina de Jurados
              </h2>
              <span className="text-sm" style={{ color: '#999999' }}>
                {judges.length} integrantes
              </span>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ color: '#B89650', borderBottom: '1px solid #2a2a2a' }}>
                    <th className="px-6 py-4 text-sm font-medium">Nombre</th>
                    <th className="px-6 py-4 text-sm font-medium">Cargo</th>
                    <th className="px-6 py-4 text-sm font-medium">Empresa</th>
                  </tr>
                </thead>
                <tbody>
                  {judges.map((judge) => (
                    <tr
                      key={`${judge.name}-${judge.organization}`}
                      className="border-b last:border-b-0"
                      style={{ borderColor: '#222222' }}
                    >
                      <td className="px-6 py-4 align-top text-sm md:text-base" style={{ color: '#FFFFFF' }}>
                        {judge.name}
                      </td>
                      <td className="px-6 py-4 align-top text-sm" style={{ color: '#B8B8B8' }}>
                        {judge.title || '-'}
                      </td>
                      <td className="px-6 py-4 align-top text-sm" style={{ color: '#E5E5E5' }}>
                        {judge.organization || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y" style={{ borderColor: '#222222' }}>
              {judges.map((judge) => (
                <article
                  key={`${judge.name}-${judge.organization}`}
                  className="p-5"
                  style={{ borderColor: '#222222' }}
                >
                  <h3 className="text-lg mb-2" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                    {judge.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#B8B8B8' }}>
                    {judge.title || '-'}
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#B89650' }}>
                    {judge.organization || '-'}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
