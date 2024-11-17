
import Definition from "@/components/Definition";
import { Hero } from "@/components/Hero";
import { div } from "framer-motion/client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <Definition />
    </div>
  );
}
