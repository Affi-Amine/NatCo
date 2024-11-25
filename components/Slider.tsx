'use client';

import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image";
import styles from "./Slider.module.css";
import { bubblegum } from "@/lib/fonts";

// Registering GSAP CustomEase plugin
gsap.registerPlugin(CustomEase);

export default function Slider(): JSX.Element {
    useEffect(() => {
        CustomEase.create("cubic", "0.83, 0, 0.17, 1");
        let isAnimating = false;

        function splitTextIntoSpans(selector: string): void {
            const elements = document.querySelectorAll<HTMLElement>(selector);
            elements.forEach((element) => {
                const text = element.innerText;
                const splitText = text
                    .split("")
                    .map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`)
                    .join("");
                element.innerHTML = splitText;
            });
        }

        function initializeCards(): void {
            const cards = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.card}`));
            gsap.to(cards, {
                y: (i: number) => -15 + 15 * i + "%",
                z: (i: number) => 15 * i,
                duration: 1,
                ease: "cubic",
                stagger: -0.1,
            });
        }

        function handleAnimation(): void {
            if (isAnimating) return;
            isAnimating = true;

            const slider = document.querySelector<HTMLElement>(`.${styles.slider}`);
            if (!slider) return;

            const cards = Array.from(slider.querySelectorAll<HTMLElement>(`.${styles.card}`));
            const lastCard = cards.pop();
            const nextCard = cards[cards.length - 1];

            if (!lastCard || !nextCard) return;

            gsap.to(lastCard.querySelectorAll<HTMLElement>("h1 span"), {
                y: 200,
                duration: 0.75,
                ease: "cubic",
            });

            gsap.to(lastCard, {
                y: "+=150%",
                duration: 0.75,
                ease: "cubic",
                onComplete: () => {
                    slider.prepend(lastCard);
                    initializeCards();
                    gsap.set(lastCard.querySelectorAll<HTMLElement>("h1 span"), { y: -200 });

                    setTimeout(() => {
                        isAnimating = false;
                    }, 1000);
                },
            });

            gsap.to(nextCard.querySelectorAll<HTMLElement>("h1 span"), {
                y: 0,
                duration: 0.75,
                ease: "cubic",
                stagger: 0.05,
            });
        }

        splitTextIntoSpans(`.${styles.copy} h1`);
        initializeCards();

        gsap.set(`h1 span`, { y: -200 });
        gsap.set(`.${styles.slider} .${styles.card}:last-child h1 span`, { y: 0 });

        document.addEventListener("click", handleAnimation);

        return () => {
            document.removeEventListener("click", handleAnimation);
        };
    }, []);

    return (
        <div>
            <h2
                className={`heading ${bubblegum.className} text-6xl md:text-7xl text-center mb-12 text-[#C3B5FD]`}
            >
                What You&apos;ll Experience
            </h2>
            <div className={styles.container}>
                <div className={styles.slider}>
                    <div className={styles.card}>
                        <Image
                            src="/assets/i4.jpg"
                            alt="Image 4"
                            layout="fill"
                            objectFit="cover"
                            quality={100} // Optimized image quality
                        />
                        <div className={styles.copy}>
                            <h1>OC Party</h1>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/slider/mcpElection.png"
                            alt="Image 1"
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>MCP Election</h1>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/slider/careerFair.png"
                            alt="Image 2"
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>Career Fair</h1>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/slider/galaNight.png"
                            alt="Image 3"
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>Gala Night</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}