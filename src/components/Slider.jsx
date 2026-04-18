"use client";

import "./Slider.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  "/slider/slider-img-1.webp",
  "/slider/slider-img-2.webp",
  "/slider/slider-img-3.webp",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="slider">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((img, index) => (
          <div className="slide" key={index}>
            <Image
              src={img}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
