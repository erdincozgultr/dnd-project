import React from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import PageContent from "./layout/PageContent";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-display bg-mbg text-mtf">
      <Header />

      <main className="flex-grow">
        <PageContent />
      </main>

      <Footer />
    </div>
  );
}

export default App;
