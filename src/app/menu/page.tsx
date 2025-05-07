import MenuHeader from "../../components/MenuPage/MenuHeader";
import SpecialTabs from "../../components/MenuPage/SpecialTabs";
import ChefSpecial from "../../components/MenuPage/ChefSpecial";
import CategorySection from "../../components/MenuPage/CategorySection";

export default function MenuPage() {
  return (
    <main className="bg-[#FFF9F3] text-[#3D2B1F]">
      <MenuHeader />
      <SpecialTabs />
      <ChefSpecial />
      <CategorySection />
    </main>
  );
}
