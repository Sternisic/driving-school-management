import path from 'path';

const nextConfig = {
  experimental: {
    appDir: true, // Nutze den neuen App Router
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('src');
    return config;
  },
  reactStrictMode: false,
};

export default nextConfig;
