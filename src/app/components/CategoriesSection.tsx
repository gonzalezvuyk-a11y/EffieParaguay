import { motion } from 'motion/react';
import { Apple, Package, CreditCard, Briefcase, Store, Smartphone } from 'lucide-react';
import { SectionDivider } from './SectionDivider';

export function CategoriesSection() {
  const goldGradient = 'linear-gradient(to right, #907030, #B89650)';
  
  const categories = [
    {
      icon: Apple,
      name: 'Alimentos y bebidas',
      description: 'Productos alimenticios frescos, congelados, empaquetados, postres, snacks, etc. Cervezas, espumantes, licores, vino, destilados, tragos preparados listos para consumir, bebidas funcionales, etc. Bebidas y bebidas dietéticas, bebidas energéticas, café, té, jugos, leches, leches vegetales, agua embotellada con y sin gas, etc.',
    },
    {
      icon: Package,
      name: 'Productos',
      description: 'De cualquier tipo, incluyendo bienes durables (productos de consumo con una vida útil mayor a los 3 años, que satisfacen necesidades a lo largo del tiempo) y excluyendo alimentos, bebidas, licores, productos financieros y telecomunicaciones.',
    },
    {
      icon: CreditCard,
      name: 'Productos o Servicios Financieros',
      description: 'Casos de productos o servicios financieros como tarjetas de crédito o débito, planificación financiera, pago móvil, home banking, créditos, fondos mutuos, seguros financieros, billeteras, etc.',
    },
    {
      icon: Briefcase,
      name: 'Servicios no financieros',
      description: 'Casos de servicios on-line, servicios básicos (luz, agua, gas), seguros no financieros, educación, transporte, etc. Excluye servicios financieros.',
    },
    {
      icon: Store,
      name: 'Retail',
      description: 'Establecimientos comerciales, tiendas, farmacias, supermercados y retail en general.',
    },
    {
      icon: Smartphone,
      name: 'Telecomunicaciones',
      description: 'Casos de productos y servicios relacionados con telefonía fija o móvil, televisión satelital o por cable, cloud computing, conexión de Internet, etc.',
    },
  ];

  return (
    <section 
      id="categorias" 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#FEFFFF' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(144, 112, 48, 0.03), transparent 70%)' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#1a1a1a' }}>
            Categorías de{' '}
            <span 
              style={{
                background: goldGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >Competencia</span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#666666' }}>
            Reconocemos la eficacia en marketing en múltiples industrias y disciplinas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-2xl"
                style={{ background: goldGradient }}
              />
              
              {/* Card */}
              <div 
                className="relative h-full backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300"
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
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: '#B89650' }}
                >
                  <category.icon className="w-7 h-7" style={{ color: '#000000' }} />
                </div>
                
                <h3 
                  className="text-xl mb-3 transition-colors"
                  style={{ color: '#1a1a1a' }}
                >
                  {category.name}
                </h3>
                
                <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional categories info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="mb-6" style={{ color: '#666666' }}>
            Cada categoría evalúa la eficacia basada en objetivos claros, estrategia sólida y resultados comprobados
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="https://drive.google.com/file/d/14NKE5mVLCJ_r_hEvcYo2kLAkYuSwh2N1/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-medium border transition-all"
              style={{
                backgroundColor: '#B89650',
                color: '#000000',
                borderColor: '#B89650',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#B89650';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#B89650';
                e.currentTarget.style.color = '#000000';
              }}
              >
              Ver Bases y Condiciones
            </motion.a>

            <motion.a
              href="https://drive.google.com/file/d/1qHaExVouoK9dQjzaOZTgETZzBcb5jXZt/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-medium border transition-all"
              style={{
                backgroundColor: '#B89650',
                color: '#000000',
                borderColor: '#B89650',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#B89650';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#B89650';
                e.currentTarget.style.color = '#000000';
              }}
              >
              Ver Guía de Inscripción
            </motion.a>
          </div>
    </section>
  );
}
