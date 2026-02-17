/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      //allow all remote images hosts:
      {
        protocol: "https",
        hostname: "uthhrhkygpwqcytwblma.supabase.co",
      },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
