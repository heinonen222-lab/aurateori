import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { LessonSceneConfig } from "./lesson-scenes";

type SceneProps = { scene: LessonSceneConfig; playing: boolean; reducedMotion: boolean };
type Vec3 = [number, number, number];
type Motion = (time: number) => { x: number; z: number; yaw: number; visible?: boolean };
type WebGLStatus = "checking" | "supported" | "unsupported";

const COLORS = {
  asphalt: "#3c4248",
  asphaltDark: "#2f3439",
  roadEdge: "#252a2f",
  line: "#f4f0dc",
  yellowLine: "#e3bd4b",
  grass: "#6f9565",
  snow: "#dbe8eb",
  ice: "#b7d9e7",
  water: "#6aa5b5",
  blue: "#276aa6",
  red: "#cf4d43",
  gold: "#e0ac32",
  green: "#4d915a",
  black: "#181b1e",
  white: "#f7f4e7",
  signPole: "#8a949b",
  pedestrian: "#f0c18f",
  night: "#17212b",
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function browserSupportsWebGL() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function cycle(time: number, length = 8) {
  return time % length;
}

function Ground({ winter = false }: { winter?: boolean }) {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[34, 34]} />
      <meshStandardMaterial color={winter ? COLORS.snow : COLORS.grass} roughness={1} />
    </mesh>
  );
}

function RoadPlane({ width, length, position = [0, 0.02, 0], rotation = 0, color = COLORS.asphalt }: { width: number; length: number; position?: Vec3; rotation?: number; color?: string }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} rotation-z={rotation} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  );
}

function LaneDashes({ x = 0, zValues = [-10, -6, -2, 2, 6, 10], rotation = 0, yellow = false }: { x?: number; zValues?: number[]; rotation?: number; yellow?: boolean }) {
  return (
    <group rotation-y={rotation}>
      {zValues.map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.055, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.14, 1.9]} />
          <meshBasicMaterial color={yellow ? COLORS.yellowLine : COLORS.line} />
        </mesh>
      ))}
    </group>
  );
}

function StopLine({ position, rotation = 0, color = COLORS.line }: { position: Vec3; rotation?: number; color?: string }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} rotation-z={rotation}>
      <planeGeometry args={[3.2, 0.22]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function YieldTeeth({ position, rotation = 0 }: { position: Vec3; rotation?: number }) {
  return (
    <group position={position} rotation-y={rotation}>
      {[-1.1, 0, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.075, 0]} rotation-x={-Math.PI / 2}>
          <coneGeometry args={[0.34, 0.58, 3]} />
          <meshBasicMaterial color={COLORS.line} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Crosswalk({ z = -2.8, x = 0, rotation = 0 }: { z?: number; x?: number; rotation?: number }) {
  return (
    <group position={[x, 0.07, z]} rotation-y={rotation}>
      {[-1.4, -0.7, 0, 0.7, 1.4].map((stripe) => (
        <mesh key={stripe} position={[stripe, 0, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.34, 3.6]} />
          <meshBasicMaterial color={COLORS.line} />
        </mesh>
      ))}
    </group>
  );
}

function DirectionArrow({ position, rotation = 0, color = COLORS.green, scale = 1 }: { position: Vec3; rotation?: number; color?: string; scale?: number }) {
  return (
    <group position={position} rotation-y={rotation} scale={scale}>
      <mesh position={[0, 0.09, -0.38]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.28, 0.9]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} />
      </mesh>
      <mesh position={[0, 0.09, -0.95]} rotation-x={-Math.PI / 2} rotation-z={Math.PI}>
        <coneGeometry args={[0.42, 0.7, 3]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PriorityRing({ position, color = COLORS.gold, scale = 1 }: { position: Vec3; color?: string; scale?: number }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} scale={scale}>
      <ringGeometry args={[0.58, 0.82, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Sign({ type, position, rotation = 0, scale = 1 }: { type: "yield" | "stop" | "priority" | "no-parking" | "speed30" | "speed50" | "warning" | "prohibition" | "mandatory" | "info" | "motorway" | "no-overtake"; position: Vec3; rotation?: number; scale?: number }) {
  const shape = type === "yield" || type === "warning" ? 3 : type === "priority" ? 4 : 32;
  const color = type === "mandatory" || type === "info" || type === "motorway" ? COLORS.blue : type === "priority" || type.startsWith("speed") ? COLORS.gold : COLORS.red;
  return (
    <group position={position} rotation-y={rotation} scale={scale}>
      <mesh position-y={1.15} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 2.3, 8]} />
        <meshStandardMaterial color={COLORS.signPole} roughness={0.55} />
      </mesh>
      <mesh position-y={2.45} rotation-z={type === "priority" ? Math.PI / 4 : type === "yield" ? Math.PI : 0} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.09, shape]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      {(type === "yield" || type === "warning" || type === "speed30" || type === "speed50" || type === "no-parking" || type === "no-overtake") && (
        <mesh position-y={2.51} rotation-z={type === "yield" ? Math.PI : 0}>
          <cylinderGeometry args={[0.38, 0.38, 0.1, shape]} />
          <meshStandardMaterial color={type === "warning" || type.startsWith("speed") ? COLORS.white : COLORS.blue} roughness={0.4} />
        </mesh>
      )}
    </group>
  );
}

function CarModel({ color = COLORS.blue, lights = false }: { color?: string; lights?: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.35, 0.42, 2.45]} radius={0.12} smoothness={3} position-y={0.42} castShadow>
        <meshStandardMaterial color={color} roughness={0.48} metalness={0.12} />
      </RoundedBox>
      <RoundedBox args={[1.05, 0.42, 1.05]} radius={0.1} smoothness={3} position={[0, 0.8, -0.16]} castShadow>
        <meshStandardMaterial color="#c8dce4" roughness={0.25} metalness={0.15} />
      </RoundedBox>
      {[-0.58, 0.58].flatMap((x) => [-0.74, 0.74].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.25, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 14]} />
          <meshStandardMaterial color={COLORS.black} roughness={0.9} />
        </mesh>
      )))}
      {lights && [-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.5, -1.25]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}

