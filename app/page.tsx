
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransition from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";



const ocTeam = [
  {
    quote: "This is an amazing experience! Highly recommended.",
    name: "Zouba",
    designation: "OCVP DXP",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "I loved the service, and the team was incredible!",
    name: "Momo",
    designation: "OCVP MKT",
    src: "/oc/i2.jpg",
  },
  {
    quote: "Exceptional quality and attention to detail.",
    name: "Marouma",
    designation: "OCVP ER",
    src: "/oc/i3.jpg",
  },
  {
      quote: "This is an amazing experience! Highly recommended.",
      name: "Mhiriiii",
      designation: "OCVP LOG",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "I loved the service, and the team was incredible!",
      name: "Grouun",
      designation: "OCP",
      src: "/oc/i5.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Aichouuch",
      designation: "OC DXP",
      src: "/oc/i6.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Mimi",
      designation: "OC MKT",
      src: "/oc/i7.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Mahdouch",
      designation: "OC LOG",
      src: "/oc/i8.jpg",
    },
    {
      quote: "Exceptional quality and attention to detail.",
      name: "Mimi",
      designation: "OC LOG",
      src: "/oc/i9.jpg",
    },
];


export default function Home() {
  return (
    <>
      <Hero />
      <ImageTransition />
      <Definition />
      <Slider />
      <AnimatedTestimonials testimonials={ocTeam} autoplay={true} />
      <Footer />
    </>
  );
}
