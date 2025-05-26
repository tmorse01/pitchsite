import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { paperHover } from "../../utils/animations";
import AnimatedSection from "../animations/AnimatedSection";

interface AnimatedWrapperProps {
  children: ReactNode;
  animated?: boolean;
  delay?: number;
  withHover?: boolean;
  className?: string;
}

export default function AnimatedWrapper({
  children,
  animated = false,
  delay = 0,
  withHover = false,
  className,
}: AnimatedWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (animated && !shouldReduceMotion) {
    if (withHover) {
      return (
        <AnimatedSection delay={delay} className={className}>
          <motion.div {...paperHover}>{children}</motion.div>
        </AnimatedSection>
      );
    }
    return (
      <AnimatedSection delay={delay} className={className}>
        {children}
      </AnimatedSection>
    );
  }

  return <div className={className}>{children}</div>;
}
