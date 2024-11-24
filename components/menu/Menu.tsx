'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import gsap from 'gsap';
import { Bubblegum_Sans } from 'next/font/google';

// Load Bubblegum Sans font
const bubblegum = Bubblegum_Sans({ weight: '400', subsets: ['latin'] });

interface MenuLink {
  path: string;
  title: string;
}

const menuLinks: MenuLink[] = [
  { path: '/', title: 'Home' },
  { path: '/memories', title: 'Memories' },
  { path: '/registration', title: 'Registration' },
  { path: '/partner', title: 'Become A Partner' },
];

// Custom useIsomorphicLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const Menu: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenuAndNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault(); // Prevent immediate navigation
    if (tl.current) {
      tl.current.reverse();
      tl.current.eventCallback('onReverseComplete', () => {
        setIsMenuOpen(false); // Close the menu
        window.location.href = path; // Navigate to the new page
      });
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (!container.current) return;

    gsap.set('.menu-link-item-holder', { y: 75, opacity: 0 });

    tl.current = gsap.timeline({ paused: true })
      .to('.menu-overlay', {
        duration: 1.25, // Duration of the overlay animation
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power4.inOut',
      })
      .to(
        '.menu-link-item-holder',
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15, // Delay between each item's animation
          ease: 'power4.out',
        },
        '-=0.75' // Start this animation before the overlay animation finishes
      );
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isMenuOpen]);

  return (
    <div className="relative z-50" ref={container}>
      {/* Menu Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-8 z-10">
        {/* Logo */}
        <div className="ml-4">
          <Link href="/">
            <Image src="/logo/logoBlanc.png" alt="Natco Logo" width={150} height={50} />
          </Link>
        </div>
        {/* Menu Button */}
        <div className="cursor-pointer mr-4" onClick={toggleMenu}>
          <p className={`uppercase text-white font-medium ${bubblegum.className}`}>Menu</p>
        </div>
      </div>

      {/* Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-[#FFD804] flex flex-col justify-start p-8 ${
          isMenuOpen ? 'z-20' : 'z-[-1]'
        }`}
        style={{
          clipPath: isMenuOpen
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          transition: 'clip-path 0.4s ease-in-out',
        }}
      >
        {/* Overlay Bar */}
        <div className="flex justify-between items-center">
          <div className="ml-4">
            <Link href="/">
              <Image src="/logo/logoBlanc.png" alt="Natco Logo" width={150} height={50} />
            </Link>
          </div>
          <div className="cursor-pointer mr-4" onClick={toggleMenu}>
            <p className={`uppercase text-black font-medium ${bubblegum.className}`}>Close</p>
          </div>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col items-center gap-4 mt-20">
          {menuLinks.map((link, index) => (
            <div
              key={index}
              className={`menu-link-item-holder relative text-black text-[5vw] uppercase leading-tight ${bubblegum.className}`}
              style={{
                letterSpacing: '-0.03em',
              }}
            >
              <Link
                href={link.path}
                onClick={(e) => closeMenuAndNavigate(e, link.path)}
                className="cursor-pointer"
              >
                {link.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10 text-sm font-medium">
          {/* Left Footer */}
          <div className="flex flex-col gap-2">
            <a href="#" className="text-black uppercase">
              X &#8599;
            </a>
            <a href="#" className="text-black uppercase">
              Instagram &#8599;
            </a>
            <a href="#" className="text-black uppercase">
              Facebook &#8599;
            </a>
            <a href="#" className="text-black uppercase">
              LinkedIn &#8599;
            </a>
          </div>

          {/* Center Footer */}
          <div className="flex flex-col gap-1 text-center">
            <p className="text-black">info@natco.com</p>
            <p className="text-black">+216 28108923</p>
          </div>

          {/* Right Footer */}
          <div className="text-right">
            <p className="uppercase text-black">View Showreel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;