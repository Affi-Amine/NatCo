'use client'

import React, { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";


export default function Footer(): JSX.Element {
    const container = useRef<HTMLDivElement | null>(null);
    const paths = useRef<(SVGTextPathElement | null)[]>([]);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"],
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (value) => {
            paths.current.forEach((path, i) => {
                if (path) {
                    path.setAttribute(
                        "startOffset",
                        `${-40 + i * 40 + value * 40}%`
                    );
                }
            });
        });

        return () => {
            unsubscribe(); // Cleanup scroll event listener
        };
    }, [scrollYProgress]);

    return (
        <div ref={container}>
            <svg className="w-full mb-20" viewBox="0 0 250 90">
                <path
                    fill="none"
                    id="curve"
                    d="m0,88.5c61.37,0,61.5-68,126.5-68,58,0,51,68,123,68"
                />
                <text
                    className="text-[6px] uppercase"
                    style={{
                        fill: "#87EEAB",
                        fontFamily: "Main, sans-serif", // Inline style
                    }}
                >
                    {[...Array(3)].map((_, i) => (
                        <textPath
                            key={i}
                            ref={(ref) => {
                                paths.current[i] = ref; // Assign ref to paths array
                            }}
                            startOffset={`${i * 40}%`}
                            href="#curve"
                        >
                            Can&apos;t wait for you to join us!
                        </textPath>
                    ))}
                </text>
            </svg>
        </div>
    );
}
