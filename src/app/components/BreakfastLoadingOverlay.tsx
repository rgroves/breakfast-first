// NOTE: This component was coded with all the vibes courtesy of Claude Sonnet 4.
"use client";

import { useEffect, useRef, useCallback } from "react";

interface BreakfastEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
}

export default function BreakfastLoadingOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emojisRef = useRef<BreakfastEmoji[]>([]);
  const emojiIdRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  // Move constants outside render to avoid re-creation
  const breakfastEmojis = useRef([
    "🥓",
    "☕",
    "🧇",
    "🥞",
    "🍩",
    "🍳",
    "🥐",
    "🥯",
    "🥣",
  ]);

  // Performance constants
  const MAX_EMOJIS = 20; // Reduced from 50
  const SPAWN_RATE = 0.15; // Reduced from 0.3
  const TARGET_FPS = 60;
  const FRAME_TIME = 1000 / TARGET_FPS;

  const createEmoji = useCallback((): BreakfastEmoji => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not available");

    return {
      id: emojiIdRef.current++,
      emoji:
        breakfastEmojis.current[
          Math.floor(Math.random() * breakfastEmojis.current.length)
        ],
      x: Math.random() * canvas.width,
      y: -50,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: Math.random() * 3 + 2,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 20 + 30, // Random size between 30-50px
    };
  }, []);

  const animate = useCallback(
    (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Frame rate limiting
      if (currentTime - lastTimeRef.current < FRAME_TIME) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      // Clear canvas efficiently
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Batch style operations to reduce state changes
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Add new emojis with controlled rate
      if (emojisRef.current.length < MAX_EMOJIS && Math.random() < SPAWN_RATE) {
        emojisRef.current.push(createEmoji());
      }

      // Update physics and render in single pass
      const activeEmojis: BreakfastEmoji[] = [];

      for (let i = 0; i < emojisRef.current.length; i++) {
        const emoji = emojisRef.current[i];

        // Update position
        emoji.x += emoji.velocityX;
        emoji.y += emoji.velocityY;
        emoji.rotation += emoji.rotationSpeed;
        emoji.velocityY += 0.1; // gravity

        // Cull off-screen emojis early
        if (
          emoji.y < canvas.height + 100 &&
          emoji.x > -100 &&
          emoji.x < canvas.width + 100
        ) {
          // Render emoji
          ctx.save();
          ctx.translate(emoji.x, emoji.y);
          ctx.rotate(emoji.rotation);

          // Only set font if size changed (optimization)
          ctx.font = `${emoji.size}px Arial`;
          ctx.fillText(emoji.emoji, 0, 0);
          ctx.restore();

          activeEmojis.push(emoji);
        }
      }

      // Update array reference once
      emojisRef.current = activeEmojis;

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [createEmoji, MAX_EMOJIS, SPAWN_RATE, FRAME_TIME]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      // Clear emojis on unmount
      emojisRef.current = [];
    };
  }, [animate]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)", // Safari support
        }}
      />

      {/* Canvas for animated breakfast emojis */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Loading text */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "2.25rem", // 36px equivalent to text-4xl
            fontWeight: "bold",
            color: "white",
            marginBottom: "1rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Cooking up something delicious...
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.25rem",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "white",
                borderRadius: "50%",
                animation: `bounce 1s infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animation for bounce effect */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translateY(0);
          }
          40%,
          43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
