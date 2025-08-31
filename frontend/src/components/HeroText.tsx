import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface HeroTextProps {
  text: string;
  animationDelay?: number; // delay per character in ms
  className?: string;
}

export const HeroText: React.FC<HeroTextProps> = ({
  text,
  animationDelay = 30,
  className = "",
}) => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className="inline-block"
          data-aos="fade-up"
          data-aos-delay={idx * animationDelay}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};
