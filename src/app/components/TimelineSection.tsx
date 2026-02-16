import { motion } from 'motion/react';
import { Calendar, Circle, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { MagneticButton } from './MagneticButton';
import { DotsPattern } from './DotsPattern';

export function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Generate particles once with useMemo to prevent re-calculations
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);
  
  const timelineEvents = [
    {
      title: 'Pre-lanzamiento',
      date: '16 de febrero',
      align: 'right',
    },
    {
      title: 'Workshop 1: Todo sobre Effie',
      date: '23 de febrero',
      description: 'Inscribite aquí',
      url: 'https://koga-py.zoom.us/meeting/register/OsnJd71oRy25q7C5NCL3lw#/registration',
      align: 'left',
    },
    {
      title: 'Call for Entry',
      date: '26 de febrero',
      align: 'right',
    },
    {
      title: 'Workshop 2: ¿Cómo postular?',
      date: '4 de marzo',
      description: 'Inscribite aquí',
      url: 'https://koga-py.zoom.us/meeting/register/T977605MRT6Ioo5yNVutiA#/',
      align: 'left',
    },
    {
      title: 'Workshop 3: Criterios y Categorías',
      date: '19 de marzo',
      description: 'Inscribite aquí',
      url: 'https://koga-py.zoom.us/meeting/register/cyQWL6dmT0OUOMvgNP9sPg#/registration',
      align: 'right',
    },
    {
      title: '1° corte Early Birds',
      date: '09 de abril',
      align: 'left',
    },
    {
      title: 'Workshop 4: Análisis de casos',
      date: '29 de abril',
      description: 'Inscribite aquí',
      url: 'https://koga-py.zoom.us/meeting/register/HjlAWxRNQo2yh9RmwUuA6A#/registration',
      align: 'right',
    },
    {
      title: '2° corte',
      date: '19 de mayo',
      align: 'left',
    },
    {
      title: '3° Cierre de convocatoria',
      date: '19 de junio',
      align: 'right',
    },
    {
      title: 'Jurado Primera Fase',
      date: '21 de julio',
      align: 'left',
    },
    {
      title: 'Jurado Segunda Fase',
      date: '20 de agosto',
      align: 'right',
    },
    {
      title: 'Premiación',
      date: '15 de octubre',
      align: 'left',
      highlight: true,
    },
  ];

  return (
    <section 
      id="calendario" 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Dots Pattern Background */}
      <DotsPattern />

      {/* Border separator */}
      <div 
        className="absolute top-0 left-0 right-0 h-px" 
        style={{ 
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' 
        }} 
      />

      {/* Background decoration */}
      <div className="absolute inset-0">
        {/* Radial gradients */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(184, 150, 80, 0.08), transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(144, 112, 48, 0.08), transparent)' }}
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              backgroundColor: '#B89650',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              borderColor: 'rgba(184, 150, 80, 0.3)',
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: '#B89650' }} />
            <span className="text-sm" style={{ color: '#B89650' }}>Fechas Importantes</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#ffffff' }}>
            <span 
              style={{
                background: 'linear-gradient(to right, #907030, #B89650)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >Calendario</span>{' '}
            2026
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#a0a0a0' }}>
            Planifica tu participación con nuestro cronograma de eventos
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto relative">
          {/* Central line */}
          <div 
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ backgroundColor: '#2a2a2a' }}
          />

          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
                  {/* Left side */}
                  <div className={`${event.align === 'left' ? 'order-1' : 'order-2'}`}>
                    {event.align === 'left' && (
                      <motion.div
                        whileHover={{ y: -4, scale: event.highlight ? 1.03 : 1 }}
                        className="relative rounded-3xl transition-all border"
                        style={{
                          padding: event.highlight ? '2rem' : '1.5rem',
                          backgroundColor: event.highlight ? 'rgba(26, 26, 26, 0.8)' : 'transparent',
                          borderColor: event.highlight ? '#B89650' : 'rgba(60, 60, 60, 0.3)',
                          borderWidth: event.highlight ? '2px' : '1px',
                          boxShadow: event.highlight ? '0 12px 40px rgba(184, 150, 80, 0.3), inset 0 1px 0 rgba(184, 150, 80, 0.1)' : 'none',
                        }}
                      >
                        {event.highlight && (
                          <>
                            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50" style={{ background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.4), transparent)' }} />
                            <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(184, 150, 80, 0.1), rgba(144, 112, 48, 0.05))' }} />
                          </>
                        )}
                        <div className="relative z-10">
                          {event.highlight && (
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-5 h-5" style={{ color: '#D4AF6A' }} />
                              <span className="text-sm font-medium tracking-wide" style={{ color: '#D4AF6A' }}>Evento Principal</span>
                            </div>
                          )}
                          <h3 className="text-xl mb-3" style={{ color: event.highlight ? '#F5E6D3' : '#e0e0e0', fontWeight: 500, letterSpacing: '-0.02em' }}>
                            {event.title}
                          </h3>
                          <div 
                            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: event.highlight ? 'rgba(184, 150, 80, 0.15)' : 'rgba(40, 40, 40, 0.6)',
                              color: event.highlight ? '#D4AF6A' : '#a0a0a0',
                              border: `1px solid ${event.highlight ? 'rgba(184, 150, 80, 0.3)' : 'rgba(80, 80, 80, 0.3)'}`,
                            }}
                          >
                            {event.date}
                          </div>
                          {event.description && (
                            <div className="mt-3">
                              <a 
                                href={event.url || '#'} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:underline inline-flex items-center gap-1" 
                                style={{ color: '#B89650' }}
                              >
                                {event.description}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 order-2">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      animate={event.highlight ? { scale: [1, 1.2, 1] } : {}}
                      transition={event.highlight ? { duration: 2, repeat: Infinity } : {}}
                      className="w-8 h-8 rounded-full flex items-center justify-center relative"
                      style={{
                        backgroundColor: '#B89650',
                        boxShadow: event.highlight ? '0 0 20px rgba(184, 150, 80, 0.6)' : 'none',
                      }}
                    >
                      {event.highlight ? (
                        <Award className="w-4 h-4 fill-current" style={{ color: '#0a0a0a' }} />
                      ) : (
                        <Circle className="w-3 h-3 fill-current" style={{ color: '#0a0a0a' }} />
                      )}
                    </motion.div>
                  </div>

                  {/* Right side */}
                  <div className={`${event.align === 'right' ? 'order-2' : 'order-1'}`}>
                    {event.align === 'right' && (
                      <motion.div
                        whileHover={{ y: -4, scale: event.highlight ? 1.03 : 1 }}
                        className="relative rounded-3xl transition-all border"
                        style={{
                          padding: event.highlight ? '2rem' : '1.5rem',
                          backgroundColor: event.highlight ? 'rgba(26, 26, 26, 0.8)' : 'transparent',
                          borderColor: event.highlight ? '#B89650' : 'rgba(60, 60, 60, 0.3)',
                          borderWidth: event.highlight ? '2px' : '1px',
                          boxShadow: event.highlight ? '0 12px 40px rgba(184, 150, 80, 0.3), inset 0 1px 0 rgba(184, 150, 80, 0.1)' : 'none',
                        }}
                      >
                        {event.highlight && (
                          <>
                            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50" style={{ background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.4), transparent)' }} />
                            <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(184, 150, 80, 0.1), rgba(144, 112, 48, 0.05))' }} />
                          </>
                        )}
                        <div className="relative z-10">
                          {event.highlight && (
                            <div className="flex items-center gap-2 mb-4">
                              <Sparkles className="w-5 h-5" style={{ color: '#D4AF6A' }} />
                              <span className="text-sm font-medium tracking-wide" style={{ color: '#D4AF6A' }}>Evento Principal</span>
                            </div>
                          )}
                          <h3 className="text-2xl mb-4" style={{ color: event.highlight ? '#F5E6D3' : '#e0e0e0', fontWeight: 500, letterSpacing: '-0.02em' }}>
                            {event.title}
                          </h3>
                          <div 
                            className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: event.highlight ? 'rgba(184, 150, 80, 0.15)' : 'rgba(40, 40, 40, 0.6)',
                              color: event.highlight ? '#D4AF6A' : '#a0a0a0',
                              border: `1px solid ${event.highlight ? 'rgba(184, 150, 80, 0.3)' : 'rgba(80, 80, 80, 0.3)'}`,
                            }}
                          >
                            {event.date}
                          </div>
                          {event.description && (
                            <div className="mt-4">
                              <a 
                                href={event.url || '#'} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:underline inline-flex items-center gap-1" 
                                style={{ color: '#B89650' }}
                              >
                                {event.description}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden flex items-start gap-5">
                  {/* Dot */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    animate={event.highlight ? { scale: [1, 1.2, 1] } : {}}
                    transition={event.highlight ? { duration: 2, repeat: Infinity } : {}}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
                    style={{
                      backgroundColor: '#B89650',
                      boxShadow: event.highlight ? '0 0 20px rgba(184, 150, 80, 0.6)' : 'none',
                    }}
                  >
                    {event.highlight ? (
                      <Award className="w-3 h-3 fill-current" style={{ color: '#0a0a0a' }} />
                    ) : (
                      <Circle className="w-2.5 h-2.5 fill-current" style={{ color: '#0a0a0a' }} />
                    )}
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    whileHover={{ y: -4, scale: event.highlight ? 1.03 : 1 }}
                    className="relative flex-1 rounded-3xl p-6 transition-all border"
                    style={{
                      backgroundColor: event.highlight ? 'rgba(26, 26, 26, 0.8)' : 'transparent',
                      borderColor: event.highlight ? '#B89650' : 'rgba(60, 60, 60, 0.3)',
                      borderWidth: event.highlight ? '2px' : '1px',
                      boxShadow: event.highlight ? '0 12px 40px rgba(184, 150, 80, 0.3), inset 0 1px 0 rgba(184, 150, 80, 0.1)' : 'none',
                    }}
                  >
                    {event.highlight && (
                      <>
                        <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50" style={{ background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.4), transparent)' }} />
                        <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(184, 150, 80, 0.1), rgba(144, 112, 48, 0.05))' }} />
                      </>
                    )}
                    <div className="relative z-10">
                      {event.highlight && (
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4" style={{ color: '#D4AF6A' }} />
                          <span className="text-xs font-medium tracking-wide" style={{ color: '#D4AF6A' }}>Evento Principal</span>
                        </div>
                      )}
                      <h3 className="text-lg mb-3" style={{ color: event.highlight ? '#F5E6D3' : '#e0e0e0', fontWeight: 500, letterSpacing: '-0.02em' }}>
                        {event.title}
                      </h3>
                      <div 
                        className="inline-block px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: event.highlight ? 'rgba(184, 150, 80, 0.15)' : 'rgba(40, 40, 40, 0.6)',
                          color: event.highlight ? '#D4AF6A' : '#a0a0a0',
                          border: `1px solid ${event.highlight ? 'rgba(184, 150, 80, 0.3)' : 'rgba(80, 80, 80, 0.3)'}`,
                        }}
                      >
                        {event.date}
                      </div>
                      {event.description && (
                        <div className="mt-3">
                          <a 
                            href={event.url || '#'} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline inline-flex items-center gap-1" 
                            style={{ color: '#B89650' }}
                          >
                            {event.description}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="mb-8 text-sm" style={{ color: '#999999' }}>
            Las inscripciones incluyen tres fechas de cierre con tarifas diferenciadas
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium transition-all"
            style={{
              backgroundColor: '#B89650',
              color: '#000000',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#B89650';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#B89650';
              e.currentTarget.style.color = '#000000';
            }}
          >
            <span>Inscribite ahora</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}