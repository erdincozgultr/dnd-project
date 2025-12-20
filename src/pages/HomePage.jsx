// src/pages/HomePage.jsx - GÜNCELLE
import CallToActionSection from "../components/home/CallToActionSection";
import CommunitySection from "../components/home/CommunitySection";
import HeroCarousel from "../components/home/HeroCarousel";
import HowToPlaySection from "../components/home/HowToPlaySection";
import PartyFinderSection from "../components/home/PartyFinderSection";
import WikiSection from "../components/home/WikiSection";
import LeaderboardSection from "../components/home/LeaderboardSection";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroCarousel />
      <PartyFinderSection />
      <WikiSection />
      <LeaderboardSection />
      <HowToPlaySection />
      <CommunitySection />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;