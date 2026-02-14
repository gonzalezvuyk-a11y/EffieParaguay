import { motion } from 'motion/react';

export function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      {/* Static gradient line */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.3), transparent)',
        }}
      />

      {/* Animated shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(184, 150, 80, 0.8), transparent)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}
