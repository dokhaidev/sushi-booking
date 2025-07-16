"use client";

import HeroSection from "../../../components/HomePage/HeroSection";
import AboutSection from "../../../components/HomePage/AboutSection";
import CallToAction from "../../../components/HomePage/CallToAction";
import MyStory from "../../../components/HomePage/MyStory";
import Menus from "../../../components/HomePage/Menus";
import FavoriteSushiSection from "../../../components/HomePage/FavoriteSushiSection";
import ComboSlider from "../../../components/HomePage/Combos";

export default function SushiPage() {
  return (
    <div className=" min-h-screen bg-[#FFF9F0]">
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
