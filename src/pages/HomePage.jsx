import CallToActionSection from "../components/home/CallToActionSection";
import CommunitySection from "../components/home/CommunitySection";
import HeroCarousel from "../components/home/HeroCarousel";
import HowToPlaySection from "../components/home/HowToPlaySection";
import PartyFinderSection from "../components/home/PartyFinderSection";
import WikiSection from "../components/home/WikiSection";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-16">
      <HeroCarousel />
      <PartyFinderSection />
      <WikiSection/>
      <HowToPlaySection/>
      <CommunitySection/>
      <CallToActionSection/>
    </div>
  );
};
export default HomePage;
