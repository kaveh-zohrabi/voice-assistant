import React, { useRef, useEffect, useState } from 'react';

export default function Avatar({ speaking, listening, mood }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 200;
    const H = canvas.height = 200;

    let mouthTarget = 0;
    let mouthCurrent = 0;
    let blinkTime = 0;
    let blinkState = 0;
    let headTilt = 0;
    let headTiltTarget = 0;
    let time = 0;

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, W, H);

      // Mouth animation
      if (speaking) {
        mouthTarget = 0.3 + Math.abs(Math.sin(time * 8)) * 0.7;
      } else {
        mouthTarget = 0.05;
      }
      mouthCurrent += (mouthTarget - mouthCurrent) * 0.3;

      // Blink animation
      blinkTime += 0.02;
      if (blinkTime > 3 + Math.random() * 2) {
        blinkTime = 0;
        blinkState = 1;
      }
      if (blinkState > 0) {
        blinkState += 0.15;
        if (blinkState > 2) blinkState = 0;
      }

      // Head tilt
      if (listening) {
        headTiltTarget = Math.sin(time * 0.5) * 0.05;
      } else {
        headTiltTarget = Math.sin(time * 0.3) * 0.02;
      }
      headTilt += (headTiltTarget - headTilt) * 0.05;

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(headTilt);

      // Head shadow
      ctx.beginPath();
      ctx.ellipse(0, 5, 60, 65, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();

      // Head
      const headGrad = ctx.createRadialGradient(-10, -15, 10, 0, 0, 65);
      headGrad.addColorStop(0, '#f5deb3');
      headGrad.addColorStop(1, '#deb887');
      ctx.beginPath();
      ctx.ellipse(0, 0, 55, 60, 0, 0, Math.PI * 2);
      ctx.fillStyle = headGrad;
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.ellipse(0, -25, 52, 35, 0, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#1a1a2e';
      ctx.fill();

      // Left ear
      ctx.beginPath();
      ctx.ellipse(-52, 5, 8, 12, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#deb887';
      ctx.fill();

      // Right ear
      ctx.beginPath();
      ctx.ellipse(52, 5, 8, 12, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#deb887';
      ctx.fill();

      // Eyes
      const blinkScale = blinkState > 0 ? Math.max(0.1, 1 - Math.abs(blinkState - 1)) : 1;

      // Left eye white
      ctx.beginPath();
      ctx.ellipse(-18, -5, 12, 9 * blinkScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Left pupil
      if (blinkScale > 0.5) {
        ctx.beginPath();
        ctx.ellipse(-18 + Math.sin(time * 0.7) * 2, -5 + Math.cos(time * 0.5) * 1, 5, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#2c1810';
        ctx.fill();

        // Left iris
        ctx.beginPath();
        ctx.ellipse(-18 + Math.sin(time * 0.7) * 2, -5 + Math.cos(time * 0.5) * 1, 3, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();

        // Left eye highlight
        ctx.beginPath();
        ctx.ellipse(-16 + Math.sin(time * 0.7) * 2, -7 + Math.cos(time * 0.5) * 1, 1.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      // Right eye white
      ctx.beginPath();
      ctx.ellipse(18, -5, 12, 9 * blinkScale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Right pupil
      if (blinkScale > 0.5) {
        ctx.beginPath();
        ctx.ellipse(18 + Math.sin(time * 0.7) * 2, -5 + Math.cos(time * 0.5) * 1, 5, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#2c1810';
        ctx.fill();

        // Right iris
        ctx.beginPath();
        ctx.ellipse(18 + Math.sin(time * 0.7) * 2, -5 + Math.cos(time * 0.5) * 1, 3, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();

        // Right eye highlight
        ctx.beginPath();
        ctx.ellipse(20 + Math.sin(time * 0.7) * 2, -7 + Math.cos(time * 0.5) * 1, 1.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      // Eyebrows
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';

      // Left eyebrow
      ctx.beginPath();
      ctx.moveTo(-28, -18 + Math.sin(time * 0.5) * 0.5);
      ctx.quadraticCurveTo(-18, -22 + Math.sin(time * 0.5) * 0.5, -8, -18 + Math.sin(time * 0.5) * 0.5);
      ctx.stroke();

      // Right eyebrow
      ctx.beginPath();
      ctx.moveTo(8, -18 + Math.sin(time * 0.5) * 0.5);
      ctx.quadraticCurveTo(18, -22 + Math.sin(time * 0.5) * 0.5, 28, -18 + Math.sin(time * 0.5) * 0.5);
      ctx.stroke();

      // Nose
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.quadraticCurveTo(-4, 15, 0, 18);
      ctx.quadraticCurveTo(4, 15, 0, 5);
      ctx.fillStyle = '#d4a574';
      ctx.fill();

      // Mouth
      const mouthWidth = 18;
      const mouthHeight = 6 + mouthCurrent * 14;

      // Mouth shape
      ctx.beginPath();
      ctx.moveTo(-mouthWidth, 28);

      if (mouthCurrent > 0.15) {
        // Open mouth
        ctx.quadraticCurveTo(0, 28 - mouthHeight * 0.5, mouthWidth, 28);
        ctx.quadraticCurveTo(0, 28 + mouthHeight, -mouthWidth, 28);

        // Inner mouth
        ctx.fillStyle = '#8b0000';
        ctx.fill();

        // Teeth
        ctx.beginPath();
        ctx.moveTo(-mouthWidth * 0.6, 28);
        ctx.quadraticCurveTo(0, 28 + mouthHeight * 0.3, mouthWidth * 0.6, 28);
        ctx.fillStyle = '#fff';
        ctx.fill();
      } else {
        // Closed mouth (smile)
        ctx.quadraticCurveTo(0, 28 + 6, mouthWidth, 28);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Cheek blush
      ctx.beginPath();
      ctx.ellipse(-30, 15, 8, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 150, 150, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(30, 15, 8, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 150, 150, 0.15)';
      ctx.fill();

      ctx.restore();

      // Glow effect when speaking
      if (speaking) {
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, 70, 0, Math.PI * 2);
        const glowGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 90);
        glowGrad.addColorStop(0, 'rgba(96, 165, 250, 0.1)');
        glowGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [speaking, listening]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-48 h-48" style={{ imageRendering: 'auto' }} />
      {speaking && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 rounded-full bg-blue-400/60" style={{ animation: `audio-bar 0.${3 + i}s ease-in-out infinite alternate`, height: '8px' }} />
          ))}
        </div>
      )}
    </div>
  );
}
