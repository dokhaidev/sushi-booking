"use client";

import dynamic from "next/dynamic";

// Loading fallback component (có thể custom sau)
const Loading = () => (
  <div className="flex justify-center items-center h-[300px] animate-pulse text-gray-500">
    <span>Loading...</span>
  </div>
);

// Lazy load các section
const HeroSection = dynamic(() => import("@/src/app/components/HomePage/HeroSection"), {
  loading: () => <Loading />,
  ssr: false,
});

const ComboSlider = dynamic(() => import("@/src/app/components/HomePage/Combos"), {
  loading: () => <Loading />,
  ssr: false,
});

const AboutSection = dynamic(() => import("@/src/app/components/HomePage/AboutSection"), {
  loading: () => <Loading />,
  ssr: false,
});

const Menus = dynamic(() => import("@/src/app/components/HomePage/Menus"), {
  loading: () => <Loading />,
  ssr: false,
});

const MyStory = dynamic(() => import("@/src/app/components/HomePage/MyStory"), {
  loading: () => <Loading />,
  ssr: false,
});

const FavoriteSushiSection = dynamic(
  () => import("@/src/app/components/HomePage/FavoriteSushiSection"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const CallToAction = dynamic(() => import("@/src/app/components/HomePage/CallToAction"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function SushiPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <HeroSection />
      <ComboSlider />
      <AboutSection />
      <Menus />
      <MyStory />
      <FavoriteSushiSection />
      <CallToAction />
    </div>
  );
}
