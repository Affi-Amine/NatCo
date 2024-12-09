'use client';

import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image"; // Import next/image for optimized images
import styles from "./Slider.module.css";
import { bubblegum } from "@/lib/fonts";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
});

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
                className={`heading ${bubblegum.className} text-6xl md:text-7xl text-center mb-1 text-[#C3B5FD]`}
            >
                What You&apos;ll Experience
            </h2>
            <div className={styles.container}>
                <div className={styles.slider}>
                    <div className={styles.card}>
                        <Image
                            src="/assets/i4.jpg"
                            alt="Image 4"
                            width={500}
                            height={300}
                            style={{ objectFit: "cover" }}
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>Village Fiesta</h1>
                            <p className={`text-white text-center ${poppins.className}`}>
                                EA Celebration of Unity in Diversity. Join us for Village Fiesta, a vibrant cultural exchange where you have the chance to represent your home states through traditional food, clothing, music, and more! Celebrate the richness of our heritage, share unique traditions, and enjoy the beauty of diversity in one unforgettable party. Oh, and let&apos;s just say... there&apos;s a special musical surprise waiting to make the night even more magical. You won&apos;t want to miss it!
                            </p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/optimImages/mcpElection.png"
                            alt="Image 1"
                            width={500}
                            height={300}
                            style={{ objectFit: "cover" }}
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>MCP Election</h1>
                            <p className={`text-white text-center ${poppins.className}`}>
                                The election of the National President is a highlight of the conference, where the future leader of AIESEC in Tunisia is chosen. This event represents leadership, vision, and a deep commitment to the organization&apos;s mission.
                            </p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/optimImages/careerFair.png"
                            alt="Image 2"
                            width={500}
                            height={300}
                            style={{ objectFit: "cover" }}
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>Career Fair</h1>
                            <p className={`text-white text-center ${poppins.className}`}>
                                Career Fair 2.0, part of AIESEC&apos;s biggest national conference in Tunisia, is the ultimate platform to connect with top companies, discover career opportunities, and sharpen your skills. With keynotes, networking, panels, and hands-on workshops, it&apos;s your chance to kickstart your future. Don&apos;t miss it!
                            </p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <Image
                            src="/optimImages/galaNight.png"
                            alt="Image 3"
                            width={500}
                            height={300}
                            style={{ objectFit: "cover" }}
                            quality={100}
                        />
                        <div className={styles.copy}>
                            <h1>Gala Night</h1>
                            <p className={`text-white text-center ${poppins.className}`}>
                                An elegant evening celebrating the achievements within the AIESEC community, providing a relaxed setting for networking and recognizing accomplishments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}