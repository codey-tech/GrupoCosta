"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Véu" — campo de luz que respira devagar, em WebGL.
 *
 * Não é decoração: a página não tem fotografia, então este é o único elemento
 * que dá profundidade e movimento ao fundo. Ele fica FIXO atrás de tudo, com
 * opacidade baixíssima, e muda de paleta conforme o capítulo (claro → escuro).
 *
 * Custo: um único plano de tela cheia, 3 gaussianas, 1 oitava de ruído.
 * Fallback: sem WebGL ou com prefers-reduced-motion, não monta — o fundo
 * chapado (papel/pedra) assume sozinho.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform vec3  uBase;   // fundo
  uniform vec3  uGlow;   // luz principal
  uniform vec3  uEdge;   // segunda luz, mais fria

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main(){
    vec2 p = vUv;
    p.x *= uAspect;

    float t = uTime * 0.055;

    // Deformação orgânica muito leve — evita bordas "perfeitas" de gradiente.
    float w = vnoise(vUv * 1.8 + t * 0.4);
    p += (w - 0.5) * 0.06;

    // Duas âncoras de luz em deriva lenta, uma terceira quase parada.
    vec2 a0 = vec2(0.30 * uAspect + 0.16 * uAspect * sin(t * 0.62),  0.28 + 0.14 * cos(t * 0.50));
    vec2 a1 = vec2(0.78 * uAspect + 0.14 * uAspect * cos(t * 0.43),  0.74 + 0.13 * sin(t * 0.57));
    vec2 a2 = vec2(0.52 * uAspect + 0.08 * uAspect * sin(t * 0.31),  0.52 + 0.09 * cos(t * 0.37));

    #define G(a, r) exp(-dot(p - (a), p - (a)) / ((r) * (r)))
    float w0 = G(a0, 0.62);
    float w1 = G(a1, 0.54);
    float w2 = G(a2, 0.88);

    vec3 col = uBase;
    col = mix(col, uGlow, clamp(w0 * 0.85, 0.0, 1.0));
    col = mix(col, uEdge, clamp(w1 * 0.70, 0.0, 1.0));
    col = mix(col, uGlow, clamp(w2 * 0.22, 0.0, 1.0));

    // Grão fino — mata banding em telas de 8 bits.
    float g = hash(gl_FragCoord.xy + t);
    col += (g - 0.5) * 0.016;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Paletas por capítulo. Claras primeiro, escura no capítulo "Estrutura". */
export const VEIL_PALETTES = {
  paper: { base: "#f1f0ec", glow: "#fdfdfb", edge: "#e2e0d9" },
  stone: { base: "#0c0c0b", glow: "#1a1a18", edge: "#080807" },
};

function toColor(hex) {
  return new THREE.Color(hex);
}

function Field({ palette }) {
  const { size } = useThree();
  const targets = useRef({
    base: toColor(palette.base),
    glow: toColor(palette.glow),
    edge: toColor(palette.edge),
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uBase: { value: toColor(palette.base) },
      uGlow: { value: toColor(palette.glow) },
      uEdge: { value: toColor(palette.edge) },
    }),
    // Paleta inicial só; as trocas acontecem por lerp no useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    targets.current = {
      base: toColor(palette.base),
      glow: toColor(palette.glow),
      edge: toColor(palette.edge),
    };
  }, [palette]);

  useEffect(() => {
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
  }, [size, uniforms]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    uniforms.uTime.value += d;
    // Transição suave entre paletas de capítulo.
    const k = Math.min(d * 2.2, 1);
    uniforms.uBase.value.lerp(targets.current.base, k);
    uniforms.uGlow.value.lerp(targets.current.glow, k);
    uniforms.uEdge.value.lerp(targets.current.edge, k);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * @param {{ palette?: keyof typeof VEIL_PALETTES, className?: string }} props
 */
export default function VeilCanvas({ palette = "paper", className = "" }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);

  if (!ok) return null;

  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Field palette={VEIL_PALETTES[palette] ?? VEIL_PALETTES.paper} />
    </Canvas>
  );
}
