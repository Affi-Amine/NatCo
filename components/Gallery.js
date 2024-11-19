'use client';

import { useEffect, useRef } from 'react';
import styles from './Gallery.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
    const galleryRef = useRef(null);
    const previewImageRef = useRef(null);

    useEffect(() => {
        const gallery = galleryRef.current;
        const previewImage = previewImageRef.current;

        console.log("Gallery reference:", gallery);
        console.log("Preview Image reference:", previewImage);

        if (!gallery || !previewImage) {
            console.error("Gallery or Preview Image references are null.");
            return;
        }

        for (let i = 0; i < 150; i++) {
            const item = document.createElement("div");
            item.className = styles.item;

            const img = document.createElement("img");
            img.src = `/assets/i${i % 15 + 1}.jpg`;
            img.className = styles['img-cl'];

            console.log(`Creating item ${i}, Image source: ${img.src}`);

            item.appendChild(img);
            gallery.appendChild(item);
        }

        const items = gallery.querySelectorAll(`.${styles.item}`);
        const numberOfItems = items.length;

        console.log("Number of gallery items:", numberOfItems);

        const angleIncrement = 360 / numberOfItems;

        const handleMouseMove = (event) => {
            const x = event.clientX;
            const y = event.clientY;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const rotateX = 55 + percentY * 2;
            const rotateY = percentX * 2;

            console.log(`MouseMove - rotateX: ${rotateX}, rotateY: ${rotateY}`);

            gsap.to(gallery, {
                duration: 1,
                ease: "power2.out",
                rotateX: rotateX,
                rotateY: rotateY,
                overwrite: "auto",
            });
        };

        document.addEventListener("mousemove", handleMouseMove);

        items.forEach((item, index) => {
            gsap.set(item, {
                rotateY: 90,
                rotateZ: index * angleIncrement - 90,
                transformOrigin: "50% 400px",
            });

            console.log(`Item ${index} - Initial rotation set`);

            item.addEventListener("mouseover", () => {
                const imgInsideItem = item.querySelector("img");

                console.log(`Hovering on item ${index}, updating preview image`);

                if (imgInsideItem) {
                    previewImage.src = imgInsideItem.src;
                }

                gsap.to(item, {
                    x: 10,
                    y: 10,
                    z: 50,
                    duration: 0.5,
                    ease: "power2.out",
                });
            });

            item.addEventListener("mouseout", () => {
                console.log(`Mouse out from item ${index}, resetting preview image`);

                previewImage.src = "/assets/i1.jpg";

                gsap.to(item, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.5,
                    ease: "power2.out",
                });
            });
        });

        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            onRefresh: setupRotation,
            onUpdate: (self) => {
                const rotationProgress = self.progress * 360;

                console.log(`ScrollTrigger - Progress: ${self.progress}`);

                items.forEach((item, index) => {
                    const currentAngle = index * angleIncrement - 90 + rotationProgress;

                    gsap.to(item, {
                        rotationZ: currentAngle,
                        duration: 1,
                        ease: "power3.out",
                        overwrite: "auto",
                    });
                });
            },
        });

        function setupRotation() {
            console.log("Setting up rotation for all items");
            items.forEach((item, index) => {
                const angle = index * angleIncrement - 90;
                gsap.set(item, {
                    rotateY: 90,
                    rotateZ: angle,
                    transformOrigin: "50% 400px",
                });
            });
        }

        return () => {
            console.log("Cleanup: Removing event listeners");
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.previewImg}>
                <img ref={previewImageRef} src="/assets/i1.jpg" alt="Preview" />
            </div>
            <div className={styles.gallery} ref={galleryRef}></div>
        </div>
    );
};

export default Gallery;