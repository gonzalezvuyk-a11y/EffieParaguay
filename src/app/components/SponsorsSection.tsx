import { motion } from 'motion/react';
import { Handshake } from 'lucide-react';
import { useMemo } from 'react';
import logoCAP from '../../assets/afbae2e05d7d5a9d4ce1542fd1d7cc0f7920b429.png';
import logoFAC from '../../assets/579f03a2d91524519d73697d5d47e5960f44bdbc.png';
import logoEletrcub from '../../assets/94c36a98462ef404415ed858ab26a2905e7eb883.png';
import logoICON from '../../assets/62e24a5913cfd512c8c297f256a814697e9a3045.png';
import logoCerneco from '../../assets/cerneco.png';
import { DotsPattern } from './DotsPattern';

export function SponsorsSection() {
  // Generate particles once with useMemo
  const particles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <section 
      id="aliados"
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
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(184, 150, 80, 0.06), transparent)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(144, 112, 48, 0.06), transparent)' }}
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
        {/* ALIANZAS Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                borderColor: '#333333',
              }}
            >
              <Handshake className="w-4 h-4" style={{ color: '#B89650' }} />
              <span className="text-sm" style={{ color: '#999999' }}>Colaboradores</span>
            </div>

            <h2 
              className="text-4xl md:text-6xl"
              style={{ color: '#B89650', fontWeight: 450 }}
            >
              Alianzas
            </h2>
          </div>

          {/* Alliances Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { logo: logoCerneco, name: 'Cerneco', alt: 'Cerneco', href: 'https://www.cerneco.org.py/', invert: false },
              { logo: logoICON, name: 'APAP', alt: 'APAP', href: 'https://www.apap.org.py/', invert: false },
              { logo: logoEletrcub, name: 'CAP', alt: 'Consejo Argentino de Publicidad', href: 'https://revistacap.com.py/', invert: false },
              { logo: logoCAP, name: 'El Círculo', alt: 'El Círculo', href: 'https://elcirculo.org.py/', invert: true },
              { logo: logoFAC, name: 'FIC', alt: 'Federación de Industrias Creativas', href: 'https://fic.org.py/', invert: true },
            ].map((alliance, index) => (
              <motion.a
                key={index}
                href={alliance.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group block"
              >
                {/* Premium Card */}
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl p-8 h-32 flex items-center justify-center transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.3), rgba(20, 20, 20, 0.3))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(60, 60, 60, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184, 150, 80, 0.4)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(184, 150, 80, 0.15), inset 0 1px 0 rgba(184, 150, 80, 0.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.5), rgba(20, 20, 20, 0.5))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(60, 60, 60, 0.3)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.3), rgba(20, 20, 20, 0.3))';
                  }}
                >
                  {/* Subtle glow effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.08), transparent 70%)',
                      pointerEvents: 'none'
                    }}
                  />
                  
                  {/* Logo */}
                  <img 
                    src={alliance.logo} 
                    alt={alliance.alt}
                    className={`h-12 w-auto object-contain opacity-75 group-hover:opacity-100 transition-all duration-500 relative z-10 ${
                      alliance.invert ? 'filter brightness-0 invert' : ''
                    }`}
                  />
                </motion.div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}