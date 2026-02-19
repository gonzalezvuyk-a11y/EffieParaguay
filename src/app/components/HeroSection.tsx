import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import effieGif from '../../assets/0a75d0ddf2653507a1ac14e86fc1c8bd276cf698.png';
import { DotsPattern } from './DotsPattern';
import { MagneticButton } from './MagneticButton';

const REGISTRATION_URL = 'https://effie-paraguay.acclaimworks.com/uba/auth';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface InteractiveTrophyGifProps {
  src: string;
  alt: string;
  className?: string;
  playbackTargetRef: React.MutableRefObject<number>;
}

function InteractiveTrophyGif({ src, alt, className, playbackTargetRef }: InteractiveTrophyGifProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    let isDisposed = false;
    const decodedFrames: VideoFrame[] = [];
    const frameDurations: number[] = [];

    const cleanupFrames = () => {
      decodedFrames.forEach((frame) => frame.close());
    };

    const initialize = async () => {
      if (typeof window === 'undefined' || !('ImageDecoder' in window)) {
        setUseFallbackImage(true);
        return;
      }

      try {
        const response = await fetch(src);
        const data = await response.arrayBuffer();
        const decoder = new ImageDecoder({ data, type: 'image/gif' });

        await decoder.tracks.ready;
        const totalFrames = decoder.tracks.selectedTrack?.frameCount ?? 0;

        if (!totalFrames) {
          setUseFallbackImage(true);
          return;
        }

        for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
          const { image } = await decoder.decode({ frameIndex });
          decodedFrames.push(image);
          frameDurations.push(Math.max(16, (image.duration ?? 100000) / 1000));
        }

        if (isDisposed) {
          cleanupFrames();
          return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const firstFrame = decodedFrames[0];
        canvas.width = firstFrame.displayWidth;
        canvas.height = firstFrame.displayHeight;

        const context = canvas.getContext('2d');
        if (!context) {
          setUseFallbackImage(true);
          cleanupFrames();
          return;
        }

        let currentFrame = 0;
        let frameAccumulator = 0;
        let lastTime = performance.now();
        let playbackRate = 1;

        const render = (currentTime: number) => {
          if (isDisposed) return;

          const deltaMs = currentTime - lastTime;
          lastTime = currentTime;

          const targetRate = playbackTargetRef.current;
          const easing = targetRate < playbackRate ? 0.2 : 0.1;
          playbackRate += (targetRate - playbackRate) * easing;
          frameAccumulator += deltaMs * playbackRate;

          while (frameAccumulator >= frameDurations[currentFrame]) {
            frameAccumulator -= frameDurations[currentFrame];
            currentFrame = (currentFrame + 1) % decodedFrames.length;
          }

          while (frameAccumulator <= -frameDurations[(currentFrame - 1 + decodedFrames.length) % decodedFrames.length]) {
            currentFrame = (currentFrame - 1 + decodedFrames.length) % decodedFrames.length;
            frameAccumulator += frameDurations[currentFrame];
          }

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(decodedFrames[currentFrame], 0, 0, canvas.width, canvas.height);

          animationFrame = requestAnimationFrame(render);
        };

        animationFrame = requestAnimationFrame(render);
      } catch {
        setUseFallbackImage(true);
        cleanupFrames();
      }
    };

    initialize();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      cleanupFrames();
    };
  }, [src, playbackTargetRef]);

  if (useFallbackImage) {
    return <img src={src} alt={alt} className={className} />;
  }

  return <canvas ref={canvasRef} className={className} aria-label={alt} role="img" />;
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const trophyRef = useRef<HTMLDivElement>(null);
  const playbackTargetRef = useRef(1);
  const playbackGlideTimeoutRef = useRef<number | null>(null);
  const playbackResetTimeoutRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const hoverRotate = useMotionValue(0);
  const smoothHoverRotate = useSpring(hoverRotate, {
    stiffness: 220,
    damping: 20,
    mass: 0.45,
  });
  const hoverDepthX = useTransform(smoothHoverRotate, [-14, 0, 12], [-68, 0, 28]);
  const hoverDepthScale = useTransform(smoothHoverRotate, [-14, 0, 12], [0.8, 1, 1.05]);
  const hoverDepthBrightness = useTransform(smoothHoverRotate, [-14, 0, 12], [0.8, 1, 1.04]);
  const hoverDepthFilter = useTransform(hoverDepthBrightness, (brightness) => `brightness(${brightness})`);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-26T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Generate particles once with useMemo to prevent re-calculations
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  const handleTrophyMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!trophyRef.current) return;

    const rect = trophyRef.current.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const normalizedX = (cursorX / rect.width) * 2 - 1;
    const tilt = Math.max(-14, Math.min(12, normalizedX * 12.5));

    hoverRotate.set(tilt);

    if (event.movementX >= 0) {
      playbackTargetRef.current = Math.min(5, 1 + event.movementX / 2.8);
    } else {
      playbackTargetRef.current = Math.max(-6, 1 + event.movementX / 1.3);
    }

    if (playbackGlideTimeoutRef.current) {
      window.clearTimeout(playbackGlideTimeoutRef.current);
    }

    if (playbackResetTimeoutRef.current) {
      window.clearTimeout(playbackResetTimeoutRef.current);
    }

    const glidingTarget = event.movementX < 0 ? -2.2 : 1.9;

    playbackGlideTimeoutRef.current = window.setTimeout(() => {
      playbackTargetRef.current = glidingTarget;
    }, 120);

    playbackResetTimeoutRef.current = window.setTimeout(() => {
      playbackTargetRef.current = 1;
    }, 760);
  };

  const handleTrophyMouseLeave = () => {
    hoverRotate.set(0);

    if (playbackGlideTimeoutRef.current) {
      window.clearTimeout(playbackGlideTimeoutRef.current);
      playbackGlideTimeoutRef.current = null;
    }

    if (playbackResetTimeoutRef.current) {
      window.clearTimeout(playbackResetTimeoutRef.current);
      playbackResetTimeoutRef.current = null;
    }

    playbackTargetRef.current = 1;
  };

  useEffect(() => {
    return () => {
      if (playbackGlideTimeoutRef.current) {
        window.clearTimeout(playbackGlideTimeoutRef.current);
      }

      if (playbackResetTimeoutRef.current) {
        window.clearTimeout(playbackResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Dots Pattern Background */}
      <DotsPattern />

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Radial gradients with parallax */}
        <motion.div
          style={{ scale, opacity: 0.6 }}
          className="absolute inset-0"
        >
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(184, 150, 80, 0.15), transparent)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(144, 112, 48, 0.15), transparent)' }}
          />
        </motion.div>

        {/* Floating particles */}
        {particles.map((particle) => {
          return (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                backgroundColor: '#B89650',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 py-32 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - GIF/Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative flex justify-center"
            >
              <motion.div
                ref={trophyRef}
                className="relative w-full max-w-xl lg:max-w-2xl"
                style={{ rotate: smoothHoverRotate }}
                onMouseMove={handleTrophyMouseMove}
                onMouseLeave={handleTrophyMouseLeave}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <motion.div
                  className="relative w-full h-auto max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
                  style={{ x: hoverDepthX, scale: hoverDepthScale, filter: hoverDepthFilter }}
                  animate={{
                    y: [0, -14, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <InteractiveTrophyGif
                    src={effieGif}
                    alt="Effie Award Trophy"
                    className="w-full h-auto"
                    playbackTargetRef={playbackTargetRef}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right side - Text Content */}
            <div className="space-y-8">
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#333333',
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#B89650' }} />
                <span className="text-sm" style={{ color: '#999999' }}>
                  Edición 2026 • Inscripciones Abiertas
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl lg:text-7xl leading-tight"
                style={{ color: '#FFFFFF', fontWeight: 450 }}
              >
                Reconociendo
                <br />
                <span 
                  style={{ 
                    background: 'linear-gradient(to right, #B89650, #907030, #B89650)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    fontWeight: 450,
                  }}
                >
                  la Efectividad en Marketing
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl"
                style={{ color: '#999999' }}
              >
                Reconocemos las ideas de marketing más efectivas que demuestran resultados 
                medibles y generan impacto real en el mercado paraguayo.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: '#B89650',
                    color: '#000000',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#B89650';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#B89650';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onClick={() => window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer')}
                >
                  <span>Postulá ahora</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              {/* Countdown - Apertura de Inscripciones */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-8 space-y-4"
              >
                <div className="text-center mb-4">
                  <p className="text-sm uppercase tracking-wider" style={{ color: '#999999' }}>
                    Apertura de Inscripciones
                  </p>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: timeLeft.days, label: 'Días' },
                    { value: timeLeft.hours, label: 'Horas' },
                    { value: timeLeft.minutes, label: 'Minutos' },
                    { value: timeLeft.seconds, label: 'Segundos' },
                  ].map((item, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all"
                        style={{ background: 'linear-gradient(to right, rgba(144, 112, 48, 0.2), rgba(184, 150, 80, 0.2))' }}
                      />
                      <div 
                        className="relative backdrop-blur-sm border rounded-2xl p-4 transition-all"
                        style={{
                          backgroundColor: '#111111',
                          borderColor: '#333333',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#B89650';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333333';
                        }}
                      >
                        <div 
                          className="text-2xl md:text-3xl font-mono"
                          style={{ color: '#B89650', fontWeight: 450 }}
                        >
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#666666' }}>
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 rounded-full flex justify-center"
          style={{ borderColor: '#333333' }}
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full mt-2"
            style={{ backgroundColor: '#B89650' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
