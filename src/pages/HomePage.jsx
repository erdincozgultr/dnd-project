// src/pages/HomePage.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import CallToActionSection from "../components/home/CallToActionSection";
import CommunitySection from "../components/home/CommunitySection";
import HeroCarousel from "../components/home/HeroCarousel";
import HowToPlaySection from "../components/home/HowToPlaySection";
import PartyFinderSection from "../components/home/PartyFinderSection";
import WikiSection from "../components/home/WikiSection";
import LeaderboardSection from "../components/home/LeaderboardSection";
import GuildShowcaseSection from "../components/home/GuildShowcaseSection";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Ana Sayfa | Zar & Kule</title>
        <meta
          name="description"
          content="Türkiye'nin en büyük D&D ve masa üstü rol yapma oyunları topluluğu. Oyuncu bul, homebrew paylaş, bilgi kazan."
        />
      </Helmet>

      {/* Hero Section - KOYU */}
      <HeroCarousel />

      {/* Party Finder - KOYU (bg-mbg) */}
      <PartyFinderSection />

      {/* Wiki Section - KOYU (bg-pb) */}
      <WikiSection />

      {/* Guild Showcase - AÇIK (gradient purple-pink)
      <GuildShowcaseSection />

      {/* Leaderboard - KOYU (bg-mbg) */}
      {/* <LeaderboardSection />  */}

      {/* How To Play - KOYU */}
      <HowToPlaySection />

      {/* Community - KOYU */}
      <CommunitySection />

      {/* CTA - KOYU */}
      <CallToActionSection />
    </div>
  );
};

export default HomePage;
