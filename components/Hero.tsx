"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { bubblegum, comfortaa } from "@/lib/fonts";
import { Boxes } from "./ui/background-boxes";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { LoadingScreen } from "./LoadingScreen";
import Image from "next/image";

export function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const logoBounds = logo.getBoundingClientRect();

      // Calculate distance from cursor to the center of the logo
      const logoCenterX = logoBounds.left + logoBounds.width / 2;
      const logoCenterY = logoBounds.top + logoBounds.height / 2;
      const distanceX = e.clientX - logoCenterX;
      const distanceY = e.clientY - logoCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Only apply the effect when the cursor is close to the logo
      if (distance < 300) {
        gsap.to(logo, {
          x: distanceX * 0.1, // Scale the movement for a subtle effect
          y: distanceY * 0.1,
          duration: 0.2,
          ease: "power3.out",
        });
      } else {
        // Reset logo position when cursor moves away
        gsap.to(logo, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);

    // Split and Zoom-In Animation
    const tl = gsap.timeline();
    tl.to(".left-screen", {
      x: "-100%",
      duration: 1.2,
      ease: "power3.inOut",
    })
      .to(
        ".right-screen",
        {
          x: "100%",
          duration: 1.2,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(
        heroRef.current,
        {
          scale: 1,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=0.8"
      );
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Black Split Screens */}
      <div className="fixed inset-0 z-40 flex pointer-events-none">
        <div className="left-screen bg-black w-1/2 h-full"></div>
        <div className="right-screen bg-black w-1/2 h-full"></div>
      </div>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center scale-1.5 overflow-visible"
      >
        {/* Background Boxes */}
        <Boxes className="absolute inset-0 pointer-events-auto" />

        {/* Hero Content */}
        <div className="relative z-20 text-center">
          {/* Heading */}
          <TextGenerateEffect
            className={cn(
              bubblegum.className,
              "text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white"
            )}
            words="Welcome to NatCo 2K24"
          />
          {/* Subheading */}
          <p
            className={cn(
              comfortaa.className,
              "text-center mt-2 text-2xl md:text-3xl lg:text-4xl text-neutral-300"
            )}
          >
            Hosted By Aiesec Carthage
          </p>
        </div>
      </div>

      {/* Fixed Logo */}
      <div
        ref={logoRef}
        className="fixed bottom-[-17%] right-[-13%] z-10 -rotate-30 pointer-events-none"
        style={{ opacity: 1 }}
      >
        <Image
          src="/svg-carthage.svg" // Replace with the actual path to your logo
          alt="NatCo Logo"
          width={500} // Adjust size for your logo
          height={500}
          className="object-contain invert" // The `invert` class makes the logo white
        />
      </div>
    </>
  );
}