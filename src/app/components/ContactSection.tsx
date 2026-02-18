import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import effieTrophy from '../../assets/a72f01c1234fbb88ac0ace85c060207720389b87.png';

export function ContactSection() {
  return (
    <section 
      id="contacto" 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#FEFFFF' }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: '#B89650',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Border separator */}
      <div 
        className="absolute top-0 left-0 right-0 h-px" 
        style={{ 
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' 
        }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                backgroundColor: '#f5f5f5',
                borderColor: '#e0e0e0',
              }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: '#B89650' }} />
              <span className="text-sm" style={{ color: '#666666' }}>¿Tienes Preguntas?</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl mb-6 max-w-2xl" style={{ color: '#1a1a1a', fontWeight: 500 }}>
              Contáctanos
            </h2>
            <p className="text-xl max-w-2xl" style={{ color: '#666666' }}>
              Ya sea que tengas una pregunta, nuestro equipo está aquí para ayudarte.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form className="space-y-5">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    className="w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all"
                    style={{
                      backgroundColor: '#fafafa',
                      borderColor: '#e0e0e0',
                      color: '#1a1a1a',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#B89650';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all"
                      style={{
                        backgroundColor: '#fafafa',
                        borderColor: '#e0e0e0',
                        color: '#1a1a1a',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#B89650';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }}
                    />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <input
                      type="text"
                      placeholder="Teléfono"
                      className="w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all"
                      style={{
                        backgroundColor: '#fafafa',
                        borderColor: '#e0e0e0',
                        color: '#1a1a1a',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#B89650';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }}
                    />
                  </motion.div>
                </div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <textarea
                    placeholder="Mensaje"
                    rows={6}
                    className="w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all resize-none"
                    style={{
                      backgroundColor: '#fafafa',
                      borderColor: '#e0e0e0',
                      color: '#1a1a1a',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#B89650';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }}
                  ></textarea>
                </motion.div>

                <MagneticButton
                  type="submit"
                  className="w-full px-8 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 group transition-all cursor-pointer"
                  style={{
                    backgroundColor: '#B89650',
                    color: '#000000',
                  }}
                >
                  <span>Enviar Mensaje</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </form>
            </motion.div>

            {/* Right side - Animated Trophy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <motion.img
                src={effieTrophy}
                alt="Effie Award Trophy"
                className="w-full h-auto max-w-lg"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}