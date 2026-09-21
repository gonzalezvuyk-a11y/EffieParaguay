import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { DotsPattern } from './DotsPattern';

const GOLD = '#B89650';

export function TicketsSection() {
  return (
    <section
      id="entradas-preview"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <DotsPattern />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ backgroundColor: 'rgba(17, 17, 17, 0.8)', borderColor: '#333333' }}
          >
            <Ticket className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
            <span className="text-sm" style={{ color: '#999999' }}>Premiación 2026</span>
          </div>

          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#FFFFFF', fontWeight: 450 }}>
            Conseguí tu entrada
          </h2>

          <p className="text-lg leading-relaxed mb-8" style={{ color: '#B8B8B8' }}>
            Esta primera edición es por invitación. Si tu empresa o agencia te dio un código,
            canjealo por tu entrada a la noche de premiación — sin costo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10 text-sm" style={{ color: '#999999' }}>
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
              Jueves 15 de octubre · 20:00 h
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
              Rogelio
            </span>
          </div>

          <motion.a
            href="/entradas"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition-colors"
            style={{ backgroundColor: GOLD, color: '#000000' }}
          >
            <span>Conseguir mi entrada</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
