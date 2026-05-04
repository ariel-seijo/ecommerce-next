"use client";

import "./Slider.css";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/slider/slider-image-1.webp",
    title: "COMPONENTES GAMING",
    subtitle: "Rendimiento extremo para tu setup",
    cta: "Ver GPU",
    href: "/category/gpu",
  },
  {
    src: "/slider/slider-image-2.webp",
    title: "NUEVA GENERACIÓN",
    subtitle: "Procesadores de última tecnología",
    cta: "Ver CPU",
    href: "/category/cpu",
  },
  {
    src: "/slider/slider-image-4.webp",
    title: "ALMACENAMIENTO SSD",
    subtitle: "Velocidad sin límites para tus datos",
    cta: "Ver Almacenamiento",
    href: "/category/storage",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  return (
    <section
      className="slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <Image
              src={slide.src}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
            />
            <div className="slide-overlay" />
            <div className="slide-content">
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <Link href={slide.href} className="slide-cta">
                {slide.cta}
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-arrow slider-arrow-left" onClick={prev}>
        <ChevronLeft size={24} />
      </button>
      <button className="slider-arrow slider-arrow-right" onClick={next}>
        <ChevronRight size={24} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <div className="slider-progress">
        <div
          className="slider-progress-bar"
          style={{ animationDuration: "6s" }}
          key={current}
        />
      </div>
    </section>
  );
}
