// next.config.mjs
export default {
  experimental: {
    esmExternals: true, // Enable ESM support for external packages
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, path: false }; // Avoids path issues with server-side modules
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ]
  },
  optimizeFonts: true, // Ensure font and CSS optimization is ON
  compress: true, // Gzip and Brotli compression
};
