"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bubblegum, comfortaa } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

const Definition = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;

        // Smooth animations for the definition section
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
                    scrub: 2,
                },
            }
        );
    }, []);

    return (
        <section
            ref={sectionRef}
            className="min-h-screen bg-[#FFD6CE] text-white px-8 py-16 flex flex-col justify-center items-center relative"
            style={{ marginTop: "-10vh" }} // Move this section up to overlap
        >
            <h2
                className={`heading ${bubblegum.className} text-5xl md:text-6xl text-center mb-12`}
            >
                What is NatCo
            </h2>
            <div className="max-w-4xl text-center">
                <p className="paragraph text-lg md:text-xl lg:text-2xl mb-8">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet nam,
                    minima tempora culpa accusamus eum, quas repellendus voluptatum, odio
                    quam libero voluptates totam quia obcaecati ratione. Suscipit adipisci
                    commodi possimus!
                </p>
                <p className="paragraph text-lg md:text-xl lg:text-2xl mb-8">
                    Hosted in the heart of Egypt, the MEA Summit is your chance to embrace
                    cultural diversity and make connections that transcend borders.
                </p>
            </div>
            <div className="decorative-line h-1 w-32 bg-yellow-400 mx-auto mb-12"></div>
        </section>
    );
};

export default Definition;