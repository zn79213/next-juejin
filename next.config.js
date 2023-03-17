/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {key: "Access-Control-Allow-Origin", value: "http://127.0.0.1:3000"},
                    {key: "Access-Control-Allow-Methods", value: "*"},
                    {key: "Access-Control-Allow-Headers", value: "*"},
                ]
            },

        ]
    },
    // compiler: {
    //   styledComponents: true,
    // },
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: 'http',
    //       hostname: '127.0.0.1',
    //       port: '1337',
    //       pathname: '/upload/**',
    //     },
    //   ],
    // },
}
module.exports = nextConfig
