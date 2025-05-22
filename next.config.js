/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cevoid-dev-storage.b-cdn.net',
			},
		],
	},
};

module.exports = nextConfig;
