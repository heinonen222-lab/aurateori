import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SceneKind } from "./lesson-scenes";

type SceneProps = { kind: SceneKind; playing: boolean; step: number; reducedMotion: boolean };

const COLORS = {
  road: "#39424b",
  line: "#f4f0dc",
  grass: "#6d9a6c",
  blue: "#2979c7",
  gold: "#e2a925",
  red: "#d64f45",
  ice: "#b8dce8",
  dark: "#17212b",
};

function Car({ color, position, rotation = 0 }: { color: string; position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[1.45, 0.42, 2.7]} radius={0.15} smoothness={3} position-y={0.45} castShadow>
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[1.18, 0.46, 1.25]} radius={0.12} smoothness={3} position={[0, 0.83, -0.15]} castShadow>
        <meshStandardMaterial color="#c7dae4" roughness={0.2} metalness={0.25} />
      </RoundedBox>
      {[-0.64, 0.64].flatMap((x) => [-0.8, 0.8].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.28, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 14]} />
          <meshStandardMaterial color="#17191c" roughness={0.9} />
        </mesh>
      )))}
    </group>
  );
}

function Road({ cross = false, icy = false }: { cross?: boolean; icy?: boolean }) {
  const surface = icy ? COLORS.ice : COLORS.road;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color={COLORS.grass} roughness={1} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[7, 28]} />
        <meshStandardMaterial color={surface} roughness={icy ? 0.2 : 0.95} metalness={icy ? 0.15 : 0} />
      </mesh>
      {cross && (
        <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[28, 7]} />
          <meshStandardMaterial color={surface} roughness={0.95} />
        </mesh>
      )}
      {[-8, -3, 3, 8].map((z) => (
        <mesh key={z} position={[0, 0.05, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.16, 2.6]} />
          <meshBasicMaterial color={COLORS.line} />
        </mesh>
      ))}
    </group>
  );
}

