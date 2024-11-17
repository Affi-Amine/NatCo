"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bubblegum, comfortaa } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

const AdvancedSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // Background Parallax Effect
    gsap.to(section, {
      backgroundPosition: "50% 20%",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Heading Text Animation
    gsap.fromTo(
      ".heading",
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      }
    );

    // Paragraph Text Stagger Animation
    gsap.fromTo(
      ".paragraph",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 30%",
          scrub: true,
        },
      }
    );

    // Decorative Line Scale Animation
    gsap.fromTo(
      ".decorative-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".decorative-line",
          start: "top 90%",
          end: "top 60%",
          scrub: true,
        },
      }
    );

    // Image Reveal Effect
    gsap.fromTo(
      ".image",
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: ".image",
          start: "top 75%",
          end: "top 40%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[#0E172A] text-white px-8 py-16 flex flex-col justify-center items-center relative overflow-hidden"
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/path-to-background-image.jpg')",
          zIndex: -1,
        }}
      ></div>

      {/* Heading */}
      <h2
        className={`heading ${bubblegum.className} text-5xl md:text-6xl text-center mb-12`}
      >
        What is MEA Summit
      </h2>

      {/* Paragraphs */}
      <div className="max-w-4xl text-center">
        <p className="paragraph text-lg md:text-xl lg:text-2xl mb-8">
          The Middle East and Africa Summit is an extraordinary gathering of
          leaders, innovators, and visionaries. With over 150+ professionals
          from 55+ countries, this is your opportunity to experience the
          pinnacle of leadership and collaboration.
        </p>
        <p className="paragraph text-lg md:text-xl lg:text-2xl mb-8">
          Hosted in the heart of Egypt, the MEA Summit is your chance to embrace
          cultural diversity and make connections that transcend borders.
        </p>
      </div>

      {/* Decorative Line */}
      <div className="decorative-line h-1 w-32 bg-yellow-400 mx-auto mb-12"></div>

      {/* Image Section */}
      <div className="image w-full max-w-3xl h-80 bg-cover bg-center rounded-lg overflow-hidden shadow-lg">
        <img
          src="public/crossingAlpes.jpg"
          alt="MEA Summit"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default AdvancedSection;