# Effie Awards Paraguay - Sitio Web Oficial

Sitio web premium para Effie Awards Paraguay, diseñado con un enfoque moderno, profesional y completamente responsive.

## 📋 Descripción

Plataforma web de reconocimiento a la eficacia en marketing y publicidad en Paraguay, operada por Valora Paraguay bajo licencia de Effie Worldwide. El sitio presenta información sobre los premios, calendario, categorías, equipo organizador y más.

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS v4** - Framework CSS moderno
- **Motion (Framer Motion)** - Animaciones fluidas y profesionales
- **React Router** - Navegación entre páginas
- **Lucide React** - Iconografía moderna
- **Vite** - Build tool ultrarrápido

## 📦 Instalación

### Requisitos previos
- Node.js 18+ instalado
- npm, pnpm o yarn

### Pasos de instalación

```bash
# 1. Clonar o descomprimir el proyecto
cd effie-awards-paraguay

# 2. Instalar dependencias
npm install
# o con pnpm:
pnpm install
# o con yarn:
yarn install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# El sitio estará disponible en http://localhost:5173
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo local
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview de la versión compilada

# Linting
npm run lint         # Verifica código
```

## 📁 Estructura del Proyecto

```
effie-awards-paraguay/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes React
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── CalendarSection.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── EffieLatamSection.tsx
│   │   │   ├── OrganizationSection.tsx
│   │   │   ├── SponsorsSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── figma/
│   │   ├── App.tsx          # Componente principal
│   │   └── routes.ts        # Configuración de rutas
│   ├── styles/
│   │   ├── theme.css        # Variables de diseño
│   │   └── fonts.css        # Fuentes personalizadas
│   ├── imports/             # Assets importados
│   └── main.tsx             # Punto de entrada
├── public/                  # Archivos estáticos
├── package.json             # Dependencias
└── README.md               # Este archivo
```

## 🌐 Deployment

### Opción 1: Vercel (Recomendada)

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deployar:
   ```bash
   vercel
   ```
4. Seguir las instrucciones en pantalla

**O mediante GitHub:**
1. Subir el proyecto a un repositorio de GitHub
2. Importar en Vercel desde la dashboard
3. Vercel detectará automáticamente la configuración
4. Deploy automático ✅

### Opción 2: Netlify

1. Compilar el proyecto:
   ```bash
   npm run build
   ```
2. Crear cuenta en [netlify.com](https://netlify.com)
3. Arrastrar y soltar la carpeta `dist` en Netlify
4. O conectar repositorio de Git para deploy automático

### Opción 3: Hosting Tradicional

1. Compilar:
   ```bash
   npm run build
   ```
2. Subir contenido de la carpeta `dist/` a tu servidor web
3. Configurar servidor para SPA (Single Page Application)
   - Apache: agregar `.htaccess`
   - Nginx: configurar redirects

## ⚙️ Configuración de Dominio Personalizado

### DNS Records necesarios:
```
Tipo: A
Nombre: @
Valor: [IP del hosting]

Tipo: CNAME
Nombre: www
Valor: [dominio principal]
```

### En Vercel/Netlify:
1. Ir a Settings → Domains
2. Agregar dominio personalizado
3. Seguir instrucciones de configuración DNS
4. Esperar propagación (15 min - 48 hrs)

## 🎨 Características Destacadas

- ✨ **Diseño Premium**: Estética moderna y profesional
- 📱 **Completamente Responsive**: Optimizado para móvil, tablet y desktop
- 🎭 **Animaciones Suaves**: Efectos con Motion/Framer Motion
- 🌓 **Secciones Alternadas**: Esquema claro/oscuro para mejor legibilidad
- ⚡ **Alto Rendimiento**: Optimizado con Vite y React 18
- 🎯 **SEO Ready**: Estructura semántica HTML5
- ♿ **Accesible**: Cumple estándares de accesibilidad web
- 🔒 **Seguro**: Sin dependencias vulnerables

## 🎯 Secciones del Sitio

1. **Hero/Inicio** - Presentación principal con efectos premium
2. **Qué es Effie** - Descripción de los premios
3. **Calendario** - Timeline de eventos 2025
4. **Categorías** - Grid de categorías disponibles
5. **Effie LATAM** - Red Latinoamericana
6. **Organización** - Equipo y estructura
7. **Aliados** - Sponsors y partners
8. **Contacto** - Formulario y datos de contacto

## 🔧 Personalización

### Colores (en `/src/styles/theme.css`):
```css
--color-gold-light: #D4AF6A;
--color-gold: #B89650;
--color-gold-dark: #907030;
```

### Contenido:
Los textos y datos están en cada componente dentro de `/src/app/components/`

## 📞 Soporte Técnico

Para dudas o problemas:
- Revisar documentación de [Vite](https://vitejs.dev)
- Documentación de [React](https://react.dev)
- Guías de [Tailwind CSS](https://tailwindcss.com)

## 📄 Notas Importantes

- **Imágenes**: Las imágenes están optimizadas y usan el sistema `figma:asset`
- **Fuentes**: Se cargan desde Google Fonts (Archivo)
- **Navegación**: Smooth scroll entre secciones
- **Performance**: Lazy loading de componentes implementado
- **Browser Support**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🚀 Checklist Pre-Deploy

- [ ] Probar en móvil, tablet y desktop
- [ ] Verificar todas las imágenes cargan correctamente
- [ ] Revisar enlaces de navegación
- [ ] Probar formulario de contacto
- [ ] Verificar meta tags para SEO
- [ ] Configurar dominio personalizado
- [ ] Activar HTTPS/SSL
- [ ] Probar velocidad de carga (Google PageSpeed)
- [ ] Verificar en diferentes navegadores

## 📊 Métricas de Rendimiento Esperadas

- **Performance Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 📝 Licencia

© 2025 Effie Awards Paraguay - Valora Paraguay. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Effie Awards Paraguay**

Para más información: contacto@effieawardsparaguay.com (actualizar con email real)