function Marker({ position, color = COLORS.gold, scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} scale={scale}>
      <ringGeometry args={[0.65, 0.92, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function AnimatedWorld({ kind, playing, step, reducedMotion }: SceneProps) {
  const primary = useRef<THREE.Group>(null);
  const secondary = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    elapsed.current = step * 1.7;
  }, [step, kind]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (playing && !reducedMotion) elapsed.current += delta;
    const t = elapsed.current;
    if (primary.current) {
      if (kind === "intersection") primary.current.position.z = 7 - (t % 7) * 1.7;
      else if (kind === "braking") primary.current.position.z = Math.max(-5, 7 - (t % 7) * 2.6);
      else if (kind === "overtake") {
        primary.current.position.z = 7 - (t % 8) * 1.8;
        primary.current.position.x = -1.5 + Math.sin(Math.min(1, (t % 8) / 3) * Math.PI) * 3;
      } else if (kind === "parking") {
        primary.current.position.z = 5 - Math.min(1, (t % 7) / 4) * 6;
        primary.current.position.x = Math.min(1, Math.max(0, (t % 7 - 2) / 3)) * 2.1;
      } else if (kind === "ice") {
        primary.current.position.z = 7 - (t % 8) * 1.6;
        primary.current.rotation.y = Math.sin(t * 2.2) * 0.18;
      } else primary.current.position.z = 7 - (t % 8) * 1.8;
    }
    if (secondary.current) {
      secondary.current.position.x = kind === "intersection" ? 7 - (t % 7) * 1.7 : secondary.current.position.x;
    }
    if (pulse.current) {
      const s = 1 + Math.sin(t * 3) * 0.12;
      pulse.current.scale.setScalar(s);
    }
  });

  const cross = kind === "intersection" || kind === "signs" || kind === "license";
  return (
    <>
      <Road cross={cross} icy={kind === "ice"} />
      <group ref={primary}>
        <Car color={kind === "night" ? COLORS.gold : COLORS.blue} position={[kind === "overtake" ? -1.5 : -1.55, 0, 0]} />
      </group>
      {(kind === "intersection" || kind === "overtake" || kind === "motorway") && (
        <group ref={secondary} position={kind === "intersection" ? [7, 0, 1.5] : [1.55, 0, -2]} rotation-y={kind === "intersection" ? Math.PI / 2 : 0}>
          <Car color={COLORS.red} position={[0, 0, 0]} />
        </group>
      )}
      {kind === "braking" && (
        <>
          {[4, 2, 0, -2, -4].map((z, i) => <Marker key={z} position={[1.7, 0.08, z]} color={i < 2 ? COLORS.gold : COLORS.red} scale={0.52} />)}
          <mesh ref={pulse} position={[0, 0.08, -5]} rotation-x={-Math.PI / 2}><ringGeometry args={[1.1, 1.4, 32]} /><meshBasicMaterial color={COLORS.red} /></mesh>
        </>
      )}
      {kind === "signs" && [-5, 0, 5].map((x, i) => (
        <group key={x} position={[x, 0, -3]}>
          <mesh position-y={1.25}><cylinderGeometry args={[0.08, 0.08, 2.5, 8]} /><meshStandardMaterial color="#8c959d" /></mesh>
          <mesh position-y={2.6} rotation-y={i * 0.25}><cylinderGeometry args={[0.75, 0.75, 0.12, i === 0 ? 3 : 24]} /><meshStandardMaterial color={i === 1 ? COLORS.blue : COLORS.red} /></mesh>
        </group>
      ))}
      {kind === "driver" && (
        <group position={[2.3, 0.1, -1]}>
          <mesh position-y={1.25}><capsuleGeometry args={[0.42, 1.1, 4, 8]} /><meshStandardMaterial color={COLORS.gold} /></mesh>
          <mesh ref={pulse} position={[0, 2.35, 0]}><sphereGeometry args={[0.48, 16, 12]} /><meshStandardMaterial color="#edc5a1" /></mesh>
        </group>
      )}
      {kind === "eco" && [-4, 0, 4].map((x, i) => (
        <mesh key={x} position={[x, 1.2, -3]} rotation-z={i % 2 ? 0.3 : -0.3}><sphereGeometry args={[0.7, 12, 8]} /><meshStandardMaterial color={i === 1 ? COLORS.gold : "#3f8753"} /></mesh>
      ))}
      {kind === "vehicle" && (
        <group position={[2.2, 0, -1.8]} scale={1.5}><Car color={COLORS.gold} position={[0, 0, 0]} /></group>
      )}
      {kind === "motorway" && (
        <group position={[3.6, 0, -3]}><mesh position-y={1.4}><boxGeometry args={[2.2, 1.2, 0.15]} /><meshStandardMaterial color={COLORS.blue} /></mesh><mesh position-y={0.7}><cylinderGeometry args={[0.08, 0.08, 1.4, 8]} /><meshStandardMaterial color="#8c959d" /></mesh></group>
      )}
      {kind === "parking" && [-4, 0, 4].map((z) => <mesh key={z} position={[2.7, 0.055, z]} rotation-x={-Math.PI / 2}><planeGeometry args={[2.4, 0.12]} /><meshBasicMaterial color={COLORS.line} /></mesh>)}
      {kind === "night" && (
        <>
          <ambientLight intensity={0.12} />
          <spotLight position={[-1.6, 1, 2]} color="#fff0b8" intensity={8} angle={0.34} distance={14} />
        </>
      )}
      {kind === "ice" && [-4, 0, 4].map((z) => <Marker key={z} position={[1.5, 0.07, z]} color="#ffffff" scale={0.35} />)}
      {kind === "license" && (
        <group position={[3.8, 0.1, -2]}><RoundedBox args={[3, 1.8, 0.16]} radius={0.12} smoothness={3} position-y={1.4}><meshStandardMaterial color={COLORS.gold} /></RoundedBox></group>
      )}
    </>
  );
}

export function LessonScene(props: SceneProps) {
  const night = props.kind === "night";
  return (
    <Canvas shadows camera={{ position: [10, 10, 12], fov: 43 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <color attach="background" args={[night ? COLORS.dark : "#cfe3e9"]} />
      <fog attach="fog" args={[night ? COLORS.dark : "#cfe3e9", 18, 34]} />
      <hemisphereLight args={[night ? "#52637d" : "#e5f2ff", "#50614a", night ? 0.5 : 1.4]} />
      <directionalLight position={[7, 12, 6]} intensity={night ? 0.5 : 2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <AnimatedWorld {...props} />
      <Environment>
        <Lightformer intensity={1.5} position={[0, 8, 2]} scale={[12, 5, 1]} />
        <Lightformer intensity={0.8} color="#a9c9d3" position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>
    </Canvas>
  );
}