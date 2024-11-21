
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransitionSection from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { div } from "framer-motion/client";
import Image from "next/image";

const ocTeam = [
  {
    quote: "This is an amazing experience! Highly recommended.",
    name: "John Doe",
    designation: "Software Engineer",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "I loved the service, and the team was incredible!",
    name: "Jane Smith",
    designation: "Product Manager",
    src: "/oc/i2.jpg",
  },
  {
    quote: "Exceptional quality and attention to detail.",
    name: "Alice Johnson",
    designation: "Designer",
    src: "/oc/i3.jpg",
  },
  {
      quote: "This is an amazing experience! Highly recommended.",
      name: "John Doe",
      designation: "Software Engineer",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "I loved the service, and the team was incredible!",
      name: "Jane Smith",
      designation: "Product Manager",
      src: "/oc/i5.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Alice Johnson",
      designation: "Designer",
      src: "/oc/i6.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Alice Johnson",
      designation: "Designer",
      src: "/oc/i7.jpg",
    },
];


export default function Home() {
  return (
    <div>
      <Hero />
      
      <Definition />
      <Slider />
      <AnimatedTestimonials testimonials={ocTeam} autoplay={true} />
      <Footer />
    </div>
  );
}
