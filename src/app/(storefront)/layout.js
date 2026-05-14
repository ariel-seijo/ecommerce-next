import { Suspense } from "react";
import ScrollToTop from "./ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        {children}
      </main>

      <Footer />
    </>
  );
}
