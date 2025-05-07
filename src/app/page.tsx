"use client";

import HeroSection from "../components/HomePage/HeroSection";
import MenuSection from "../components/HomePage/MenuSection";
import StorySection from "../components/HomePage/StorySection";
import ReservationSection from "../components/HomePage/ReservationSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MenuSection />
      <StorySection />
      <ReservationSection />
    </>
  );
}
