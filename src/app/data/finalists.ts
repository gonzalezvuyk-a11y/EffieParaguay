import type { Award } from './awards';

export type Finalist = {
  category: string;
  brand: string;
  caseName: string;
  agency: string;
  // Set once the ceremony announces it; a finalist without one went home without an Effie.
  award?: Award;
};

export type Winner = Finalist & { award: Award };

export const finalists: Finalist[] = [
  { category: 'Telecomunicaciones', brand: 'Personal', caseName: 'Flow x Flow', agency: 'Wild Fi', award: 'Oro' },
  { category: 'Digital Commerce', brand: 'Personal', caseName: 'Keywords de la gente', agency: 'Wild Fi', award: 'Bronce' },
  { category: 'Éxito Sostenido', brand: 'Personal', caseName: 'Personal Más Personal', agency: 'Wild Fi', award: 'Plata' },
  { category: 'Bajo presupuesto - Productos', brand: 'Resacol Forte', caseName: 'Resacol Forte', agency: 'El Creativo', award: 'Plata' },
  { category: 'Marketing Estacional', brand: 'Pilsen', caseName: 'Dispenser de Identidad', agency: 'Oniria TBWA' },
  { category: 'David versus Goliat', brand: 'Cortagrip', caseName: 'Escuadrón de Abuelas', agency: 'Biedermann', award: 'Bronce' },
  { category: 'Retail', brand: 'Personal', caseName: 'Keywords de la gente', agency: 'Wild Fi', award: 'Plata' },
  { category: 'Marketing Estacional', brand: 'Personal', caseName: 'Flow x Flow', agency: 'Wild Fi' },
  { category: 'Digital Commerce', brand: 'TaDa', caseName: 'Domicilios con Descuento', agency: 'Wild Fi' },
  { category: 'Marketing Estacional', brand: 'Amstel', caseName: 'Amstel - Todas las emociones entran en juego', agency: 'Kausa Central Creativa', award: 'Oro' },
  { category: 'Éxito Sostenido', brand: 'Carreras Universitarias de Grado', caseName: 'Llevate la universidad', agency: 'AYO Agencia de Autor' },
  { category: 'Alimentos y bebidas', brand: "McDonald's", caseName: 'Impacientes', agency: 'Oniria TBWA' },
  { category: 'Promociones', brand: 'Shell', caseName: 'Vasos Albirrojos', agency: 'Oniria TBWA' },
  { category: 'David versus Goliat', brand: 'Senatur', caseName: 'Santa María Pueblo Hotel', agency: 'Oniria TBWA' },
  { category: 'Promociones', brand: 'Combustible Petrobras', caseName: 'Promo Petrobras Rally', agency: 'Biedermann', award: 'Oro' },
  { category: 'Productos', brand: 'Cortagrip', caseName: 'Escuadrón de Abuelas', agency: 'Biedermann', award: 'Bronce' },
  { category: 'Productos o Servicios Financieros', brand: 'Fortaleza', caseName: 'Referentes', agency: 'Wild Fi', award: 'Bronce' },
  { category: 'Éxito Sostenido', brand: 'Corona', caseName: 'Plataforma Casa Corona Verano', agency: 'Oniria TBWA - Paru' },
  { category: 'Éxito Sostenido', brand: 'Shell', caseName: 'Volvimos, Volveremos', agency: 'Oniria TBWA', award: 'Bronce' },
  { category: 'Cambio Positivo - Bien Social', brand: 'Fundación Itaú', caseName: 'Art Daily', agency: 'Nasta', award: 'Bronce' },
  { category: 'Retail', brand: 'Combustible Petrobras', caseName: 'Circuito Petrobras Rally', agency: 'Biedermann', award: 'Oro' },
  { category: 'Cambio Positivo - Bien Social / Marcas-Empresas', brand: 'Fundación Itaú', caseName: 'Art Daily', agency: 'Nasta' },
];

export const winners = finalists.filter((f): f is Winner => f.award !== undefined);
