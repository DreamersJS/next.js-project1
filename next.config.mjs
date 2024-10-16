// next.config.mjs
export default {
  experimental: {
    esmExternals: true, // Enable ESM support for external packages
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, path: false }; // Avoids path issues with server-side modules
    return config;
  },
};
