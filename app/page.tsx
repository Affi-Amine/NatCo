
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransitionSection from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { div } from "framer-motion/client";
import Image from "next/image";


export default function Home() {
  return (
    <div>
      <Hero />
      <ImageTransitionSection />
      <Definition />
      <Slider />
      <Footer />
    </div>
  );
}
