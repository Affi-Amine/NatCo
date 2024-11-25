
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransition from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { div } from "framer-motion/client";



const ocTeam = [
  {
    quote: "This is an amazing experience! Highly recommended.",
    name: "Zabzoub",
    designation: "Software Engineer",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "I loved the service, and the team was incredible!",
    name: "Bou Rokba",
    designation: "Product Manager",
    src: "/oc/i2.jpg",
  },
  {
    quote: "Exceptional quality and attention to detail.",
    name: "Shessmou hedha Amine Affi",
    designation: "Designer",
    src: "/oc/i3.jpg",
  },
  {
      quote: "This is an amazing experience! Highly recommended.",
      name: "L'alcoliste",
      designation: "Software Engineer",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "I loved the service, and the team was incredible!",
      name: "Ija Nayk Andk Task",
      designation: "Product Manager",
      src: "/oc/i5.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Mussieur Crab",
      designation: "Designer",
      src: "/oc/i6.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Na9nou9a",
      designation: "Designer",
      src: "/oc/i7.jpg",
    },
];


export default function Home() {
  return (
    <div>
      <Hero />
      <ImageTransition />
      <Definition />
      <Slider />
      <AnimatedTestimonials testimonials={ocTeam} autoplay={true} />
      <Footer />
    </div>
  );
}
