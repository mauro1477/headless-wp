export async function headers() {
    return [{
        source: '/(.*)',
        headers: [
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
            // Add CSP later when you know all sources (scripts, frames, images)
        ],
    }];
}
export const images = { remotePatterns: [{ protocol: 'http', hostname: 'localhost' }, { protocol: 'http', hostname: 'nginx' }] };
