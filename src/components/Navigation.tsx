import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import logo from "@/assets/logo-new.jpg";

interface NavigationProps {
  onBookNow: () => void;
}

const Navigation = ({ onBookNow }: NavigationProps) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > window.innerHeight); // Solo activar fondo sólido cuando pasamos la intro completa
  });

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo removed as requested */}
        <div className="flex items-center gap-3">
          {/* Empty div to maintain spacing or for future use */}
        </div>

        <div className="hidden items-center gap-8 md:flex mix-blend-difference">
          {["Hunts", "About", "Contact"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-xs uppercase tracking-widest text-white transition-colors hover:text-primary"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <button
          onClick={onBookNow}
          className={`border px-4 py-2 font-body text-xs uppercase tracking-widest transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${
              scrolled ? "border-primary/50 text-primary" : "border-white/50 text-white hover:border-primary mix-blend-difference"
          }`}
        >
          Book Now
        </button>
      </div>
    </motion.nav>
  );
};

export default Navigation;
