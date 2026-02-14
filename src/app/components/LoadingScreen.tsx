import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.8, duration: 0.5 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(144, 112, 48, 0.15), transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(184, 150, 80, 0.15), transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(144, 112, 48, 0.15), transparent 70%)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #907030, #B89650)' }}
          >
            <Award className="w-12 h-12" style={{ color: '#000000' }} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.h1
            className="text-3xl md:text-4xl mb-2"
            style={{
              background: 'linear-gradient(to right, #B89650, #D4AF6A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Effie Awards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm uppercase tracking-wider"
            style={{ color: '#999' }}
          >
            Paraguay
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
          className="h-1 rounded-full"
          style={{ background: 'linear-gradient(to right, #907030, #B89650)' }}
        />
      </div>
    </motion.div>
  );
}