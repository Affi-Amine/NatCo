'use client';

import { useEffect } from 'react';
import Matter, { Engine, World, Bodies, Body } from 'matter-js';
import styles from './Vintage.module.css';

const VintageGallery = () => {
  useEffect(() => {
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
      galleryContainer.style.backgroundColor = '#047EF2';
    }

    let engine: Matter.Engine;
    const items: Item[] = [];
    let lastMouseX = -1;
    let lastMouseY = -1;

    const setup = () => {
      const canvas = document.createElement('canvas');
      galleryContainer?.appendChild(canvas);
      canvas.width = galleryContainer?.offsetWidth || window.innerWidth;
      canvas.height = galleryContainer?.offsetHeight || window.innerHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '1';

      engine = Engine.create();
      engine.world.gravity.y = 0.1;

      addBoundaries(engine, canvas);

      // Create the items
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        items.push(new Item(x, y, `/optMemories/i${i + 1}.jpg`, engine, galleryContainer));
      }

      const draw = () => {
        Engine.update(engine, 1000 / 60);
        items.forEach((item) => item.update());
        requestAnimationFrame(draw);
      };

      draw();

      // Handle resize
      const handleResize = () => {
        canvas.width = galleryContainer?.offsetWidth || window.innerWidth;
        canvas.height = galleryContainer?.offsetHeight || window.innerHeight;
        World.clear(engine.world, true);
        addBoundaries(engine, canvas);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        World.clear(engine.world, true);
        Engine.clear(engine);
        galleryContainer!.innerHTML = ''; // Cleanup
      };
    };

    const addBoundaries = (engine: Matter.Engine, canvas: HTMLCanvasElement) => {
      const thickness = 50;

      World.add(engine.world, [
        Bodies.rectangle(
          canvas.width / 2,
          -thickness / 2,
          canvas.width,
          thickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          canvas.width / 2,
          canvas.height + thickness / 2,
          canvas.width,
          thickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          -thickness / 2,
          canvas.height / 2,
          thickness,
          canvas.height,
          { isStatic: true }
        ),
        Bodies.rectangle(
          canvas.width + thickness / 2,
          canvas.height / 2,
          thickness,
          canvas.height,
          { isStatic: true }
        ),
      ]);
    };

    class Item {
      body: Matter.Body;
      div: HTMLDivElement;

      constructor(x: number, y: number, imagePath: string, engine: Matter.Engine, container: HTMLElement | null) {
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
        this.div.style.zIndex = '2';

        const img = document.createElement('img');
        img.src = imagePath;
        this.div.appendChild(img);
        container?.appendChild(this.div);
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
      window.removeEventListener('mousemove', handleMouseMove);
      galleryContainer!.innerHTML = ''; // Cleanup
    };
  }, []);

  return (
    <div id="gallery-container" className={styles.galleryContainer}></div>
  );
};

export default VintageGallery;