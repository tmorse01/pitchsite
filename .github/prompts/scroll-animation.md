# 🎬 Co-pilot Prompt – PitchSite Share Page Animations

Add smooth, professional animations to the **PitchSite Share Page** (`/share/:deckId`) to create a "wow factor" that impresses potential investors viewing shared pitch decks.

## 🎯 Animation Goals

- **Scroll-triggered animations** that reveal content as users scroll down
- **Staggered entrance effects** for sections to create visual hierarchy
- **Smooth micro-interactions** on hover and focus states
- **Professional, business-appropriate** timing and easing
- **Performance-optimized** animations that don't impact loading
- **Responsive** animations that work on all device sizes

---

## 🛠 Implementation Approach

### 1. Animation Library Choice

Use **Framer Motion** for React-based animations:

```bash
npm install framer-motion
```

**Why Framer Motion:**

- Excellent React integration with `motion` components
- Built-in scroll-triggered animations with `useInView`
- Declarative syntax that's easy to maintain
- Optimized for performance with automatic GPU acceleration
- Responsive animation support

### 2. Current Share Page Structure

The share page currently has these main sections (animate in order):

1. **Shared Deck Header** - Slide in from top
2. **Hero Section** - Fade in with scale effect
3. **Executive Summary** - Slide in from left
4. **Investment Thesis & Deal Metrics** - Staggered slide in from right
5. **Location & Risk Factors** - Staggered slide in from bottom
6. **Location Snapshot** - Fade in with blur effect
7. **Location Map** - Slide in from left with loading animation
8. **Market Trends Chart** - Animate chart drawing + slide in container
9. **Comparable Properties** - Staggered card animations
10. **ROI Simulator** - Interactive hover animations
11. **Sponsor Information** - Slide in from right
12. **Contact Footer** - Fade in with call-to-action pulse

---

## ✨ Specific Animation Requirements

### 1. Scroll-Triggered Section Animations

**Pattern:** Each `Paper` component should animate into view when 20% visible:

```tsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
};

// Wrap Paper components with motion
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true, amount: 0.2 }}
  variants={fadeInUp}
>
  <Paper shadow="sm" p="xl" radius="md">
    {/* content */}
  </Paper>
</motion.div>;
```

### 2. Hero Section - Impressive First Impact

```tsx
const heroAnimations = {
  badge: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { delay: 0.2, type: "spring", stiffness: 260, damping: 20 },
  },
  title: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.8 },
  },
  metrics: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.6, duration: 0.6, staggerChildren: 0.1 },
  },
};
```

### 3. Staggered Grid Animations

For `SimpleGrid` components (Investment Thesis & Deal Metrics):

```tsx
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};
```

### 4. Interactive Micro-Animations

**Paper hover effects:**

```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

**Button interactions:**

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Button>Contact Sponsor</Button>
</motion.div>
```

### 5. Chart and Data Animations

**Market Trends Chart** - Animate chart drawing:

```tsx
// In MarketTrendsChart component
const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut" },
  },
};
```

**ROI Simulator** - Animate number counting:

```tsx
// Add number counting animation for financial figures
const [count, setCount] = useState(0);
const targetValue = roi.totalReturn;

useEffect(() => {
  const animation = animate(count, targetValue, {
    duration: 1.5,
    onUpdate: (value) => setCount(value),
  });
  return animation.stop;
}, [targetValue]);
```

### 6. Risk Factors List Animation

Animate each risk factor appearing one by one:

```tsx
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

<motion.div variants={listVariants} initial="hidden" animate="visible">
  {riskFactors.map((risk, index) => (
    <motion.div key={index} variants={itemVariants}>
      <Text>• {risk}</Text>
    </motion.div>
  ))}
</motion.div>;
```

---

## 🎛️ Animation Timing & Easing

### Global Animation Settings

```tsx
// Create animations.ts utility file
export const globalEasing = [0.6, -0.05, 0.01, 0.99];

export const timings = {
  fast: 0.3,
  medium: 0.6,
  slow: 0.9,
  pageLoad: 1.2,
};

export const delays = {
  section: 0.2,
  stagger: 0.1,
  hero: 0.4,
};
```

### Progressive Enhancement

Respect user preferences:

```tsx
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

const animationProps = shouldReduceMotion
  ? {}
  : {
      initial: "initial",
      whileInView: "animate",
      viewport: { once: true, amount: 0.2 },
    };
```

---

## 📱 Responsive Considerations

### Mobile-Optimized Animations

```tsx
const isMobile = window.innerWidth < 768;

const responsiveVariants = {
  initial: {
    opacity: 0,
    y: isMobile ? 30 : 60,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: isMobile ? 0.4 : 0.6,
  },
};
```

### Performance Optimization

- Use `transform` and `opacity` properties only (GPU accelerated)
- Set `will-change: transform` for animating elements
- Use `layoutId` for shared element transitions
- Enable `once: true` for scroll animations to prevent re-triggering

---

## 🚀 Implementation Priority

### Phase 1 - Core Animations (High Impact)

1. **Hero section** - Badge, title, metrics stagger
2. **Paper components** - Scroll-triggered fade-in-up
3. **Button hover states** - Scale and shadow effects

### Phase 2 - Advanced Interactions

1. **Charts** - Drawing animations for MarketTrendsChart
2. **Lists** - Staggered risk factors and comparable properties
3. **Numbers** - Counting animations in ROI simulator

### Phase 3 - Polish & Optimization

1. **Loading states** - Skeleton animations while data loads
2. **Page transitions** - Smooth enter/exit when navigating
3. **Accessibility** - Reduced motion support

---

## 🎨 Animation Examples

### Loading Skeleton

```tsx
const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: {
    repeat: Infinity,
    duration: 1.5,
    ease: "linear",
  },
};
```

### Call-to-Action Pulse

```tsx
const pulseCTA = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
  },
};
```

### Success State Animation

```tsx
// When user clicks "Contact Sponsor"
const successCheck = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: "spring", stiffness: 260, damping: 20 },
};
```

---

## 📊 Success Metrics

**User Engagement:**

- Time spent on share page increases by 25%
- Scroll depth improves (users scroll further down)
- Lower bounce rate for shared pitch decks

**Business Impact:**

- More "Contact Sponsor" button clicks
- Increased social sharing of pitch decks
- Higher perceived professionalism scores

**Technical:**

- Lighthouse performance score remains > 90
- No jank or dropped frames during animations
- Fast loading on mobile devices

---

## 🔧 File Structure

```
/src
  /components
    /animations
      AnimatedSection.tsx      # Reusable scroll-triggered wrapper
      NumberCounter.tsx        # Counting animation for financial data
      StaggeredList.tsx        # Animated list items
      LoadingSkeleton.tsx      # Loading state animations
  /utils
    animations.ts             # Global animation variants and timing
  /pages
    SharePage.tsx            # Updated with motion components
```

This animation system will transform the static share page into an engaging, professional experience that builds trust and excitement with potential investors while maintaining excellent performance and accessibility.
