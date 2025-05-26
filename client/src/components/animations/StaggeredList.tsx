import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "../../utils/animations";

interface StaggeredListProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: (item: any, index: number) => ReactNode;
  className?: string;
}

// Animated list with staggered entrance
export default function StaggeredList({
  children,
  items,
  renderItem,
  className,
}: StaggeredListProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: "initial",
        whileInView: "animate",
        viewport: { once: true, amount: 0.2 },
        variants: staggerContainer,
      };

  return (
    <motion.div {...animationProps} className={className}>
      {children}
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={shouldReduceMotion ? {} : staggerItem}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