function MovingCar({ color, motion, playing, reducedMotion, sceneId, lights = false }: { color?: string; motion: Motion; playing: boolean; reducedMotion: boolean; sceneId: string; lights?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    elapsed.current = 0;
    const start = motion(0);
    if (group.current) {
      group.current.position.set(start.x, 0, start.z);
      group.current.rotation.y = start.yaw;
      group.current.visible = start.visible !== false;
    }
  }, [motion, sceneId]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (playing && !reducedMotion) elapsed.current += delta;
    const state = motion(elapsed.current);
    if (!group.current) return;
    group.current.position.set(state.x, 0, state.z);
    group.current.rotation.y = state.yaw;
    group.current.visible = state.visible !== false;
  });

  return (
    <group ref={group}>
      <CarModel color={color} lights={lights} />
    </group>
  );
}

function Pedestrian({ position, moving = false, sceneId, playing, reducedMotion }: { position: Vec3; moving?: boolean; sceneId: string; playing: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    elapsed.current = 0;
  }, [sceneId]);
  useFrame((_, rawDelta) => {
    if (!moving || !group.current) return;
    if (playing && !reducedMotion) elapsed.current += Math.min(rawDelta, 0.05);
    const t = cycle(elapsed.current, 7);
    group.current.position.x = -2.4 + clamp01((t - 1) / 3.2) * 4.8;
  });
  return (
    <group ref={group} position={position}>
      <mesh position-y={0.75} castShadow>
        <capsuleGeometry args={[0.18, 0.72, 4, 8]} />
        <meshStandardMaterial color={COLORS.blue} flatShading />
      </mesh>
      <mesh position-y={1.35} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color={COLORS.pedestrian} flatShading />
      </mesh>
    </group>
  );
}

