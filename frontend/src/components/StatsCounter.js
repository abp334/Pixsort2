import React, { useState, useEffect, useRef } from "react";

const StatsCounter = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = target;
      if (start === end) return;

      const duration = 2000; // 2 seconds
      const incrementTime = duration / end;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [target, isVisible]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
        {count.toLocaleString()}+
      </p>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
        {label}
      </p>
    </div>
  );
};

// Custom hook to detect when an element is visible on screen
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isIntersecting;
};

export default StatsCounter;
