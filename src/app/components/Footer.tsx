import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import effieLogo from '../../assets/50ca5ee8af00d3d0e3dfb019f7124297732c358e.png';

export function Footer() {
  const footerLinks = {
    'Effie Awards': [
      { label: 'Qué es Effie', href: '#que-es' },
      { label: 'Categorías', href: '#categorias' },
      { label: 'Calendario', href: '#calendario' },
      { label: 'Effie Index', href: 'https://www.effieindex.com/' },
    ],
    recursos: [
      { label: 'Bases y Condiciones', href: 'https://drive.google.com/file/d/14NKE5mVLCJ_r_hEvcYo2kLAkYuSwh2N1/view?usp=drive_link' },
      { label: 'Guía de Inscripción', href: 'https://drive.google.com/file/d/1qHaExVouoK9dQjzaOZTgETZzBcb5jXZt/view?usp=drive_link' },
      { label: 'Contacto', href: '#contacto' },
    ],
  };
  const isExternal = (url: string) => /^https?:\/\//.test(url);
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/effie.py/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/effie-awards-paraguay', label: 'LinkedIn' },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(144, 112, 48, 0.05)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(184, 150, 80, 0.05)' }} />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top section */}
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 mb-6 cursor-pointer"
              >
                <div>
                  <img src={effieLogo} alt="Effie Awards" className="h-10 w-auto" />
                </div>
              </motion.div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#999' }}>
                Reconociendo la eficacia en marketing desde 1968. 
                Celebrando ideas que funcionan y generan resultados medibles.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-all group"
                    style={{
                      backgroundColor: '#111111',
                      borderColor: '#333333',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#B89650';
                      e.currentTarget.style.backgroundColor = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.backgroundColor = '#111111';
                    }}
                    aria-label={social.label}
                  >
                    <social.icon 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: '#999' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#B89650'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links columns - aligned to the right */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-6 md:justify-items-end">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="mb-5 text-sm uppercase tracking-wider" style={{ color: '#FFFFFF', fontWeight: 500, letterSpacing: '0.05em' }}>
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <motion.li
                        key={linkIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: linkIndex * 0.05 }}
                      >
                       <a
                         href={link.href}
                         target={isExternal(link.href) ? "_blank" : undefined}
                         rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                         className="text-sm inline-block transition-all duration-300"
                         style={{ color: '#999' }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.color = '#B89650';
                           e.currentTarget.style.transform = 'translateX(4px)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.color = '#999';
                           e.currentTarget.style.transform = 'translateX(0)';
                         }}
                         >
                         {link.label}
                       </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-sm border rounded-2xl p-8 mb-12"
            style={{
              background: 'linear-gradient(to right, rgba(144, 112, 48, 0.1), rgba(184, 150, 80, 0.1))',
              borderColor: '#333333',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl mb-2" style={{ color: '#FFFFFF' }}>Mantente Informado</h3>
                <p className="text-sm" style={{ color: '#999' }}>
                  Recibe noticias, fechas importantes y recursos sobre Effie Awards Paraguay
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 md:w-64 px-6 py-3 backdrop-blur-sm border rounded-xl focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#111111',
                    borderColor: '#333333',
                    color: '#FFFFFF',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#B89650';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: '#B89650',
                    color: '#000000',
                  }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="hidden sm:inline">Suscribirse</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom section */}
          <div className="pt-8 border-t" style={{ borderColor: '#333333' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-center md:text-left" style={{ color: '#666' }}>
                © 2026 Effie Awards Paraguay. Todos los derechos reservados.
              </p>
              <p className="text-sm" style={{ color: '#666' }}>
                 Desarrollado por{' '} <a
                                           href="https://iconlat.com"
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="transition-opacity hover:opacity-80"
                                         style={{ color: '#B89650', fontWeight: 500 }}
                                         >
                   ICON
                 </a>
              </p>
            </div>
            <p className="text-xs text-center mt-6" style={{ color: '#555' }}>
              Parte de la red global Effie Worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
