import { Hero } from "@/components/Hero";
import { ExperienceIntro } from "@/components/ExperienceIntro";
import { FoodStory } from "@/components/FoodStory";
import { TourExperience } from "@/components/tour/TourExperience";
import { KaraokeRooms } from "@/components/KaraokeRooms";
import { DayToNight } from "@/components/DayToNight";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Reservation } from "@/components/Reservation";
import { LocationSection } from "@/components/LocationSection";
import { Faq } from "@/components/Faq";
import { faqSchema, jsonLd, menuSchema, restaurantSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(restaurantSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(menuSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />

      <Hero />
      <ExperienceIntro />
      <TourExperience />
      <FoodStory />
      <KaraokeRooms />
      <DayToNight />
      <Gallery />
      <Reviews />
      <Reservation />
      <LocationSection />
      <Faq />
    </>
  );
}
