'use client'

import { useEffect } from 'react';
import Matter, { Engine, World, Bodies, Body } from 'matter-js';
import styles from './Vintage.module.css';

const VintageGallery = () => {
  useEffect(() => {
    // Save original styles to restore later
    const originalBodyStyles = {
      overflow: document.body.style.overflow,
      width: document.body.style.width,
      height: document.body.style.height,
    };

    const originalHtmlStyles = {
      overflow: document.documentElement.style.overflow,
      width: document.documentElement.style.width,
      height: document.documentElement.style.height,
    };

    // Apply styles to restrict size and prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.width = '100vw';
    document.documentElement.style.height = '100vh';

    let engine: Matter.Engine;
    let items: Item[] = [];
    let lastMouseX = -1;
    let lastMouseY = -1;

    const setup = () => {
      const canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      engine = Engine.create();
      engine.world.gravity.y = 0.1;

      addBoundaries();

      for (let i = 0; i < 12; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        items.push(new Item(x, y, `/assets/i${i + 1}.jpg`));
      }

      const draw = () => {
        Engine.update(engine);
        items.forEach((item) => item.update());
        requestAnimationFrame(draw);
      };
      draw();
    };

    const addBoundaries = () => {
        const thickness = 50; // Thickness of the boundary walls
      
        // Add boundaries (top, bottom, left, right)
        World.add(engine.world, [
          Bodies.rectangle(window.innerWidth / 2, -thickness / 2, window.innerWidth, thickness, { isStatic: true }), // Top
          Bodies.rectangle(window.innerWidth / 2, window.innerHeight + thickness / 2, window.innerWidth, thickness, { isStatic: true }), // Bottom
          Bodies.rectangle(-thickness / 2, window.innerHeight / 2, thickness, window.innerHeight, { isStatic: true }), // Left
          Bodies.rectangle(window.innerWidth + thickness / 2, window.innerHeight / 2, thickness, window.innerHeight, { isStatic: true }), // Right
        ]);
      };

    class Item {
      body: Matter.Body;
      div: HTMLDivElement;

      constructor(x: number, y: number, imagePath: string) {
        const options: Matter.IBodyDefinition = {
          frictionAir: 0.075,
          restitution: 0.25,
          density: 0.002,
          angle: Math.random() * Math.PI * 2,
        };

        this.body = Bodies.rectangle(x, y, 100, 200, options);
        World.add(engine.world, this.body);

        this.div = document.createElement('div');
        this.div.className = styles.item;

        const img = document.createElement('img');
        img.src = imagePath;
        this.div.appendChild(img);
        document.body.appendChild(this.div);
      }

      update() {
        this.div.style.left = `${this.body.position.x - 50}px`;
        this.div.style.top = `${this.body.position.y - 100}px`;
        this.div.style.transform = `rotate(${this.body.angle}rad)`;
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        items.forEach((item) => {
          if (dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150) {
            const forceMagnitude = 3;
            Body.applyForce(item.body, { x: item.body.position.x, y: item.body.position.y }, {
              x: random(-forceMagnitude, forceMagnitude),
              y: random(-forceMagnitude, forceMagnitude),
            });
          }
        });
      }
    };

    const dist = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    setup();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Restore original styles
      document.body.style.overflow = originalBodyStyles.overflow;
      document.body.style.width = originalBodyStyles.width;
      document.body.style.height = originalBodyStyles.height;

      document.documentElement.style.overflow = originalHtmlStyles.overflow;
      document.documentElement.style.width = originalHtmlStyles.width;
      document.documentElement.style.height = originalHtmlStyles.height;

      window.removeEventListener('mousemove', handleMouseMove);
      document.body.innerHTML = ''; // Cleanup on unmount.
    };
  }, []);

  return (
    <div className={styles.header}>
      <h1>AIESEC Is People.</h1>
    </div>
  );
};

export default VintageGallery;