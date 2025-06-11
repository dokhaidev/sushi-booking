"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import MenuHeader from "../../../components/MenuPage/MenuHeader";
import AppetizersSection from "../../../components/MenuPage/sections/appertizerSection";
import SushiSection from "../../../components/MenuPage/sections/sushiSection";
import SashimiSection from "../../../components/MenuPage/sections/sashimiSection";
import RollsSection from "../../../components/MenuPage/sections/rollSection";
import RiceNoodlesSection from "../../../components/MenuPage/sections/rice-noodleSection";
import DrinksSection from "../../../components/MenuPage/sections/drinkSection";
import DietaryInfo from "../../../components/MenuPage/DietaryInfo";
import { MenuItem } from "../../../types/menu";
import Banner from "@/src/app/components/MenuPage/Banner";

export default function MenuPage() {
  const [products, setProducts] = useState<MenuItem[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/food/category/1")
      .then((res) => setProducts(res.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Banner />
      <MenuHeader />
      <AppetizersSection />
      <SushiSection />
      <SashimiSection />
      <RollsSection />
      <RiceNoodlesSection />
      <DrinksSection />
      <DietaryInfo />
    </div>
  );
}
