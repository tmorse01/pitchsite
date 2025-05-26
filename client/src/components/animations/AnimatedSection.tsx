import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp } from "../../utils/animations";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Reusable animated section wrapper
export default function AnimatedSection({
  children,
  delay = 0,
  className,
}: AnimatedSectionProps) {
  const variants = {
    ...fadeInUp,
    transition: {
      ...fadeInUp.transition,
      delay,
    },
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
