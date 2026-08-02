"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

type NodeDatum = {
  position: THREE.Vector3;
  label: string;
  isSkillNode: boolean;
};

function generateNodes(labels: string[]): NodeDatum[] {
  const nodes: NodeDatum[] = [];
  const radius = 3.2;

  // Skill nodes placed on a rough sphere shell (like an embedding cluster)
  labels.forEach((label, i) => {
    const phi = Math.acos(-1 + (2 * i) / labels.length);
    const theta = Math.sqrt(labels.length * Math.PI) * phi;
    nodes.push({
      position: new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi) * 0.8,
        radius * Math.cos(phi)
      ),
      label,
      isSkillNode: true,
    });
  });

  // Ambient filler nodes (unlabeled, smaller, denser field)
  for (let i = 0; i < 60; i++) {
    const v = new THREE.Vector3(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 9
    );
    nodes.push({ position: v, label: "", isSkillNode: false });
  }

  return nodes;
}

function Scene({ labels }: { labels: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const nodes = useMemo(() => generateNodes(labels), [labels]);

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const skillNodes = nodes.filter((n) => n.isSkillNode);
    const threshold = 4.2;

    for (let i = 0; i < skillNodes.length; i++) {
      for (let j = i + 1; j < skillNodes.length; j++) {
        const dist = skillNodes[i].position.distanceTo(skillNodes[j].position);
        if (dist < threshold) {
          positions.push(
            skillNodes[i].position.x,
            skillNodes[i].position.y,
            skillNodes[i].position.z,
            skillNodes[j].position.x,
            skillNodes[j].position.y,
            skillNodes[j].position.z
          );
        }
      }
    }
    return new Float32Array(positions);
  }, [nodes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.055;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.08;

    // gentle mouse parallax
    const targetX = (state.pointer.x * viewport.width) / 90;
    const targetY = (state.pointer.y * viewport.height) / 90;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.02;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7c6cf6"
          transparent
          opacity={0.16}
        />
      </lineSegments>

      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry
            args={[node.isSkillNode ? 0.065 : 0.028, 12, 12]}
          />
          <meshBasicMaterial
            color={node.isSkillNode ? "#a79bff" : "#45d9c8"}
            transparent
            opacity={node.isSkillNode ? 0.95 : 0.35}
          />
          {node.isSkillNode && (
            <Html
              distanceFactor={9}
              occlude={false}
              style={{ pointerEvents: "none" }}
            >
              <span className="font-mono-label text-[10px] text-violet-soft/80 whitespace-nowrap select-none">
                {node.label}
              </span>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
}

export default function LatentSpace({ labels }: { labels: string[] }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene labels={labels} />
      </Canvas>
    </div>
  );
}
