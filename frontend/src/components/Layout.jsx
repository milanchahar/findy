import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import AnimatedCursor from 'react-animated-cursor';
import Navbar from './Navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Layout = ({ children }) => {
  useLayoutEffect(() => {
    // Initialize GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // GSAP ScrollTrigger is now registered and ready to use
      // You can add GSAP animations here that use ScrollTrigger
    });

    // Initialize Lenis smooth scroll (separate from GSAP context)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Update ScrollTrigger on Lenis scroll
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      // Revert GSAP context (cleans up all ScrollTriggers)
      ctx.revert();
      // Destroy Lenis
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Custom Animated Cursor */}
      <AnimatedCursor
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={2}
        outerAlpha={0}
        innerStyle={{
          backgroundColor: '#ffffff',
        }}
        outerStyle={{
          border: '2px solid #ffffff',
          backgroundColor: 'transparent',
        }}
        clickables={[
          'a',
          'button',
          '.clickable',
          {
            target: '.cursor-pointer',
            options: {
              innerSize: 12,
              outerSize: 40,
              color: '#000000',
              outerAlpha: 0.3,
              innerScale: 1.2,
              outerScale: 2.5,
            },
          },
        ]}
      />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Page content */}
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
};

export default Layout;
