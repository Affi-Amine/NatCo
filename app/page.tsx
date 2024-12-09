
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransition from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";



const ocTeam = [
  {
    quote: "",
    name: "Zoubaa",
    designation: "OCVP DXP",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "",
    name: "Momo",
    designation: "OCVP MKT",
    src: "/oc/i2.jpg",
  },
  {
    quote: "",
    name: "Marroum",
    designation: "OCVP ER",
    src: "/oc/i3.jpg",
  },
  {
      quote: "",
      name: "Chamchoun",
      designation: "OCVP LOG",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "",
      name: "Grouun",
      designation: "OCP",
      src: "/oc/i5.jpg",
    },
    {
      quote: "",
      name: "Franko",
      designation: "OC DXP",
      src: "/oc/i6.jpg",
    },
    {
      quote: "",
      name: "Mrm",
      designation: "OC MKT",
      src: "/oc/i7.jpg",
    },
    {
      quote: "",
      name: "Las Vegas",
      designation: "OC LOG",
      src: "/oc/i8.jpg",
    },
    {
      quote: "",
      name: "Lfrezz",
      designation: "OC LOG",
      src: "/oc/i9.jpg",
    },
    {
      quote: "",
      name: "Noussa",
      designation: "OC LOG",
      src: "/oc/i10.jpg",
    },
    {
      quote: "",
      name: "Skik",
      designation: "OC LOG",
      src: "/oc/i11.jpg",
    },
    {
      quote: "",
      name: "Bouhmid",
      designation: "OC LOG",
      src: "/oc/i12.jpg",
    },
    {
      quote: "",
      name: "Rahmoucha",
      designation: "OC LOG",
      src: "/oc/i13.jpg",
    },
    {
      quote: "",
      name: "Sassou",
      designation: "OC LOG",
      src: "/oc/i14.jpg",
    },
    {
      quote: "",
      name: "Khnesiano",
      designation: "OC LOG",
      src: "/oc/i15.jpg",
    },
    {
      quote: "",
      name: "Maynaaa",
      designation: "IMPOSTER",
      src: "/oc/i16.JPG",
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
