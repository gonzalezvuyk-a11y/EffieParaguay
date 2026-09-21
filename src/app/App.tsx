import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { TicketsSection } from './components/TicketsSection';
import { CategoriesSection } from './components/CategoriesSection';
import { EffieLatamSection } from './components/EffieLatamSection';
import { OrganizationSection } from './components/OrganizationSection';
import { JudgesPreviewSection } from './components/JudgesPreviewSection';
import { SponsorsSection } from './components/SponsorsSection';
import { IconSponsorSection } from './components/IconSponsorSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { JudgesPage } from './components/JudgesPage';
import { FinalistsPage } from './components/FinalistsPage';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDivider } from './components/SectionDivider';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { lazy, Suspense, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

const RegistrationPage = lazy(() => import('./components/tickets/RegistrationPage').then((m) => ({ default: m.RegistrationPage })));
const TicketPage = lazy(() => import('./components/tickets/TicketPage').then((m) => ({ default: m.TicketPage })));
const PanelPage = lazy(() => import('./components/tickets/PanelPage').then((m) => ({ default: m.PanelPage })));
const DoorPage = lazy(() => import('./components/tickets/DoorPage').then((m) => ({ default: m.DoorPage })));
const SetPasswordPage = lazy(() => import('./components/tickets/SetPasswordPage').then((m) => ({ default: m.SetPasswordPage })));

const TICKET_ROUTES: Record<string, React.ComponentType> = {
  '/entradas': RegistrationPage,
  '/entradas/ticket': TicketPage,
  '/entradas/panel': PanelPage,
  '/entradas/puerta': DoorPage,
  '/entradas/set-password': SetPasswordPage,
};

export default function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const isJudgesPage = currentPath === '/jurados';
  const isFinalistsPage = currentPath === '/finalistas';
  const TicketRoute = TICKET_ROUTES[currentPath];
  const isStaffRoute = currentPath === '/entradas/panel' || currentPath === '/entradas/puerta';

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.scrollBehavior = 'auto';

    if (prefersReducedMotion) {
      return;
    }

    const easeInOutCubic = (value: number) => {
      return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
    };

    const smoothScrollToSection = (sectionId: string) => {
      const targetElement = document.getElementById(sectionId);
      if (!targetElement) {
        return;
      }

      const headerOffset = 96;
      const startY = window.scrollY;
      const targetY = Math.max(
        targetElement.getBoundingClientRect().top + startY - headerOffset,
        0
      );
      const distance = targetY - startY;
      const duration = Math.min(1900, Math.max(1050, Math.abs(distance) * 1.1));
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      const hash = anchor.getAttribute('href');
      if (!hash || hash.length <= 1) {
        return;
      }

      const sectionId = decodeURIComponent(hash.slice(1));
      if (!document.getElementById(sectionId)) {
        return;
      }

      event.preventDefault();
      smoothScrollToSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#000000' }}>
      <ScrollProgress />
      <Header />
      {TicketRoute ? (
        <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }} aria-busy="true" />}>
          <TicketRoute />
        </Suspense>
      ) : isJudgesPage ? (
        <JudgesPage />
      ) : isFinalistsPage ? (
        <FinalistsPage />
      ) : (
        <main>
          <HeroSection />
          <SectionDivider />
          <AboutSection />
          <TicketsSection />
          <JudgesPreviewSection />
          <CategoriesSection />
          <SectionDivider />
          <EffieLatamSection />
          <SectionDivider />
          <OrganizationSection />
          <SectionDivider />
          {/* Auspiciantes - ICON */}
          <IconSponsorSection />
          <SectionDivider />
          <SponsorsSection />
          <SectionDivider />
          <ContactSection />
        </main>
      )}
      <Footer />
      {!isStaffRoute && <WhatsAppFloatingButton />}
      <Analytics />
    </div>
  );
}
