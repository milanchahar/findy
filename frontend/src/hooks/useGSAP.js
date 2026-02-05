import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations with ScrollTrigger
 * Properly handles cleanup to avoid memory leaks
 * 
 * @param {Function} callback - Function that receives GSAP context and refs
 * @param {Array} dependencies - Dependencies array (like useEffect)
 * 
 * @example
 * const elementRef = useRef();
 * useGSAP(() => {
 *   gsap.from(elementRef.current, {
 *     opacity: 0,
 *     y: 50,
 *     scrollTrigger: {
 *       trigger: elementRef.current,
 *       start: 'top 80%',
 *       toggleActions: 'play none none reverse'
 *     }
 *   });
 * }, []);
 */
export const useGSAP = (callback, dependencies = []) => {
  const contextRef = useRef(null);

  useLayoutEffect(() => {
    // Create GSAP context for this component
    contextRef.current = gsap.context(() => {
      if (callback) {
        callback();
      }
    });

    // Cleanup function
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies);
};

export default useGSAP;
