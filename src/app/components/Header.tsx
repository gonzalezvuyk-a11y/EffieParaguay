import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import effieLogo from '../../assets/50ca5ee8af00d3d0e3dfb019f7124297732c358e.png';
import effieLogoLight from '../../assets/8b95d916e317d94d42fa2064da5c9ed583c35a80.png';

const REGISTRATION_URL = 'https://effie-paraguay.acclaimworks.com/uba/auth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isLightSection, setIsLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll spy logic
      const sections = ['inicio', 'que-es', 'calendario', 'categorias', 'effie-latam', 'organizacion', 'aliados', 'contacto'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            // Detect light sections
            setIsLightSection(['calendario', 'contacto'].includes(sectionId));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Qué es Effie', href: '#que-es' },
    { label: 'Calendario', href: '#calendario' },
    { label: 'Categorías', href: '#categorias' },
    { label: 'Effie LATAM', href: '#effie-latam' },
    { label: 'Organización', href: '#organizacion' },
    { label: 'Aliados', href: '#aliados' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const isActive = (href: string) => {
    return `#${activeSection}` === href;
  };

  const mobileMenuTextColor = scrolled && isLightSection ? '#1a1a1a' : '#FFFFFF';
  const mobileMenuHoverBg = scrolled && isLightSection ? 'rgba(26, 26, 26, 0.08)' : '#111111';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 transition-all duration-500"
    >
      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? 'mx-3 mt-3 rounded-2xl px-6 py-3.5 md:mx-6 md:px-8 lg:mx-auto lg:max-w-7xl backdrop-blur-xl'
            : 'container mx-auto px-6 py-4'
        }`}
        style={{
          backgroundColor: scrolled
            ? (isLightSection ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)')
            : 'transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(144, 112, 48, 0.1)' : 'none',
          border: scrolled
            ? (isLightSection ? '1px solid #e0e0e0' : '1px solid #333333')
            : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="grid">
              <motion.img
                src={effieLogo}
                alt="Effie Awards"
                className="col-start-1 row-start-1 h-12 w-auto"
                animate={{ opacity: isLightSection ? 0 : 1 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
              <motion.img
                src={effieLogoLight}
                alt="Effie Awards"
                className="col-start-1 row-start-1 h-12 w-auto"
                animate={{ opacity: isLightSection ? 1 : 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              const textColor = scrolled && isLightSection 
                ? (active ? '#B89650' : '#1a1a1a')
                : (active ? '#B89650' : '#FFFFFF');
              
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative px-4 py-2 text-sm tracking-wide whitespace-nowrap group"
                  style={{ color: textColor }}
                >
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(144, 112, 48, 0.15)' }}
                    whileHover={{ scale: 1.1 }}
                  />
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300"
                    style={{ 
                      background: 'linear-gradient(to right, #907030, #B89650)',
                      width: active ? '100%' : '0%',
                    }}
                  />
                </motion.a>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 px-6 py-2 rounded-full font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: '#B89650',
                color: '#000000',
              }}
              onClick={() => window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer')}
            >
              Inscríbete
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            style={{ color: scrolled && isLightSection ? '#1a1a1a' : '#FFFFFF' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-3 overflow-hidden"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-sm tracking-wide transition-colors duration-300 py-2 px-4 rounded-lg"
                  style={{ color: mobileMenuTextColor }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B89650';
                    e.currentTarget.style.backgroundColor = mobileMenuHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = mobileMenuTextColor;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="w-full px-6 py-2 rounded-full font-medium cursor-pointer"
                style={{
                  backgroundColor: '#B89650',
                  color: '#000000',
                }}
                onClick={() => window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer')}
              >
                Postulá
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
