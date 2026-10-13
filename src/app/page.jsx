import Navbar from "@/features/landing/sections/Navbar";
import Hero from "@/features/landing/sections/Hero";
import Rooms from "@/features/landing/sections/Rooms";
import About from "@/features/landing/sections/About";
import Testimonials from "@/features/landing/sections/Testimonials";
import Gallery from "@/features/landing/sections/Gallery";
import BookingCTA from "@/features/landing/sections/BookingCTA";
import Footer from "@/features/landing/sections/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <Rooms />
      <About />
      <Testimonials />
      <Gallery />
      <BookingCTA />
      <Footer />
    </div>
  );
}
