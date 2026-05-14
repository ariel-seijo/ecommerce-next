"use client";

import dynamic from "next/dynamic";
import CarouselSkeleton from "./CarouselSkeleton";

const FeaturedCarousel = dynamic(
  () => import("./FeaturedCarousel"),
  {
    ssr: false,
    loading: () => <CarouselSkeleton />,
  }
);

export default function FeaturedCarouselDynamic(props) {
  return <FeaturedCarousel {...props} />;
}
