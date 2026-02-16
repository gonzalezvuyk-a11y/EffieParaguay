import { motion } from 'motion/react';
import { ExternalLink, Globe, Calendar, Award, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { DotsPattern } from './DotsPattern';
import { MagneticButton } from './MagneticButton';

export function EffieLatamSection() {
  // Generate particles once with useMemo
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <section 
      id="effie-latam"
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Dots Pattern Background */}
      <DotsPattern />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1760726327876-b19771db838d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbiUyMGFtZXJpY2ElMjBjaXR5c2NhcGUlMjBtb2Rlcm58ZW58MXx8fHwxNzcwNzY4MDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Effie Latinoamérica" 
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) brightness(0.3)' }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.85), rgba(10,10,10,0.95))'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
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
              opacity: [0.2, 0.6, 0.2],
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
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{ color: '#FFFFFF', letterSpacing: '0.02em', fontWeight: 450 }}
            >
              Effie en Latinoamérica
            </h2>
            <div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-lg md:text-xl tracking-wide"
              style={{ 
                backgroundColor: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(184, 150, 80, 0.3)',
                color: '#D4AF6A',
                fontWeight: 500
              }}
            >
              Premiando ideas que funcionan
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
            style={{ color: '#CCCCCC' }}
          >
            Los primeros pasos de Effie en la región se remontan a 1991 cuando Valora en Chile realizó la primera versión de este 
            Concurso bajo la licencia de American Marketing Association, hoy Effie Worldwide, Inc. Hoy, la región representa más del 24% 
            de los programas Effie en el mundo, que ya ha alcanzado un total de 49 programas.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Stats Title */}
            <h3 
              className="text-2xl md:text-3xl relative inline-block"
              style={{ fontWeight: 450 }}
            >
              <span
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF6A, #B89650, #907030)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                +50 programas en el mundo
              </span>
              {/* Decorative underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(to right, transparent, #B89650, transparent)',
                }}
                initial={{ width: 0, x: '-50%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              {[
                { number: '1991', label: 'Primer Effie en Latinoamérica', icon: Calendar },
                { number: '24%', label: 'De los programas Effie mundiales', icon: TrendingUp },
                { number: '49', label: 'Programas Effie en el mundo', icon: Award },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  {/* Premium Card with Glassmorphism */}
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="relative rounded-2xl p-8 h-full transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.4), rgba(20, 20, 20, 0.4))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(184, 150, 80, 0.2)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(184, 150, 80, 0.5)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(184, 150, 80, 0.2), inset 0 1px 0 rgba(184, 150, 80, 0.1)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.6), rgba(20, 20, 20, 0.6))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(184, 150, 80, 0.2)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.4), rgba(20, 20, 20, 0.4))';
                    }}
                  >
                    {/* Subtle glow effect on hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.1), transparent 70%)',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-3 rounded-xl transition-all duration-500"
                        style={{
                          backgroundColor: 'rgba(184, 150, 80, 0.1)',
                          border: '1px solid rgba(184, 150, 80, 0.2)',
                        }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: '#B89650' }} />
                      </div>
                    </div>

                    {/* Number */}
                    <div 
                      className="text-5xl md:text-6xl mb-3 font-medium relative z-10"
                      style={{ 
                        background: 'linear-gradient(135deg, #D4AF6A, #B89650)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block',
                      }}
                    >
                      {stat.number}
                    </div>

                    {/* Label */}
                    <div className="text-sm leading-relaxed relative z-10" style={{ color: '#b0b0b0' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Effie Worldwide Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-12 space-y-8"
          >
            <h3 className="text-4xl md:text-5xl" style={{ fontWeight: 450 }}>
              <span style={{ color: '#FFFFFF' }}>Effie </span>
              <span 
                style={{ 
                  background: 'linear-gradient(to right, #B89650, #907030)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                Worldwide
              </span>
            </h3>

            <MagneticButton
              as="a"
              href="https://effie.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-medium transition-all group text-base"
              style={{
                backgroundColor: '#B89650',
                color: '#000000',
              }}
            >
              <Globe className="w-5 h-5" />
              <span>Visitar Sitio Web</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}