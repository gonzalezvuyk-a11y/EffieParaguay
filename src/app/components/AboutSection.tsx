import { motion } from 'motion/react';
import { Target, Lightbulb, TrendingUp, Award } from 'lucide-react';
import { SectionDivider } from './SectionDivider';
import { DotsPattern } from './DotsPattern';
import { CounterAnimation } from './CounterAnimation';

export function AboutSection() {
  const features = [
    {
      icon: Target,
      title: 'Enfoque en Resultados',
      description: 'Premiamos campañas que demuestran eficacia medible y resultados tangibles en los objetivos de negocio.',
    },
    {
      icon: Lightbulb,
      title: 'Creatividad Estratégica',
      description: 'Valoramos la innovación que no solo es original, sino que está respaldada por una estrategia sólida.',
    },
    {
      icon: TrendingUp,
      title: 'Impacto Comercial',
      description: 'Reconocemos las ideas que generan crecimiento real y contribuyen al éxito sostenible de las marcas.',
    },
    {
      icon: Award,
      title: 'Excelencia Global',
      description: 'Parte de la red Effie Worldwide, conectando a los mejores profesionales de marketing del mundo.',
    },
  ];

  return (
    <section 
      id="que-es"
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#FEFFFF' }}
    >
      {/* Border separator */}
      <div 
        className="absolute top-0 left-0 right-0 h-px" 
        style={{ 
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' 
        }} 
      />
      
      {/* Background decoration */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'radial-gradient(circle at 30% 40%, rgba(184, 150, 80, 0.08), transparent 50%), radial-gradient(circle at 70% 60%, rgba(144, 112, 48, 0.06), transparent 50%)' 
        }} 
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#1a1a1a' }}>
            ¿Qué es{' '}
            <span 
              style={{
                background: 'linear-gradient(to right, #B89650, #907030)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >Effie Awards</span>?
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: '#4a4a4a' }}>
            Effie Awards es el único premio que reconoce la efectividad en marketing y comunicación. 
            Desde su creación en 1968, Effie se ha convertido en el símbolo global de logros en marketing 
            efectivo, destacando las ideas que funcionan y fomentan el pensamiento estratégico.
          </p>
          <p className="text-xl mt-6 leading-relaxed" style={{ color: '#4a4a4a' }}>
            En Paraguay, celebramos las campañas que no solo son creativas, sino que demuestran 
            resultados concretos y contribuyen al crecimiento de las marcas y la industria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              {/* Card */}
              <div 
                className="relative h-full border rounded-2xl p-8 transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e0e0e0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B89650';
                  e.currentTarget.style.backgroundColor = '#fafafa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 icon-container"
                >
                  <feature.icon 
                    className="w-6 h-6 transition-colors duration-300" 
                    style={{ color: '#999999' }} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#B89650';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999999';
                    }}
                  />
                </div>
                
                <h3 
                  className="text-xl mb-3 transition-colors"
                  style={{ color: '#1a1a1a', fontWeight: 500 }}
                >
                  {feature.title}
                </h3>
                
                <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info - Effie Index */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-7xl mx-auto"
        >
          <div className="relative border rounded-3xl p-8 md:p-12 overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
            }}
          >
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Title & Description */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-2"
                  style={{
                    backgroundColor: 'rgba(184, 150, 80, 0.08)',
                    borderColor: 'rgba(184, 150, 80, 0.25)',
                  }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: '#B89650' }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#B89650' }}>
                    Ranking Global
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl" style={{ color: '#1a1a1a', fontWeight: 450 }}>
                  El Índice de Efectividad
                </h3>
                
                <p className="text-base leading-relaxed" style={{ color: '#4a4a4a' }}>
                  Effie Worldwide publica anualmente el Effie Index, que reconoce a las empresas de marketing 
                  más efectivas del mundo. Este ranking se basa en el desempeño sostenido de las organizaciones 
                  que ganan premios Effie, estableciendo el estándar de excelencia en la industria.
                </p>
              </div>

              {/* Right side - Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '50+', label: 'Países' },
                  { number: '1968', label: 'Fundación' },
                  { number: '#1', label: 'Premio en Eficacia' },
                  { number: '1000+', label: 'Ganadores Anuales' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="border rounded-xl p-6 text-center transition-all"
                    style={{
                      backgroundColor: '#f8f8f8',
                      borderColor: '#e0e0e0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#B89650';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.backgroundColor = '#f8f8f8';
                    }}
                  >
                    <div
                      className="text-3xl md:text-4xl mb-2"
                      style={{
                        color: '#B89650',
                        fontWeight: 450,
                      }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: '#808080' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
