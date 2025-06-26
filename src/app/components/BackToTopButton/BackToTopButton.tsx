"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    // Throttle scroll event for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500/20 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Back to top button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.8,
              transition: { duration: 0.2 },
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "#047BA0",
              boxShadow: "0 5px 15px rgba(4, 123, 160, 0.4)",
            }}
            whileTap={{
              scale: 0.95,
              boxShadow: "0 2px 5px rgba(4, 123, 160, 0.4)",
            }}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg
                      bg-gradient-to-br from-[#0689C4] to-[#047BA0]
                      text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Back to top"
          >
            <motion.div
              animate={{
                y: [0, -3, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
