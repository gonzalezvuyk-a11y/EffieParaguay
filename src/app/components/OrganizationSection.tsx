import { motion } from 'motion/react';
import { Linkedin, Building2 } from 'lucide-react';
import rodrigoImg from '../../assets/715daa6f9996551b737ad97ef89252b581033123.png';
import andreaImg from '../../assets/178de152b616abe5305b8b53b9e44ed8735b9d47.png';
import diegoImg from '../../assets/c56ba5bd43d3ba72a76be16c71e658a84b02a5dd.png';
import pabloImg from '../../assets/e337418de87b5d30c34c9ffa75b8697cffcacbec.png';

export function OrganizationSection() {
  const team = [
    {
      name: 'Rodrigo Weiberlen',
      role: 'Director Effie',
      organization: 'Valora Paraguay',
      image: rodrigoImg,
      linkedin: 'https://www.linkedin.com/in/weiberlen/',
    },
    {
      name: 'Andrea Ferreira',
      role: 'Coordinadora',
      organization: 'General',
      image: andreaImg,
      linkedin: 'https://www.linkedin.com/in/andrea-ferreira-destefani/',
    },
    {
      name: 'Diego Hermosilla',
      role: 'Director Effie Red',
      organization: 'Valora LATAM',
      image: diegoImg,
      linkedin: 'https://www.linkedin.com/in/diegohermosilla/',
    },
    {
      name: 'Pablo Oyarzún',
      role: 'Director de Programas',
      organization: 'Effie Red Valora LATAM',
      image: pabloImg,
      linkedin: 'https://www.linkedin.com/in/pablo-oyarz%C3%BAn-geiger-48620631/',
    },
  ];

  return (
    <section 
      id="organizacion" 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
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
          background: 'radial-gradient(circle at 80% 20%, rgba(144, 112, 48, 0.06), transparent 40%), radial-gradient(circle at 20% 80%, rgba(184, 150, 80, 0.05), transparent 40%)' 
        }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border mb-6"
            style={{
              background: 'linear-gradient(to right, rgba(144, 112, 48, 0.15), rgba(184, 150, 80, 0.15))',
              borderColor: '#333333',
            }}
          >
            <Building2 className="w-4 h-4" style={{ color: '#B89650' }} />
            <span className="text-sm" style={{ color: '#999' }}>Equipo</span>
          </div>

          <h2 className="text-4xl md:text-6xl mb-6" style={{ color: '#FFFFFF', fontWeight: 450, lineHeight: '1.3' }}>
            La{' '}
            <span 
              style={{
                background: 'linear-gradient(to right, #B89650, #907030)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                paddingBottom: '0.1em',
              }}
            >Organización</span>
          </h2>

          <p className="text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: '#b0b0b0' }}>
            Effie Awards Paraguay es organizado por Valora Paraguay, quien opera bajo licencia de{' '}
            <a 
              href="https://effie.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: '#B89650' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF6A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#B89650'; }}
            >
              Effie Worldwide
            </a>
            , de American Marketing Association, New York, para su marca registrada Effie en Argentina, Bolivia, Brasil, Chile, Ecuador, Perú, Paraguay y Uruguay.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <motion.div 
                whileHover={{ y: -8 }}
                className="relative backdrop-blur-sm border rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#333333',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B89650';
                  e.currentTarget.style.backgroundColor = '#151515';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.backgroundColor = '#111111';
                }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, rgba(144, 112, 48, 0.2), rgba(184, 150, 80, 0.2))' }}
                />
                
                {/* Image container - vertical rectangle */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  {/* Image */}
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)'
                    }}
                  />
                </div>

                {/* Info - inside card */}
                <div className="relative p-6 space-y-3">
                  <h3 
                    className="text-xl transition-colors"
                    style={{ color: '#FFFFFF', fontWeight: 450 }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#B89650' }}>
                    {member.role}
                  </p>
                  <p className="text-sm" style={{ color: '#999' }}>
                    {member.organization}
                  </p>
                  
                  {/* LinkedIn Button */}
                  <div className="pt-2">
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center w-10 h-10 backdrop-blur-sm border rounded-lg transition-all"
                      style={{
                        backgroundColor: '#0a0a0a',
                        borderColor: '#333333',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0077B5';
                        e.currentTarget.style.backgroundColor = '#0077B5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333333';
                        e.currentTarget.style.backgroundColor = '#0a0a0a';
                      }}
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin 
                        className="w-5 h-5 transition-colors" 
                        style={{ color: '#999' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; }}
                      />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-5xl mx-auto backdrop-blur-sm border rounded-3xl p-10 md:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.8), rgba(20, 20, 20, 0.8))',
            borderColor: 'rgba(184, 150, 80, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, #D4AF6A, #B89650)',
              }}
            >
              <Building2 className="w-10 h-10" style={{ color: '#000000' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl mb-4" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                Sobre Valora
              </h3>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: '#cccccc' }}>
                Valora es la empresa líder en la operación de Effie Awards en América Latina, 
                comprometida con elevar los estándares de la industria del marketing y la comunicación 
                a través del reconocimiento de la eficacia y el impacto medible.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
