import { motion } from 'motion/react';
import { Zap, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';
import { DotsPattern } from './DotsPattern';

export function BenefitsSection() {
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

  const benefits = [
    {
      title: 'Descuentos por volumen',
      icon: Zap,
      offers: [
        { discount: '5%', condition: 'al inscribir 5 casos o más' },
        { discount: '10%', condition: 'al inscribir 10 casos o más' },
        { discount: '15%', condition: 'al inscribir 15 casos o más' },
      ],
      conditions: 'Estos descuentos no aplican durante la etapa Early Bird, y las inscripciones deberán estar completas y enviadas para que el descuento pueda aplicarse.',
      highlight: false,
    },
    {
      title: 'Paquete especial de preinscripción',
      icon: Gift,
      description: 'Las agencias interesadas en inscribir 15 casos o más podrán acceder a un paquete especial de preinscripción durante la etapa Early Birds, con la posibilidad de enviar sus postulaciones hasta el cierre de la convocatoria, el 4 de julio de 2026, manteniendo el precio correspondiente a Early Birds.',
      highlight: true,
    },
  ];

  const importantPoints = [
    'Los descuentos aplican únicamente después de la etapa Early Birds',
    'Las inscripciones deben estar completas para acceder al descuento',
    'El paquete especial de preinscripción mantiene el precio de Early Birds hasta el 4 de julio',
  ];

  return (
    <section 
      id="beneficios" 
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
        {/* Header */}
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
            <Gift className="w-4 h-4" style={{ color: '#B89650' }} />
            <span className="text-sm" style={{ color: '#B89650' }}>Beneficios de Inscripción</span>
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
            >Aprovechá</span>{' '}
            nuestras ofertas
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#a0a0a0' }}>
            Descuentos especiales y beneficios exclusivos para tu agencia
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="relative rounded-3xl p-8 border transition-all"
                style={{
                  backgroundColor: benefit.highlight ? 'rgba(26, 26, 26, 0.8)' : 'rgba(20, 20, 20, 0.5)',
                  borderColor: benefit.highlight ? '#B89650' : 'rgba(60, 60, 60, 0.3)',
                  borderWidth: benefit.highlight ? '2px' : '1px',
                  boxShadow: benefit.highlight 
                    ? '0 12px 40px rgba(184, 150, 80, 0.3), inset 0 1px 0 rgba(184, 150, 80, 0.1)'
                    : 'none',
                }}
              >
                {benefit.highlight && (
                  <>
                    <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50" style={{ background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.4), transparent)' }} />
                    <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(184, 150, 80, 0.1), rgba(144, 112, 48, 0.05))' }} />
                  </>
                )}

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: benefit.highlight ? 'rgba(184, 150, 80, 0.15)' : 'rgba(184, 150, 80, 0.1)' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: '#B89650' }} />
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: benefit.highlight ? '#F5E6D3' : '#e0e0e0' }}>
                      {benefit.title}
                    </h3>
                  </div>

                  {/* Offers */}
                  {benefit.offers && (
                    <div className="space-y-4 mb-6">
                      {benefit.offers.map((offer, offerIndex) => (
                        <div key={offerIndex} className="flex items-start gap-3">
                          <div 
                            className="text-2xl font-bold mt-1"
                            style={{ color: '#B89650', minWidth: '3.5rem' }}
                          >
                            {offer.discount}
                          </div>
                          <p style={{ color: '#a0a0a0' }}>{offer.condition}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {benefit.description && (
                    <p className="mb-6" style={{ color: '#a0a0a0', lineHeight: 1.6 }}>
                      {benefit.description}
                    </p>
                  )}

                  {/* Conditions */}
                  {benefit.conditions && (
                    <div 
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'rgba(184, 150, 80, 0.05)',
                        borderColor: 'rgba(184, 150, 80, 0.2)',
                      }}
                    >
                      <p className="text-sm" style={{ color: '#999999' }}>
                        <span className="font-semibold" style={{ color: '#B89650' }}>Condición:</span> {benefit.conditions}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div 
            className="rounded-3xl p-8 border"
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.5)',
              borderColor: 'rgba(184, 150, 80, 0.2)',
            }}
          >
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#F5E6D3' }}>
              Importante
            </h3>
            <ul className="space-y-4">
              {importantPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#B89650' }} />
                  <span style={{ color: '#a0a0a0' }}>{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center px-6"
        >
          <motion.a
            href="https://drive.google.com/file/d/14NKE5mVLCJ_r_hEvcYo2kLAkYuSwh2N1/view"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver bases y condiciones (abre en nueva pestaña)"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center justify-center gap-2 text-lg font-medium transition-all flex-wrap"
            style={{ color: '#B89650' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#D4AF6A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#B89650';
            }}
          >
            <span>Encontrá el detalle completo en nuestras Bases y Condiciones</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
