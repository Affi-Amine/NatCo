'use client'; // Mark this component as a client component

import { useEffect, useRef } from 'react';
import styles from './Gallery.module.css'; // CSS Module for styles
import { gsap } from 'gsap'; // Import gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register the ScrollTrigger plugin

const Gallery = () => {
    const galleryRef = useRef(null);
    const previewImageRef = useRef(null);

    useEffect(() => {
        const gallery = galleryRef.current;
        const previewImage = previewImageRef.current;

        // Create gallery items
        for (let i = 0; i < 150; i++) {
            const item = document.createElement("div");
            item.className = styles.item; // Use CSS module class
            const img = document.createElement("img");
            img.src = `/assets/i${i % 15 + 1}.jpg`; // Adjusted for public folder
            item.appendChild(img);
            gallery.appendChild(item);
        }

        const items = gallery.querySelectorAll(`.${styles.item}`);
        const numberOfItems = items.length;
        const angleIncrement = 360 / numberOfItems;

        // Set up mousemove event
        const handleMouseMove = (event) => {
            const x = event.clientX;
            const y = event.clientY;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const rotateX = 55 + percentY * 2;
            const rotateY = percentX * 2;

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

            item.addEventListener("mouseover", function () {
                const imgInsideItem = item.querySelector("img");
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

            item.addEventListener("mouseout", function () {
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
            const items = gallery.querySelectorAll(`.${styles.item}`);
            const angleIncrement = 360 / items.length;
            items.forEach((item, index) => {
                const angle = index * angleIncrement - 90;
                gsap.set(item, {
                    rotateY: 90,
                    rotateZ: angle,
                    transformOrigin: "50% 400px",
                });
            });
        }

        // Cleanup event listeners on component unmount
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            items.forEach(item => {
                item.removeEventListener("mouseover", handleMouseMove);
                item.removeEventListener("mouseout", handleMouseMove);
            });
        };
    }, []);

    return (
        <div className={ styles.container}>
            <div className={styles.previewImg}>
                <img ref={previewImageRef} src="/assets/i1.jpg" alt="Preview" />
            </div>
            <div className={styles.gallery} ref={galleryRef}></div>
        </div>
    );
};

export default Gallery;