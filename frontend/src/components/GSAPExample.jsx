import { useRef } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Example component showing how to use GSAP with ScrollTrigger
 * This demonstrates proper React integration with cleanup
 */
const GSAPExample = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  // Use the custom hook for GSAP animations
  useGSAP(() => {
    // Animation for title
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Stagger animation for cards
    if (cardRefs.current.length > 0) {
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, []); // Empty deps = runs once on mount

  return (
    <section ref={sectionRef} className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="text-4xl font-black mb-8">
          GSAP ScrollTrigger Example
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((item, index) => (
            <div
              key={item}
              ref={(el) => (cardRefs.current[index] = el)}
              className="h-32 bg-white/5 border border-white/10 p-4"
            >
              Card {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GSAPExample;
