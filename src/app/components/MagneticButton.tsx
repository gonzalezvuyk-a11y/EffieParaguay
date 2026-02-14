import { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export function MagneticButton({ children, className = '', onClick, href, type = 'button', style }: MagneticButtonProps) {
  const content = (
    <motion.div
      className={className}
      style={style}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={(e) => {
        const element = e.currentTarget as HTMLElement;
        element.style.backgroundColor = '#000000';
        element.style.color = '#B89650';
      }}
      onMouseLeave={(e) => {
        const element = e.currentTarget as HTMLElement;
        element.style.backgroundColor = '#B89650';
        element.style.color = '#000000';
      }}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  if (type === 'submit') {
    return <button type="submit">{content}</button>;
  }

  return content;
}