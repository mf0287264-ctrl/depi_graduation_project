import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — triggers a one-time reveal when the element scrolls into view.
 *
 * @param {Object}  options
 * @param {number}  [options.threshold=0.15]  Fraction of the element visible before triggering.
 * @param {string}  [options.rootMargin='0px'] IntersectionObserver rootMargin (e.g. '0px 0px -50px 0px').
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export default function useScrollReveal({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip observation if the user prefers reduced motion — reveal immediately.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // trigger once only
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
