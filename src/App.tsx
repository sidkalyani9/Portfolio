import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HomePage } from "@/pages/HomePage";
import { CaseStudyPage } from "@/pages/CaseStudyPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="grain min-h-screen bg-bg-0 text-fg-0">
          <Preloader />
          <SiteHeader />
          <ScrollToTop />
          <main id="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}
