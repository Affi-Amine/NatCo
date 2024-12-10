
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransition from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";



const ocTeam = [
  {
    quote: "",
    name: "Zeineb Hichri",
    designation: "OCVP DXP",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "",
    name: "Mondher Hakim",
    designation: "OCVP MKT",
    src: "/oc/i2.jpg",
  },
  {
    quote: "",
    name: "Maram ben Mohamed",
    designation: "OCVP ER",
    src: "/oc/i3.jpg",
  },
  {
      quote: "",
      name: "Mahdi Mhiri",
      designation: "OCVP LOG",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "",
      name: "Mohamed nadhir Groun",
      designation: "OCP",
      src: "/oc/i5.jpg",
    },
    {
      quote: "",
      name: "Aicha Samet",
      designation: "OC DXP",
      src: "/oc/i6.jpg",
    },
    {
      quote: "",
      name: "Maram Memmi",
      designation: "OC MKT",
      src: "/oc/i7.jpg",
    },
    {
      quote: "",
      name: "Mahdi Dakhli",
      designation: "OC LOG",
      src: "/oc/i8.jpg",
    },
    {
      quote: "",
      name: "Shaima Besbes",
      designation: "OC LOG",
      src: "/oc/i9.jpg",
    },
    {
      quote: "",
      name: "Ines Hamdoun",
      designation: "OC MKT",
      src: "/oc/i10.jpg",
    },
    {
      quote: "",
      name: "Yassin Skik",
      designation: "OC DXP",
      src: "/oc/i11.jpg",
    },
    {
      quote: "",
      name: "Ahmed Frikha",
      designation: "OC ER",
      src: "/oc/i12.jpg",
    },
    {
      quote: "",
      name: "Rahma Mestiri",
      designation: "OC LOG",
      src: "/oc/i13.jpg",
    },
    {
      quote: "",
      name: "Sarah Euchi",
      designation: "OC LOG",
      src: "/oc/i14.jpg",
    },
    {
      quote: "",
      name: "Khairi Ayed",
      designation: "OC ER",
      src: "/oc/i15.jpg",
    },
    {
      quote: "",
      name: "Badis Kaouel",
      designation: "OC MKT",
      src: "/oc/i16.jpg",
    },
    {
      quote: "",
      name: "Maynaaa",
      designation: "IMPOSTER",
      src: "/oc/i17.JPG",
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
