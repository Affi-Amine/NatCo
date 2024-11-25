"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { bubblegum } from "@/lib/fonts";
import { Boxes } from "./ui/background-boxes";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { LoadingScreen } from "./LoadingScreen";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Registering GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logo = logoRef.current;

    // Mouse move animation for the logo
    const handleMouseMove = (e: MouseEvent) => {
      if (!logo) return;

      const logoBounds = logo.getBoundingClientRect();
      const logoCenterX = logoBounds.left + logoBounds.width / 2;
      const logoCenterY = logoBounds.top + logoBounds.height / 2;
      const distanceX = e.clientX - logoCenterX;
      const distanceY = e.clientY - logoCenterY;

      gsap.to(logo, {
        x: distanceX * 0.1,
        y: distanceY * 0.1,
        duration: 0.2,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);

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
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div className="fixed inset-0 z-40 flex pointer-events-none">
        <div className="left-screen bg-black w-1/2 h-full"></div>
        <div className="right-screen bg-black w-1/2 h-full"></div>
      </div>

      <div
        ref={heroRef}
        className="relative min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Contain the grid strictly within the hero */}
        <div className="absolute inset-0">
          <Boxes className="w-full h-full" />
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center">
          <TextGenerateEffect
            className={cn(
              bubblegum.className,
              "text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white"
            )}
            words="Welcome to NatCo 2K24"
          />
          <p
            className={cn(
              poppins.className,
              "text-center mt-2 text-2xl md:text-3xl lg:text-4xl text-white"
            )}
          >
            Hosted By Aiesec Carthage
          </p>
          {/* Add PNG Slogan Below */}
          <div className="mt-4">
            <Image
              src="/logo/slogan.png" // Update with the correct path
              alt="NatCo Slogan"
              width={300} // Adjust width as needed
              height={100} // Adjust height as needed
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <div
        ref={logoRef}
        className="fixed bottom-[-17%] right-[-13%] z-10 -rotate-30 pointer-events-none"
        style={{ opacity: 1 }}
      >
        <Image
          src="/svg-carthage.svg"
          alt="NatCo Logo"
          width={500}
          height={500}
          className="object-contain invert"
        />
      </div>
    </>
  );
}