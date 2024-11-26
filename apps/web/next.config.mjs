import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '.prisma/client': join(__dirname, 'node_modules/.prisma/client'),
    },
  },
};

export default nextConfig;
