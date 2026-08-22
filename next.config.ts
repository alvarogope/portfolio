import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    /* Next 16 only serves qualities named here (default [75]); 92 is for the
       hand-drawn Kaelum map, whose linework visibly softens at 75. */
    qualities: [75, 92],
  },
};

export default nextConfig;
