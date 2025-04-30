// src/components/ParticleBackground.js
import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle properties
    const particlesArray = [];
    const numberOfParticles = 120;
    let mousePosition = {
      x: null,
      y: null,
      radius: 150
    };
    
    // Define Particle class first
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.baseSize = this.size;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.2;
        this.baseOpacity = this.opacity;
      }
      
      // Generate particles with varied colors, mostly white with some blue accents
      getRandomColor() {
        const rand = Math.random();
        if (rand < 0.7) {
          return 'rgba(255, 255, 255, 0.8)';
        } else if (rand < 0.9) {
          return 'rgba(61, 90, 254, 0.8)';
        } else {
          return 'rgba(80, 210, 255, 0.8)';
        }
      }
      
      update() {
        // Basic movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse interaction - particles respond to mouse proximity
        if (mousePosition.x != null) {
          const dx = this.x - mousePosition.x;
          const dy = this.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mousePosition.radius) {
            const force = (mousePosition.radius - distance) / mousePosition.radius;
            const directionX = dx / distance || 0;
            const directionY = dy / distance || 0;
            
            // Push particles away from mouse
            this.x += directionX * force * 2;
            this.y += directionY * force * 2;
            
            // Grow particles near mouse
            this.size = this.baseSize + (force * 3);
            this.opacity = Math.min(1, this.baseOpacity + (force * 0.5));
          } else {
            // Return to original size and opacity when away from mouse
            if (this.size > this.baseSize) {
              this.size -= 0.1;
            }
            if (this.opacity > this.baseOpacity) {
              this.opacity -= 0.01;
            }
          }
        }
        
        // Boundary checks with wraparound
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
        
        if (this.y > canvas.height) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = canvas.height;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        // Reset shadow for other drawing operations
        ctx.shadowBlur = 0;
      }
    }
    
    // Initialize particles - now Particle class is defined before this function
    const init = () => {
      particlesArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle mouse move for interactive particles
    const handleMouseMove = (event) => {
      mousePosition.x = event.x;
      mousePosition.y = event.y;
    };
    
    // Handle mouse leave
    const handleMouseOut = () => {
      mousePosition.x = null;
      mousePosition.y = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    // Connect particles with dynamic lines
    const connectParticles = () => {
      const maxDistance = 120;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = 0.3 - (distance / maxDistance);
            
            // Create gradient connections with color blending
            const gradient = ctx.createLinearGradient(
              particlesArray[a].x, 
              particlesArray[a].y, 
              particlesArray[b].x, 
              particlesArray[b].y
            );
            
            // Extract colors without opacity for gradient
            const colorA = particlesArray[a].color.replace(/[^,]+(?=\))/, '1');
            const colorB = particlesArray[b].color.replace(/[^,]+(?=\))/, '1');
            
            gradient.addColorStop(0, colorA);
            gradient.addColorStop(1, colorB);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="particle-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.9
      }}
    />
  );
};

export default ParticleBackground;