function HouseRow() {
  return (
    <group>
      {[-10, -6, 6, 10].map((x, i) => (
        <group key={x} position={[x, 0, i % 2 === 0 ? -9 : 8]}>
          <mesh position-y={0.7} castShadow>
            <boxGeometry args={[2.3, 1.4, 1.8]} />
            <meshStandardMaterial color={i % 2 ? "#d9b56f" : "#b96f5f"} roughness={0.8} />
          </mesh>
          <mesh position-y={1.6} rotation-y={Math.PI / 4} castShadow>
            <coneGeometry args={[1.65, 1.1, 4]} />
            <meshStandardMaterial color="#7f4c3d" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Trees({ winter = false }: { winter?: boolean }) {
  return (
    <group>
      {[-13, -9, -5, 5, 9, 13].map((x, i) => (
        <group key={x} position={[x, 0, i % 2 ? -12 : 12]}>
          <mesh position-y={0.75} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 1.5, 7]} />
            <meshStandardMaterial color="#7d5a35" roughness={1} />
          </mesh>
          <mesh position-y={1.85} castShadow>
            <coneGeometry args={[0.9, 1.9, 7]} />
            <meshStandardMaterial color={winter ? "#d7edf0" : COLORS.green} roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoadLayout({ scene }: { scene: LessonSceneConfig }) {
  const winter = scene.weather === "winter" || scene.layout === "winter";
  const roadColor = winter ? COLORS.ice : scene.weather === "night" ? COLORS.asphaltDark : COLORS.asphalt;
  return (
    <group>
      <Ground winter={winter} />
      {scene.layout === "cross" && (
        <>
          <RoadPlane width={6.6} length={30} color={roadColor} />
          <RoadPlane width={6.6} length={30} rotation={Math.PI / 2} color={roadColor} />
          <LaneDashes />
          <LaneDashes rotation={Math.PI / 2} />
        </>
      )}
      {scene.layout === "t-crossing" && (
        <>
          <RoadPlane width={6.4} length={27} color={roadColor} />
          <RoadPlane width={6.4} length={16} position={[5.5, 0.03, 0]} rotation={Math.PI / 2} color={roadColor} />
          <LaneDashes zValues={[-10, -6, -2, 5, 9]} />
        </>
      )}
      {scene.layout === "priority-road" && (
        <>
          <RoadPlane width={7.2} length={30} color={roadColor} />
          <RoadPlane width={5.4} length={17} position={[6.4, 0.03, 0]} rotation={Math.PI / 2} color={roadColor} />
          <RoadPlane width={5.4} length={17} position={[-6.4, 0.03, 0]} rotation={Math.PI / 2} color={roadColor} />
          <LaneDashes yellow />
        </>
      )}
      {scene.layout === "roundabout" && (
        <>
          <RoadPlane width={6.4} length={30} color={roadColor} />
          <RoadPlane width={6.4} length={30} rotation={Math.PI / 2} color={roadColor} />
          <mesh position={[0, 0.07, 0]} rotation-x={-Math.PI / 2} receiveShadow>
            <ringGeometry args={[2.15, 4.0, 64]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation-x={-Math.PI / 2} receiveShadow>
            <circleGeometry args={[1.85, 48]} />
            <meshStandardMaterial color={winter ? COLORS.snow : COLORS.grass} roughness={1} />
          </mesh>
          <YieldTeeth position={[0, 0, 5.1]} rotation={0} />
          <Crosswalk z={7.1} />
        </>
      )}
      {(scene.layout === "straight" || scene.layout === "residential" || scene.layout === "eco" || scene.layout === "vehicle-pad" || scene.layout === "sign-context" || scene.layout === "night" || scene.layout === "winter") && (
        <>
          <RoadPlane width={7} length={30} color={roadColor} />
          <LaneDashes />
        </>
      )}
      {scene.layout === "motorway" && (
        <>
          <RoadPlane width={12} length={32} color={roadColor} />
          <RoadPlane width={4.2} length={15} position={[7, 0.03, 3.5]} rotation={-0.45} color={roadColor} />
          <LaneDashes x={-2} />
          <LaneDashes x={2} />
          <mesh position={[5.8, 0.065, -7]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.18, 7]} />
            <meshBasicMaterial color={COLORS.line} />
          </mesh>
        </>
      )}
      {scene.layout === "overtake" && (
        <>
          <RoadPlane width={8.4} length={32} color={roadColor} />
          <LaneDashes yellow />
        </>
      )}
      {scene.layout === "parking" && (
        <>
          <RoadPlane width={7} length={27} color={roadColor} />
          <RoadPlane width={6.5} length={13} rotation={Math.PI / 2} color={roadColor} />
          <LaneDashes zValues={[-10, -6, 5, 9]} />
          <Crosswalk z={-3.9} />
          {[-8, -5.4, -2.8, 2.8, 5.4, 8].map((z) => (
            <mesh key={z} position={[4.25, 0.07, z]} rotation-x={-Math.PI / 2}>
              <planeGeometry args={[2.3, 0.12]} />
              <meshBasicMaterial color={COLORS.line} />
            </mesh>
          ))}
        </>
      )}
      {scene.layout === "process" && (
        <>
          <RoadPlane width={4.2} length={24} color={roadColor} />
          <LaneDashes zValues={[-8, -4, 0, 4, 8]} />
        </>
      )}
      {(scene.layout === "residential" || scene.id === "right-hand-rule" || scene.id === "vulnerable-road-users") && <HouseRow />}
      <Trees winter={winter} />
    </group>
  );
}

function DistanceMarkers({ color = COLORS.gold, start = 5, count = 5, laneX = 1.8 }: { color?: string; start?: number; count?: number; laneX?: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <PriorityRing key={i} position={[laneX, 0.1, start - i * 2.2]} color={i < 2 ? COLORS.gold : color} scale={0.45 + i * 0.08} />
      ))}
    </group>
  );
}

function LightCone({ position, rotation = 0, long = false, dim = false }: { position: Vec3; rotation?: number; long?: boolean; dim?: boolean }) {
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} rotation-z={rotation}>
      <coneGeometry args={[long ? 2.2 : 1.35, long ? 8.5 : 5.2, 32]} />
      <meshBasicMaterial color="#fff2aa" transparent opacity={dim ? 0.16 : 0.28} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function ProcessNodes({ active = 0 }: { active?: number }) {
  const items = [-6, -2, 2, 6];
  return (
    <group>
      {items.map((z, i) => (
        <group key={z} position={[0, 0.1, z]}>
          <PriorityRing position={[0, 0, 0]} color={i <= active ? COLORS.green : COLORS.gold} scale={0.75} />
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.45, 0.48, 1.1]} />
            <meshStandardMaterial color={i <= active ? COLORS.green : COLORS.gold} roughness={0.55} />
          </mesh>
        </group>
      ))}
      <MovingCar sceneId={`process-${active}`} playing reducedMotion={false} color={COLORS.blue} motion={() => ({ x: -1.55, z: -6 + active * 4, yaw: 0 })} />
    </group>
  );
}

const motions: Record<string, Motion[]> = {
  "right-hand-rule": [
    (t) => ({ x: -1.6, z: Math.max(1.7, 7 - cycle(t, 8) * 1.35), yaw: 0 }),
    (t) => ({ x: 7 - Math.min(1, cycle(t, 8) / 3.8) * 11, z: 1.55, yaw: Math.PI / 2 }),
  ],
  "yield-sign": [
    (t) => ({ x: -1.45, z: Math.max(1.9, 7 - cycle(t, 8) * 1.15), yaw: 0 }),
    (t) => ({ x: 8 - cycle(t, 8) * 2.2, z: -1.45, yaw: Math.PI / 2 }),
  ],
  "stop-sign": [
    (t) => {
      const c = cycle(t, 8);
      const z = c < 3 ? 7 - c * 1.65 : c < 5 ? 2.05 : 2.05 - (c - 5) * 1.55;
      return { x: -1.55, z, yaw: 0 };
    },
  ],
  "priority-road": [
    (t) => ({ x: -1.45, z: 8 - cycle(t, 8) * 2.2, yaw: 0 }),
    (t) => ({ x: Math.max(4.5, -7 + cycle(t, 8) * 1.45), z: 1.45, yaw: -Math.PI / 2 }),
  ],
  "roundabout-walking": [
    (t) => {
      const c = cycle(t, 9);
      const angle = Math.PI * 1.15 - c * 0.72;
      return { x: Math.cos(angle) * 3.05, z: Math.sin(angle) * 3.05, yaw: -angle + Math.PI / 2 };
    },
    (t) => ({ x: -1.55, z: Math.max(5.1, 8 - cycle(t, 9) * 1.1), yaw: 0 }),
  ],
};

function defaultMotion(id: string, laneX = -1.55, speed = 1.8): Motion {
  return (t) => {
    const c = cycle(t, 8);
    if (id === "fatigue-drift") return { x: laneX + Math.sin(c * 2.1) * 0.65, z: 7 - c * 1.7, yaw: Math.sin(c * 2.1) * 0.16 };
    if (id === "peer-pressure-risk") return { x: laneX, z: 3.7 - c * 1.2, yaw: 0 };
    if (id === "braking-distance") return { x: laneX, z: Math.max(-5.4, 7 - c * 2.2), yaw: 0 };
    if (id === "reaction-distance") return { x: laneX, z: c < 2 ? 6 - c * 1.4 : 3.2 - (c - 2) * 2.0, yaw: 0 };
    if (id === "hydroplaning-skid") return { x: laneX + Math.sin(c * 1.7) * 1.05, z: 7 - c * 1.45, yaw: Math.sin(c * 1.7) * 0.34 };
    if (id === "motorway-merge") return { x: 4.8 - clamp01(c / 4) * 3.2, z: 7 - c * 1.9, yaw: -0.35 + clamp01(c / 4) * 0.35 };
    if (id === "motorway-exit-lanes") return { x: -1.8 + clamp01((c - 2.5) / 3) * 4.5, z: 7 - c * 1.8, yaw: clamp01((c - 2.5) / 3) * -0.45 };
    if (id === "overtake-left" || id === "overtake-return") return { x: -1.7 + Math.sin(clamp01(c / 5) * Math.PI) * 3.4, z: 7 - c * 1.75, yaw: Math.sin(clamp01(c / 5) * Math.PI) * 0.18 };
    if (id === "overtake-forbidden") return { x: -1.65, z: 7 - c * 1.25, yaw: 0 };
    if (id === "parking-distances") return { x: 4.15, z: -6.5 + clamp01(c / 4) * 2.0, yaw: 0 };
    if (id === "stop-vs-park" || id === "parking-main-road") return { x: 4.15, z: 5 - clamp01(c / 3.2) * 6, yaw: 0 };
    return { x: laneX, z: 7 - c * speed, yaw: 0 };
  };
}

function SceneSpecifics({ scene, playing, reducedMotion }: SceneProps) {
  const id = scene.id;
  const sceneMotions = motions[id] ?? [defaultMotion(id)];
  return (
    <group>
      {sceneMotions.map((motion, index) => (
        <MovingCar key={`${id}-${index}`} sceneId={id} playing={playing} reducedMotion={reducedMotion} motion={motion} color={index === 0 ? COLORS.blue : COLORS.red} lights={scene.weather === "night"} />
      ))}

      {id === "right-hand-rule" && <><PriorityRing position={[1.5, 0.1, 1.5]} /><DirectionArrow position={[3.4, 0.1, 1.5]} rotation={Math.PI / 2} /></>}
      {id === "yield-sign" && <><YieldTeeth position={[-1.5, 0, 2.45]} /><Sign type="yield" position={[-4.1, 0, 3.0]} rotation={0.15} /><DirectionArrow position={[1.7, 0.1, -1.5]} rotation={Math.PI / 2} /></>}
      {id === "stop-sign" && <><StopLine position={[-1.55, 0.08, 2.35]} /><Sign type="stop" position={[-4.25, 0, 2.75]} /><PriorityRing position={[-1.55, 0.1, 2.05]} color={COLORS.red} /></>}
      {id === "priority-road" && <><Sign type="priority" position={[-4.6, 0, 4.3]} /><Sign type="yield" position={[4.1, 0, 1.8]} rotation={Math.PI / 2} /><Sign type="no-parking" position={[-4.7, 0, -2.4]} /><DirectionArrow position={[-1.45, 0.1, -0.5]} /></>}
      {id === "roundabout-walking" && <><Sign type="mandatory" position={[-4.8, 0, 5.3]} /><Sign type="yield" position={[-3.8, 0, 5.4]} /><DirectionArrow position={[0, 0.12, -3.25]} rotation={Math.PI} /><Pedestrian position={[-2.4, 0, 7.1]} moving sceneId={id} playing={playing} reducedMotion={reducedMotion} /></>}

      {id === "reaction-distance" && <><DistanceMarkers start={4.8} count={4} laneX={1.7} /><mesh position={[0, 0.09, 2.9]} rotation-x={-Math.PI / 2}><planeGeometry args={[4.8, 0.14]} /><meshBasicMaterial color={COLORS.gold} /></mesh></>}
      {id === "braking-distance" && <><DistanceMarkers start={4.8} count={6} laneX={1.7} color={COLORS.red} /><MovingCar sceneId={`${id}-fast`} playing={playing} reducedMotion={reducedMotion} color={COLORS.gold} motion={defaultMotion(id, 1.55, 2.6)} /></>}
      {id === "speed-limits-basic" && <><Sign type="speed30" position={[-4.5, 0, 5]} /><Sign type="speed50" position={[-4.5, 0, 0]} /><Sign type="motorway" position={[-4.5, 0, -5]} /><HouseRow /></>}
      {id === "safe-following-distance" && <><MovingCar sceneId={`${id}-lead`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={defaultMotion("lead", -1.55, 1.25)} /><DistanceMarkers start={1.8} count={3} laneX={-1.55} color={COLORS.green} /></>}

      {id === "sign-shapes" && <><Sign type="warning" position={[-5, 0, 3]} /><Sign type="prohibition" position={[-5, 0, 0]} /><Sign type="mandatory" position={[-5, 0, -3]} /><Sign type="info" position={[4.5, 0, -1.5]} /></>}
      {id === "warning-sign-context" && <><Sign type="warning" position={[-4.6, 0, 3.2]} /><mesh position={[1.8, 0.15, -3.2]}><boxGeometry args={[2.1, 0.28, 1.2]} /><meshStandardMaterial color={COLORS.gold} /></mesh><DirectionArrow position={[-1.55, 0.1, 0.5]} color={COLORS.gold} /></>}
      {id === "prohibition-sign-context" && <><Sign type="prohibition" position={[-4.6, 0, 3.5]} /><mesh position={[-1.55, 0.12, -2.7]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.8, 1.05, 32]} /><meshBasicMaterial color={COLORS.red} /></mesh></>}
      {id === "mandatory-sign-context" && <><Sign type="mandatory" position={[-4.8, 0, 5.3]} /><DirectionArrow position={[0, 0.12, -3.25]} rotation={Math.PI} color={COLORS.blue} /></>}
      {id === "instruction-sign-context" && <><Sign type="priority" position={[-4.6, 0, 4.3]} /><Sign type="info" position={[4.4, 0, -3.5]} /><DirectionArrow position={[-1.45, 0.1, -1]} /></>}
      {id === "information-sign-context" && <><Sign type="motorway" position={[-6.2, 0, 5.5]} /><Sign type="info" position={[5.8, 0, -2.2]} /><DirectionArrow position={[2, 0.1, -4]} color={COLORS.blue} /></>}

      {id === "alcohol-reaction" && <><Crosswalk z={-2.2} /><Pedestrian position={[-2.2, 0, -2.2]} moving sceneId={id} playing={playing} reducedMotion={reducedMotion} /><DistanceMarkers start={4.5} count={5} color={COLORS.red} /></>}
      {id === "fatigue-drift" && <><mesh position={[-3.2, 0.08, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.18, 18]} /><meshBasicMaterial color={COLORS.red} /></mesh><mesh position={[3.2, 0.08, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.18, 18]} /><meshBasicMaterial color={COLORS.red} /></mesh></>}
      {id === "vulnerable-road-users" && <><Crosswalk z={0.4} /><Pedestrian position={[-2.4, 0, 0.4]} moving sceneId={id} playing={playing} reducedMotion={reducedMotion} /><MovingCar sceneId={`${id}-cycle`} playing={playing} reducedMotion={reducedMotion} color={COLORS.gold} motion={(t) => ({ x: 2.7, z: 5 - cycle(t, 7) * 1.45, yaw: 0 })} /></>}
      {id === "peer-pressure-risk" && <><MovingCar sceneId={`${id}-lead`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={(t) => ({ x: -1.55, z: 1.8 - cycle(t, 8) * 1.2, yaw: 0 })} /><PriorityRing position={[-1.55, 0.1, 2.8]} color={COLORS.red} scale={0.65} /></>}

      {id === "eco-smooth-driving" && <><DirectionArrow position={[-1.55, 0.1, -1]} color={COLORS.green} /><DistanceMarkers count={3} color={COLORS.green} /><mesh position={[4.2, 0.4, -2]}><sphereGeometry args={[0.5, 14, 10]} /><meshStandardMaterial color={COLORS.green} /></mesh></>}
      {id === "speed-emissions" && <><MovingCar sceneId={`${id}-fast`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={defaultMotion(id, 1.55, 2.8)} /><DistanceMarkers start={5} count={6} laneX={1.55} color={COLORS.red} /></>}
      {id === "exhaust-idling" && <><MovingCar sceneId={`${id}-still`} playing={false} reducedMotion color={COLORS.red} motion={() => ({ x: -1.55, z: 0, yaw: 0 })} /><mesh position={[-1.55, 0.7, 1.45]}><sphereGeometry args={[0.34, 12, 8]} /><meshStandardMaterial color="#8f969b" transparent opacity={0.48} /></mesh></>}

      {id === "tyre-tread" && <><mesh position={[-1.6, 0.7, -1]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.85, 0.85, 0.52, 24]} /><meshStandardMaterial color={COLORS.black} /></mesh>{[-0.45, -0.15, 0.15, 0.45].map((x) => <mesh key={x} position={[-1.6, 0.72, -1 + x]} rotation-x={Math.PI / 2}><boxGeometry args={[0.58, 0.08, 0.08]} /><meshStandardMaterial color={COLORS.snow} /></mesh>)}<CarModel color={COLORS.blue} /></>}
      {id === "brake-check" && <><DistanceMarkers start={4.5} count={5} laneX={1.6} color={COLORS.red} /><StopLine position={[-1.55, 0.08, -3.8]} color={COLORS.red} /></>}
      {id === "load-balance" && <><group position={[0, 0, -0.5]}><CarModel color={COLORS.gold} /><mesh position={[0, 1.25, 0.15]} castShadow><boxGeometry args={[1.6, 0.65, 1.35]} /><meshStandardMaterial color="#7a5932" /></mesh><PriorityRing position={[0, 0.1, 0.15]} color={COLORS.red} scale={0.55} /></group></>}

      {id === "motorway-allowed" && <><Sign type="motorway" position={[-6.5, 0, 5.5]} /><mesh position={[6.8, 0.08, 4.8]} rotation-x={-Math.PI / 2}><ringGeometry args={[0.75, 1.0, 32]} /><meshBasicMaterial color={COLORS.red} /></mesh></>}
      {id === "motorway-merge" && <><Sign type="motorway" position={[-6.4, 0, 6]} /><DirectionArrow position={[3.2, 0.1, 0.5]} rotation={-0.35} color={COLORS.green} /><MovingCar sceneId={`${id}-main`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={defaultMotion(id, -1.8, 1.9)} /></>}
      {id === "motorway-exit-lanes" && <><DirectionArrow position={[2.3, 0.1, -3.5]} rotation={-0.55} color={COLORS.gold} /><Sign type="info" position={[5.8, 0, -3.2]} /></>}
      {id === "motorway-stop-ban" && <><mesh position={[4.9, 0.08, -2]} rotation-x={-Math.PI / 2}><planeGeometry args={[1.2, 5.5]} /><meshBasicMaterial color={COLORS.roadEdge} /></mesh><Sign type="prohibition" position={[6.4, 0, 2.4]} /><mesh position={[5.2, 0.35, -3]}><coneGeometry args={[0.35, 0.7, 3]} /><meshStandardMaterial color={COLORS.red} /></mesh></>}

      {id === "overtake-left" && <><MovingCar sceneId={`${id}-slow`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={(t) => ({ x: -1.7, z: 2 - cycle(t, 8) * 0.9, yaw: 0 })} /><DirectionArrow position={[1.7, 0.1, 0.6]} color={COLORS.green} /></>}
      {id === "overtake-forbidden" && <><Sign type="no-overtake" position={[-5.2, 0, 4.5]} /><MovingCar sceneId={`${id}-meet`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={(t) => ({ x: 1.7, z: -7 + cycle(t, 8) * 1.6, yaw: Math.PI })} /><mesh position={[0, 0.08, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.2, 24]} /><meshBasicMaterial color={COLORS.yellowLine} /></mesh></>}
      {id === "overtake-return" && <><MovingCar sceneId={`${id}-slow`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={(t) => ({ x: -1.7, z: 1.5 - cycle(t, 8) * 0.9, yaw: 0 })} /><DirectionArrow position={[-1.7, 0.1, -4]} color={COLORS.green} /></>}

      {id === "stop-vs-park" && <><mesh position={[4.25, 0.5, 0.4]}><boxGeometry args={[0.7, 0.7, 0.12]} /><meshStandardMaterial color={COLORS.gold} /></mesh><PriorityRing position={[4.15, 0.1, -0.9]} color={COLORS.gold} scale={0.62} /></>}
      {id === "parking-distances" && <><StopLine position={[-1.55, 0.08, 2.2]} /><mesh position={[2.7, 0.08, -3.9]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.16, 4.8]} /><meshBasicMaterial color={COLORS.red} /></mesh><PriorityRing position={[4.15, 0.1, -3.5]} color={COLORS.red} scale={0.7} /></>}
      {id === "parking-main-road" && <><Sign type="priority" position={[-4.7, 0, 4.3]} /><Sign type="no-parking" position={[4.7, 0, 1.2]} /><PriorityRing position={[4.15, 0.1, -1]} color={COLORS.red} scale={0.7} /></>}

      {id === "low-beam-default" && <><LightCone position={[-1.55, 0.12, 2.1]} long={false} /><mesh position={[-1.55, 0.45, -4]}><boxGeometry args={[0.7, 0.9, 0.7]} /><meshStandardMaterial color={COLORS.gold} /></mesh></>}
      {id === "high-beam-dip" && <><MovingCar sceneId={`${id}-meet`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} lights motion={(t) => ({ x: 1.55, z: -6 + cycle(t, 8) * 1.45, yaw: Math.PI })} /><LightCone position={[-1.55, 0.12, 1.6]} long dim /><LightCone position={[1.55, 0.12, -1.6]} rotation={Math.PI} long dim /></>}
      {id === "sight-speed-night" && <><LightCone position={[-1.55, 0.12, 2.1]} long={false} /><DistanceMarkers start={3.8} count={4} laneX={-1.55} color={COLORS.red} /><mesh position={[-1.55, 0.45, -3.4]}><boxGeometry args={[0.7, 0.9, 0.7]} /><meshStandardMaterial color={COLORS.red} /></mesh></>}

      {id === "winter-tyres-friction" && <><DistanceMarkers start={4.6} count={5} laneX={1.6} color={COLORS.green} /><mesh position={[2.5, 0.08, -2]} rotation-x={-Math.PI / 2}><planeGeometry args={[2.4, 5.2]} /><meshBasicMaterial color={COLORS.snow} transparent opacity={0.55} /></mesh></>}
      {id === "winter-distance-smooth" && <><MovingCar sceneId={`${id}-lead`} playing={playing} reducedMotion={reducedMotion} color={COLORS.red} motion={defaultMotion("lead", -1.55, 1.0)} /><DistanceMarkers start={2.6} count={5} laneX={-1.55} color={COLORS.gold} /></>}
      {id === "hydroplaning-skid" && <><mesh position={[-1.55, 0.08, -0.8]} rotation-x={-Math.PI / 2}><planeGeometry args={[3.2, 4.8]} /><meshBasicMaterial color={COLORS.water} transparent opacity={0.5} /></mesh><DistanceMarkers start={3.6} count={4} color={COLORS.red} /></>}

      {id === "license-steps" && <ProcessNodes active={3} />}
      {id === "exam-validity" && <ProcessNodes active={2} />}
      {id === "probation-period" && <ProcessNodes active={1} />}
      {id === "driver-responsibility" && <><ProcessNodes active={3} /><Pedestrian position={[2.7, 0, -0.5]} sceneId={id} playing={playing} reducedMotion={reducedMotion} /><mesh position={[2.7, 0.5, 1.2]}><boxGeometry args={[0.9, 0.45, 0.8]} /><meshStandardMaterial color={COLORS.gold} /></mesh></>}
    </group>
  );
}

function SceneWorld(props: SceneProps) {
  const { scene } = props;
  const target = useMemo(() => new THREE.Vector3(...scene.focus), [scene.focus]);
  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    camera.position.lerp(new THREE.Vector3(...scene.camera), 1 - Math.exp(-3 * delta));
    camera.lookAt(target);
  });

  return (
    <>
      <RoadLayout scene={scene} />
      <SceneSpecifics {...props} />
    </>
  );
}

function StaticSceneFallback({ scene }: { scene: LessonSceneConfig }) {
  const winter = scene.weather === "winter";
  const night = scene.weather === "night";
  return (
    <div className="grid h-full min-h-64 place-items-center overflow-hidden bg-muted p-5 text-center">
      <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background/70">
        <div className={night ? "absolute inset-0 bg-slate-950" : winter ? "absolute inset-0 bg-sky-100" : "absolute inset-0 bg-emerald-100"} />
        <div className="absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 bg-muted-foreground/50" />
        {(scene.layout === "cross" || scene.layout === "roundabout" || scene.layout === "parking") && <div className="absolute left-0 top-1/2 h-24 w-full -translate-y-1/2 bg-muted-foreground/50" />}
        {scene.layout === "roundabout" && <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card" />}
        <div className="absolute left-[34%] top-[58%] h-8 w-16 rounded bg-primary shadow-sm" />
        <div className="absolute left-[55%] top-[42%] h-8 w-16 rounded bg-destructive shadow-sm" />
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-md bg-background/90 px-3 py-2 text-xs font-bold text-foreground shadow-sm">
          {scene.label}
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-md bg-background/90 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm">
          3D-vyn kan inte visas i den här webbläsaren.
        </div>
      </div>
    </div>
  );
}

export function LessonScene(props: SceneProps) {
  const [webGLStatus, setWebGLStatus] = useState<WebGLStatus>("checking");
  const night = props.scene.weather === "night";
  const winter = props.scene.weather === "winter";

  useEffect(() => {
    setWebGLStatus(browserSupportsWebGL() ? "supported" : "unsupported");
  }, []);

  if (webGLStatus !== "supported") return <StaticSceneFallback scene={props.scene} />;

  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={props.scene.camera} fov={44} />
      <color attach="background" args={[night ? COLORS.night : winter ? "#d9e9ed" : "#cfe3e9"]} />
      <fog attach="fog" args={[night ? COLORS.night : winter ? "#d9e9ed" : "#cfe3e9", 18, 36]} />
      <hemisphereLight args={[night ? "#536481" : "#e5f2ff", winter ? "#a8bcc1" : "#50614a", night ? 0.55 : 1.35]} />
      <directionalLight
        position={[7, 12, 6]}
        intensity={night ? 0.65 : 2.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {night && <pointLight position={[-1.6, 2.5, 1.5]} color="#fff0b8" intensity={2.2} distance={10} />}
      <SceneWorld {...props} />
      <Environment>
        <Lightformer intensity={1.5} position={[0, 8, 2]} scale={[12, 5, 1]} />
        <Lightformer intensity={0.8} color="#a9c9d3" position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>
    </Canvas>
  );
}
