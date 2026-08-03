/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Sem bfcache: voltar/avançar restaurava o JS congelado e as animações
  // (hover da home, GSAP, Lenis) não remontavam. Assets em `/_next/` e
  // arquivos com extensão (imagens, etc.) ficam de fora.
  async headers() {
    return [
      {
        source: "/((?!_next/|.*\\..*).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
