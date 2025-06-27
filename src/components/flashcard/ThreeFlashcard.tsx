"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { GamePair } from "@/types";

interface ThreeFlashcardProps {
  card: GamePair | null;
  isFlipped: boolean;
  onFlip: () => void;
  frontColor: string;
  backColor: string;
  textColor?: string;
  showHints?: boolean;
}

function FlashcardMesh({
  card,
  isFlipped,
  onFlip,
  showHints = false,
}: ThreeFlashcardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Handle flip animation (vertical rotation)
  useEffect(() => {
    setTargetRotation(isFlipped ? Math.PI : 0);
    setIsAnimating(true);
  }, [isFlipped]);

  useFrame((state, delta) => {
    if (cardRef.current) {
      // Smooth flip animation (vertical rotation)
      if (isAnimating) {
        const currentRotation = cardRef.current.rotation.x;
        const diff = targetRotation - currentRotation;

        if (Math.abs(diff) > 0.01) {
          cardRef.current.rotation.x += diff * delta * 15;
        } else {
          cardRef.current.rotation.x = targetRotation;
          setIsAnimating(false);
        }
      }
    }
  });

  const handleClick = (event: React.PointerEvent) => {
    event.stopPropagation();
    onFlip();
  };

  const handleHintClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowHint(!showHint);
  };

  const generateHint = (definition: string) => {
    const words = definition.trim().split(/\s+/);
    if (words.length === 0) return "";

    if (words.length === 1) {
      return words[0][0] + "_".repeat(words[0].length - 1);
    }

    const firstWord = words[0];
    const secondWord = words[1];
    const secondWordHint =
      secondWord[0] + "_".repeat(Math.max(0, secondWord.length - 1));

    return `${firstWord} ${secondWordHint} ${"_".repeat(10)}`;
  };

  if (!card) return null;

  // Determine which side is visible (vertical rotation)
  const showFront =
    Math.abs((cardRef.current?.rotation.x || 0) % (2 * Math.PI)) <
      Math.PI / 2 ||
    Math.abs((cardRef.current?.rotation.x || 0) % (2 * Math.PI)) >
      (3 * Math.PI) / 2;

  return (
    <group ref={cardRef} onClick={handleClick}>
      {/* Front Face */}
      <RoundedBox
        args={[16, 10, 0.15]}
        radius={0.4}
        smoothness={4}
        position={[0, 0, 0.075]}
      >
        <meshLambertMaterial color="#2E3856" transparent opacity={0.95} />
      </RoundedBox>

      {/* Front Text */}
      <Text
        position={[0, 0, 0.16]}
        fontSize={1.2}
        color="#C6C9D3"
        anchorX="center"
        anchorY="middle"
        maxWidth={14}
        textAlign="center"
        visible={showFront}
      >
        {card.term}
      </Text>

      {/* Hint Icon and Text - Same row, top left (only on front) */}
      {showHints && showFront && (
        <group position={[-6.5, 4, 0.16]}>
          {/* Hint Icon - 16px equivalent size */}
          <group position={[0, 0, 0]} onClick={handleHintClick}>
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.4}
              color={showHint ? "#FBBF24" : "#9CA3AF"}
              anchorX="center"
              anchorY="middle"
            >
              💡
            </Text>
          </group>

          {/* Hint Text - Same row, next to icon */}
          {showHint && (
            <Text
              position={[1.5, 0, 0.03]}
              fontSize={0.35}
              color="#FBBF24"
              anchorX="left"
              anchorY="middle"
              maxWidth={8}
              textAlign="left"
            >
              {generateHint(card.definition)}
            </Text>
          )}
        </group>
      )}

      {/* Back Face */}
      <RoundedBox
        args={[16, 10, 0.15]}
        radius={0.4}
        smoothness={4}
        position={[0, 0, -0.075]}
        rotation={[Math.PI, 0, 0]}
      >
        <meshLambertMaterial color="#2E3856" transparent opacity={0.95} />
      </RoundedBox>

      {/* Back Text */}
      <Text
        position={[0, 0, -0.16]}
        rotation={[Math.PI, 0, 0]}
        fontSize={1.0}
        color="#C6C9D3"
        anchorX="center"
        anchorY="middle"
        maxWidth={14}
        textAlign="center"
        visible={!showFront}
      >
        {card.definition}
      </Text>

      {/* Subtle hint text */}
      {showFront && (
        <Text
          position={[0, -4.5, 0.16]}
          fontSize={0.4}
          color="#9CA3AF"
          anchorX="center"
          anchorY="middle"
        >
          Click to reveal
        </Text>
      )}
    </group>
  );
}

export default function ThreeFlashcard(props: ThreeFlashcardProps) {
  return (
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer">
      <Canvas
        camera={{
          position: [0, 0, 14],
          fov: 40,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <FlashcardMesh {...props} />
      </Canvas>
    </div>
  );
}
