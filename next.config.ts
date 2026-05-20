import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Birden fazla lockfile olduğunda Next'in workspace kökünü
  // doğru proje klasörüne sabitler.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
