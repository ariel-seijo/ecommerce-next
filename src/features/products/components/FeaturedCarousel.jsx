"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/FeaturedCarousel.module.css";
import ProductCard from "./ProductCard";

export default function FeaturedCarousel({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const isDragging = useRef(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    emblaApi?.plugins()?.autoplay?.play();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    emblaApi?.plugins()?.autoplay?.play();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      emblaApi?.scrollTo(index);
      emblaApi?.plugins()?.autoplay?.play();
    },
    [emblaApi]
  );

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", () => setScrollSnaps(emblaApi.scrollSnapList()));
    emblaApi.on("pointerDown", () => {
      isDragging.current = false;
    });
    emblaApi.on("pointerMove", () => {
      isDragging.current = true;
    });

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleMouseEnter = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.stop();
  }, [emblaApi]);

  const handleMouseLeave = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.play();
  }, [emblaApi]);

  if (!products || products.length === 0) {
    return (
      <div className={styles.fc} role="status">
        <p className={styles["fc-empty"]}>
          No hay productos destacados en este momento.
        </p>
      </div>
    );
  }

  return (
    <section
      className={styles.fc}
      aria-roledescription="carrusel"
      aria-label="Productos destacados"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles["fc-viewport"]} ref={emblaRef}>
        <div className={styles["fc-container"]}>
          {products.map((product) => (
            <div
              className={styles["fc-slide"]}
              key={product.id}
              onClickCapture={(e) => {
                if (isDragging.current) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles["fc-arrows"]}>
        <button
          className={`${styles["fc-arrow"]} ${styles["fc-arrow--prev"]}`}
          type="button"
          onClick={scrollPrev}
          aria-label="Productos anteriores"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <button
          className={`${styles["fc-arrow"]} ${styles["fc-arrow--next"]}`}
          type="button"
          onClick={scrollNext}
          aria-label="Productos siguientes"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      <div
        className={styles["fc-dots"]}
        role="tablist"
        aria-label="Navegación del carrusel"
      >
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`${styles["fc-dot"]} ${index === selectedIndex ? styles["fc-dot--active"] : ""}`}
            type="button"
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`Ir a grupo de productos ${index + 1}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
