/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  // mongodb must stay a server-only external package
  serverExternalPackages: ['mongodb'],
};

export default nextConfig;
