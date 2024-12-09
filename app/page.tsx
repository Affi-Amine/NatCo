
import Definition from "@/components/Definition";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import ImageTransition from "@/components/ImageTransition";
import Slider from "@/components/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";



const ocTeam = [
  {
    quote: "Sbou3iya",
    name: "Zoubaa",
    designation: "OCVP DXP",
    src: "/oc/i1.jpg", 
  },
  {
    quote: "Yadhhek  wakteli ybda fi mochkla ",
    name: "Momo",
    designation: "OCVP MKT",
    src: "/oc/i2.jpg",
  },
  {
    quote: "Tkolha salem tebki ",
    name: "Marroum",
    designation: "OCVP ER",
    src: "/oc/i3.jpg",
  },
  {
      quote: "Tkollou salem ikolik guarmesh excellence",
      name: "Chamchoun",
      designation: "OCVP LOG",
      src: "/oc/i4.jpg", 
    },
    {
      quote: "He can name every country in the world from its flag",
      name: "Grouun",
      designation: "OCP",
      src: "/oc/i5.jpg",
    },
    {
      quote: "Matfrjtch fi spacetoon fi sghorha",
      name: "Franko",
      designation: "OC DXP",
      src: "/oc/i6.jpg",
    },
    {
      quote: "John cina ytaba3 fiha aal twitter",
      name: "Mrm",
      designation: "OC MKT",
      src: "/oc/i7.jpg",
    },
    {
      quote: "Ynajem yachta7 w Houwa reked",
      name: "Las Vegas",
      designation: "OC LOG",
      src: "/oc/i8.jpg",
    },
    {
      quote: "Tfunctionni menghir noum",
      name: "Lfrezz",
      designation: "OC LOG",
      src: "/oc/i9.jpg",
    },
    {
      quote: "Nablia w mateklch  l har ",
      name: "Noussa",
      designation: "OC LOG",
      src: "/oc/i10.jpg",
    },
    {
      quote: "Yahki  w houwa  reked",
      name: "Skik",
      designation: "OC LOG",
      src: "/oc/i11.jpg",
    },
    {
      quote: "No9tot dho3fou l warda eli nahki aleha",
      name: "Bouhmid",
      designation: "OC LOG",
      src: "/oc/i12.jpg",
    },
    {
      quote: "Aadi tadhreb w hiya re9da ",
      name: "Rahmoucha",
      designation: "OC LOG",
      src: "/oc/i13.jpg",
    },
    {
      quote: "Dima tadhhek fi ay situation",
      name: "Sassou",
      designation: "OC LOG",
      src: "/oc/i14.jpg",
    },
    {
      quote: "Yheb y3ares",
      name: "Khnesiano",
      designation: "OC LOG",
      src: "/oc/i15.jpg",
    },
    {
      quote: "Certified Red Flag",
      name: "Maynaaa",
      designation: "IMPOSTER",
      src: "/oc/i16.jpg",
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
