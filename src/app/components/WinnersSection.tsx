import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Trophy, ExternalLink, Award } from 'lucide-react';

export function WinnersSection() {
  return (
    <section 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(144, 112, 48, 0.08)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(184, 150, 80, 0.08)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border mb-6"
            style={{
              background: 'linear-gradient(to right, rgba(144, 112, 48, 0.15), rgba(184, 150, 80, 0.15))',
              borderColor: '#333333',
            }}
          >
            <Trophy className="w-4 h-4" style={{ color: '#B89650' }} />
            <span className="text-sm" style={{ color: '#999' }}>Casos de Éxito</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#FFFFFF' }}>
            Ganadores
            <span 
              style={{
                background: 'linear-gradient(to right, #B89650, #907030)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            > Destacados</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#999' }}>
            Campañas que demostraron eficacia excepcional y resultados medibles en el mercado paraguayo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {winners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              {/* Card glow */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                style={{ background: 'linear-gradient(to right, rgba(144, 112, 48, 0.3), rgba(184, 150, 80, 0.3))' }}
              />
              
              {/* Card */}
              <div 
                className="relative h-full backdrop-blur-sm border rounded-3xl overflow-hidden transition-all"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#333333',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B89650';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={winner.image}
                    alt={winner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000000, rgba(0, 0, 0, 0.5), transparent)' }} />
                  
                  {/* Medal badge */}
                  <div 
                    className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 backdrop-blur-md rounded-full border"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      borderColor: 'rgba(184, 150, 80, 0.3)',
                    }}
                  >
                    <Award 
                      className="w-4 h-4" 
                      style={{ color: medalColors[winner.result as keyof typeof medalColors].text }} 
                    />
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{winner.result}</span>
                  </div>

                  {/* Year badge */}
                  <div 
                    className="absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-full border"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      borderColor: '#333333',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{winner.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div 
                      className="px-3 py-1 rounded-full border"
                      style={{
                        background: 'linear-gradient(to right, rgba(144, 112, 48, 0.15), rgba(184, 150, 80, 0.15))',
                        borderColor: 'rgba(184, 150, 80, 0.3)',
                      }}
                    >
                      <span style={{ color: '#B89650' }}>
                        {winner.category}
                      </span>
                    </div>
                  </div>

                  <h3 
                    className="text-2xl transition-colors"
                    style={{ color: '#FFFFFF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#B89650'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    {winner.title}
                  </h3>
                  
                  <p className="font-medium" style={{ color: '#CCCCCC' }}>
                    {winner.brand}
                  </p>

                  <p className="text-sm" style={{ color: '#999' }}>
                    {winner.description}
                  </p>

                  {/* Action */}
                  <div 
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: '#333333' }}
                  >
                    <span className="text-sm" style={{ color: '#666' }}>Ver caso completo</span>
                    <ExternalLink 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: '#666' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#B89650'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full font-medium shadow-2xl"
            style={{
              background: 'linear-gradient(to right, #907030, #B89650)',
              color: '#000000',
              boxShadow: '0 20px 60px rgba(184, 150, 80, 0.5)',
            }}
          >
            VER TODOS LOS GANADORES
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}