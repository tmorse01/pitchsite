import { useState, useEffect, useRef } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";

interface NumberCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

// Animated number counting effect
export default function NumberCounter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  className,
  decimals = 0,
}: NumberCounterProps) {
  const [count, setCount] = useState(value);
  const previousValueRef = useRef(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const previousValue = previousValueRef.current;
    previousValueRef.current = value;

    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    // Only animate if the value has actually changed
    if (previousValue !== value) {
      const controls = animate(previousValue, value, {
        duration,
        onUpdate: (latest) => setCount(latest),
      });

      return controls.stop;
    }
  }, [value, duration, shouldReduceMotion]);
  const displayValue =
    decimals > 0
      ? count.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.floor(count).toLocaleString();

  return (
    <motion.span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
}
