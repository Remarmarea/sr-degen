/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nextConfig = {
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname
    }
};

export default nextConfig;
