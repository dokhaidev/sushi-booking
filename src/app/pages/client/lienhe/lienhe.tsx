import ContactHero from "../../../components/ContactPage/ContactHero";
import ContactInfo from "../../../components/ContactPage/ContactInfo";
import ContactMap from "../../../components/ContactPage/ContactMap";
import UserReviews from "../../../components/ContactPage/UserReviews";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactInfo />
      <ContactMap />
      <UserReviews />
    </main>
  );
}
