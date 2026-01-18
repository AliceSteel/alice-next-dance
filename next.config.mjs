/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      //allow all remote images hosts:
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
