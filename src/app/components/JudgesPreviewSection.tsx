import { motion } from 'motion/react';
import { ArrowRight, UsersRound } from 'lucide-react';
import { judges } from '../data/judges';
import judgesImage from '../../assets/jurados-capa-1.png';

export function JudgesPreviewSection() {
  return (
    <section
      id="jurados-preview"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: '#F7F5EF' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(144, 112, 48, 0.28), transparent)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative order-2 lg:order-1"
            >
              <img
                src={judgesImage}
                alt="Trofeo Effie sostenido en una mano"
                className="w-full max-w-[21rem] md:max-w-[30rem] mx-auto lg:mx-0 object-contain"
              />
              <div
                className="absolute inset-y-0 left-0 w-24 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, #F7F5EF 0%, rgba(247, 245, 239, 0) 100%)',
                }}
              />
            </motion.div>

            <div className="max-w-2xl order-1 lg:order-2">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  borderColor: 'rgba(144, 112, 48, 0.28)',
                }}
              >
                <UsersRound className="w-4 h-4" style={{ color: '#907030' }} />
                <span className="text-sm" style={{ color: '#4F4737' }}>Jurados 2026</span>
              </div>

              <h2 className="text-4xl md:text-5xl mb-6 leading-tight" style={{ color: '#111111', fontWeight: 450 }}>
                Conocé a quienes evalúan la efectividad
              </h2>

              <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: '#4F4F4F' }}>
                Un jurado integrado por profesionales de marketing, creatividad, medios,
                investigación, comunicación y negocios.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div>
                  <div className="text-4xl" style={{ color: '#907030', fontWeight: 450 }}>
                    {judges.length}
                  </div>
                  <div className="text-sm mt-1" style={{ color: '#5F5A50' }}>
                    integrantes confirmados
                  </div>
                </div>

                <motion.a
                  href="/jurados"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-fit items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                  style={{
                    backgroundColor: '#B89650',
                    color: '#000000',
                  }}
                >
                  Conocer jurados
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
