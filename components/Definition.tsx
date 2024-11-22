"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bubblegum } from "@/lib/fonts";
import { Poppins } from 'next/font/google';

  const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500'], 
    display: 'swap',
  });

gsap.registerPlugin(ScrollTrigger);

const Definition = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // Enhanced Heading Animation with Delay
    gsap.fromTo(
      ".heading",
      {
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotate: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 2,
        delay: 2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 40%",
          scrub: 1,
        },
      }
    );

    // Enhanced Paragraphs Animation with Delay
    gsap.fromTo(
      ".paragraph",
      {
        opacity: 0,
        y: 150,
        rotateX: 90,
        skewX: 10,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        skewX: 0,
        duration: 2,
        delay: 0.7,
        stagger: 0.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );

    // Decorative Line Animation with Delay
    gsap.fromTo(
      ".decorative-line",
      { scaleX: 0, rotate: -15, backgroundColor: "#FFD6CE" },
      {
        scaleX: 1,
        rotate: 0,
        backgroundColor: "#FFC107",
        duration: 2,
        delay: 0.5,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: ".decorative-line",
          start: "top 90%",
          end: "top 60%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen px-8 py-16 flex flex-col justify-center items-center relative"
      style={{ marginTop: "-5vh" }} // Slightly reduce overlap
    >
      <h2
        className={`heading ${bubblegum.className} text-6xl md:text-7xl text-center mb-6 text-[#FCA5A5]`}
      >
        What is NatCo
      </h2>
      <div className="max-w-4xl text-center">
        <p
          className={`paragraph text-lg md:text-xl lg:text-2xl mb-4 ${poppins.className}`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet nam,
          minima tempora culpa accusamus eum, quas repellendus voluptatum, odio
          quam libero voluptates totam quia obcaecati ratione. Suscipit adipisci
          commodi possimus!
        </p>
        <p
          className={`paragraph text-lg md:text-xl lg:text-2xl mb-4 ${poppins.className}`}
        >
          Hosted in the heart of Egypt, the MEA Summit is your chance to embrace
          cultural diversity and make connections that transcend borders.
        </p>
      </div>
      <div className="decorative-line h-1 w-32 bg-yellow-400 mx-auto mb-6"></div>
    </section>
  );
};

export default Definition;