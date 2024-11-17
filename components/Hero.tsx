"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { bubblegum, comfortaa } from "@/lib/fonts";
import { Boxes } from "./ui/background-boxes";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { LoadingScreen } from "./LoadingScreen";

export function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);

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
        className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center scale-1.5"
      >
        {/* Background Boxes */}
        <Boxes className="absolute inset-0 pointer-events-auto" />

        {/* Hero Content */}
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
              comfortaa.className,
              "text-center mt-2 text-2xl md:text-3xl lg:text-4xl text-neutral-300"
            )}
          >
            Hosted By Aiesec Carthage
          </p>
        </div>
      </div>
    </>
  );
}