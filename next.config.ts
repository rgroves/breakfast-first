import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.md": {
        loaders: [
          {
            loader: "raw-loader",
            options: { esModule: true },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
