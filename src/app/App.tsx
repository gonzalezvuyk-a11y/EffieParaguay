import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CategoriesSection } from './components/CategoriesSection';
import { EffieLatamSection } from './components/EffieLatamSection';
import { TimelineSection } from './components/TimelineSection';
import { OrganizationSection } from './components/OrganizationSection';
import { SponsorsSection } from './components/SponsorsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDivider } from './components/SectionDivider';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#000000' }}>
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <TimelineSection />
        <SectionDivider />
        <CategoriesSection />
        <SectionDivider />
        <EffieLatamSection />
        <SectionDivider />
        <OrganizationSection />
        <SectionDivider />
        <SponsorsSection />
        <SectionDivider />
        <ContactSection />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
