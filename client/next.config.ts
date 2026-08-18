import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      // Статический справочник лежит в public/spravochnik/, отдаём его index.html по короткому адресу
      { source: "/spravochnik", destination: "/spravochnik/index.html" },
    ];
  },
};

export default nextConfig;
