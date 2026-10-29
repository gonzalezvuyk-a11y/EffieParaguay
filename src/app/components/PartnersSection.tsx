import { motion } from 'motion/react';
import { Handshake } from 'lucide-react';
import { DotsPattern } from './DotsPattern';
import logoAudimedia from '../../assets/audimedia.png';
import logoBunkerDb from '../../assets/bunker-db.png';
import logoEquilibrium from '../../assets/equilibrium.svg';
import logoIndustriasCreativas from '../../assets/industrias-creativas-apilado-blanco.svg';
import logoGuarani from '../../assets/guarani-films.png';
import logoPressencia from '../../assets/pressencia.png';
import logoSNT from '../../assets/snt.png';
import logoTelefuturo from '../../assets/telefuturo.png';
import logoRevistaPlus from '../../assets/revista-plus.png';
import logoAPAP from '../../assets/apap.png';
import logoCAP from '../../assets/94c36a98462ef404415ed858ab26a2905e7eb883.png';
import logoFIC from '../../assets/579f03a2d91524519d73697d5d47e5960f44bdbc.png';
import logoElCirculo from '../../assets/afbae2e05d7d5a9d4ce1542fd1d7cc0f7920b429.png';
import logoCerneco from '../../assets/cerneco.png';
import logoClubEjecutivos from '../../assets/club-de-ejecutivos.png';

const GOLD = '#B89650';

type Partner = {
  name: string;
  logo: string;
  href: string;
  // Intrinsic size, so the browser reserves the logo's space before it loads.
  width: number;
  height: number;
  // Size cap per logo: wide wordmarks and stacked marks need different limits to read at the same weight.
  className: string;
  // How a color logo sits on the black background: flat logos go solid white; logos whose
  // shapes are drawn with color (Telefuturo's globe, Plus's red box) go grayscale so they stay readable.
  tone?: 'white' | 'gray';
};

type PartnerGroup = {
  title: [string, string];
  partners: Partner[];
};

const GROUPS: PartnerGroup[] = [
  {
    title: ['Sponsors', 'Patrocinadores'],
    partners: [
      { name: 'Audimedia', logo: logoAudimedia, href: 'https://audimedia.com.py/', width: 640, height: 123, className: 'h-8 max-w-36', tone: 'white' },
      { name: 'Bunker DB', logo: logoBunkerDb, href: 'https://bunkerdb.com/en', width: 640, height: 155, className: 'h-9 max-w-36', tone: 'white' },
      { name: 'Equilibrium', logo: logoEquilibrium, href: 'https://equilibriumbdc.com/', width: 385, height: 59, className: 'h-7 max-w-40', tone: 'white' },
    ],
  },
  {
    title: ['Alianzas', 'estratégicas'],
    partners: [
      { name: 'Industrias Creativas', logo: logoIndustriasCreativas, href: 'https://industriascreativas.com/', width: 403, height: 176, className: 'h-12 max-w-28' },
      { name: 'Guaraní Films', logo: logoGuarani, href: 'https://www.guaranifilms.com/', width: 640, height: 194, className: 'h-10 max-w-32' },
      { name: 'Pressencia Comunicación', logo: logoPressencia, href: 'https://www.pressencia.com.py/', width: 640, height: 118, className: 'h-8 max-w-40' },
      { name: 'SNT', logo: logoSNT, href: 'https://www.snt.com.py/', width: 495, height: 244, className: 'h-9 max-w-24', tone: 'gray' },
      { name: 'Telefuturo', logo: logoTelefuturo, href: 'https://www.telefuturo.com.py/', width: 300, height: 302, className: 'h-12 max-w-12', tone: 'gray' },
      { name: 'Revista Plus', logo: logoRevistaPlus, href: 'https://revistaplus.com.py/', width: 480, height: 206, className: 'h-10 max-w-28', tone: 'gray' },
    ],
  },
  {
    title: ['Gremios', 'aliados'],
    partners: [
      { name: 'Asociación Paraguaya de Agencias de Publicidad', logo: logoAPAP, href: 'https://www.apap.org.py/', width: 480, height: 188, className: 'h-9 max-w-28' },
      { name: 'Cámara de Anunciantes del Paraguay', logo: logoCAP, href: 'https://revistacap.com.py/', width: 500, height: 349, className: 'h-11 max-w-24' },
      { name: 'Federación de Industrias Creativas', logo: logoFIC, href: 'https://fic.org.py/', width: 370, height: 254, className: 'h-11 max-w-24', tone: 'white' },
      { name: 'El Círculo', logo: logoElCirculo, href: 'https://elcirculo.org.py/', width: 275, height: 71, className: 'h-8 max-w-32', tone: 'white' },
      { name: 'Cerneco', logo: logoCerneco, href: 'https://www.cerneco.org.py/', width: 640, height: 158, className: 'h-8 max-w-36' },
      { name: 'Club de Ejecutivos', logo: logoClubEjecutivos, href: 'https://www.clubdeejecutivos.org.py/', width: 240, height: 75, className: 'h-9 max-w-32', tone: 'white' },
    ],
  },
];

/** Sponsors, strategic alliances and industry associations, one labelled row each. */
export function PartnersSection() {
  return (
    <section
      id="aliados"
      aria-labelledby="aliados-title"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <DotsPattern />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ backgroundColor: 'rgba(17, 17, 17, 0.8)', borderColor: '#333333' }}
          >
            <Handshake className="w-4 h-4" style={{ color: GOLD }} aria-hidden="true" />
            <span className="text-sm" style={{ color: '#999999' }}>Colaboradores</span>
          </div>

          <h2 id="aliados-title" className="text-4xl md:text-6xl mb-12 text-balance" style={{ color: '#FFFFFF', fontWeight: 450 }}>
            <span style={{ color: GOLD }}>Organizaciones</span> aliadas
          </h2>

          <div>
            {GROUPS.map((group) => (
              <div
                key={group.title.join(' ')}
                className="grid gap-6 py-8 border-t first:border-t-0 lg:grid-cols-[12rem_1fr] lg:items-center lg:gap-10"
                style={{ borderColor: '#2a2a2a' }}
              >
                <h3 className="text-lg leading-tight" style={{ color: GOLD, fontWeight: 450 }}>
                  {group.title[0]}
                  <br />
                  {group.title[1]}
                </h3>
                <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-10">
                  {group.partners.map((partner) => (
                    <li key={partner.name}>
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-11 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B89650]"
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          width={partner.width}
                          height={partner.height}
                          loading="lazy"
                          decoding="async"
                          className={`${partner.className} w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 ${
                            partner.tone === 'white' ? 'brightness-0 invert' : partner.tone === 'gray' ? 'grayscale brightness-125' : ''
                          }`}
                        />
                        <span className="sr-only"> (abre en otra pestaña)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
