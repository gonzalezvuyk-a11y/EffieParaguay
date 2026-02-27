import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import logoICON from '../../assets/logoicon.png';
import logoGuarani from '../../assets/guarani-films.png';
import logoPressencia from '../../assets/pressencia.png';

export function IconSponsorSection() {
  return (
    <section 
      id="auspiciantes"
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="container mx-auto px-6 relative z-10">
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
              <Star className="w-4 h-4" style={{ color: '#B89650' }} />
              <span className="text-sm" style={{ color: '#999999' }}>Patrocinadores</span>
            </div>
            <h2 
              className="text-4xl md:text-6xl"
              style={{ color: '#B89650', fontWeight: 450 }}
            >
              Auspiciantes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { logo: logoICON, alt: 'ICON', href: 'https://iconlat.com/' },
              { logo: logoGuarani, alt: 'Guarani Films', href: 'https://www.guaranifilms.com/' },
              { logo: logoPressencia, alt: 'Pressencia Comunicación', href: 'https://www.pressencia.com.py/' },
            ].map((sponsor, index) => (
              <motion.a
                key={index}
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group block"
              >
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
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      background: 'radial-gradient(circle at center, rgba(184, 150, 80, 0.08), transparent 70%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.alt}
                    className="h-12 w-auto object-contain opacity-75 group-hover:opacity-100 transition-all duration-500 relative z-10"
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
