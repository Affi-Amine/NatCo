"use client"; // Enable client-side rendering
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ImageTransition = () => {
    const imageRef = useRef(null); // Reference to the image container

    useEffect(() => {
        const image = imageRef.current;

        // Apply parallax effect to the image
        gsap.to(image, {
            yPercent: -30, // Move the image up slightly as you scroll
            scale: 1.2, // Slight zoom for depth
            ease: "none",
            scrollTrigger: {
                trigger: image,
                start: "top bottom", // Start when the top of the image enters the viewport
                end: "bottom top", // End when the bottom of the image leaves the viewport
                scrub: true, // Smooth scrubbing effect
            },
        });
    }, []);

    return (
        <section
            style={{
                position: "relative",
                height: "100vh", // Full viewport height
                overflow: "hidden", // Prevent scrollbars for overflowing content
            }}
        >
            {/* Parallax Image */}
            <Image
                ref={imageRef}
                src="/tulds1.jpg" // Make sure the image path starts with '/' for Next.js public assets
                alt="Dynamic Parallax"
                layout="fill" // This ensures the image covers the container
                objectFit="cover" // Ensures the image fits the container
                style={{
                    position: "absolute", // Required for parallax effect
                    top: 0,
                    left: 0,
                    willChange: "transform", // Optimize performance for transforms
                }}
            />
        </section>
    );
};

export default ImageTransition;