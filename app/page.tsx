
import Definition from "@/components/Definition";
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
    </div>
  );
}
