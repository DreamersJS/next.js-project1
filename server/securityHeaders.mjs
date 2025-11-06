export const securityHeaders = {
    'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://*.firebaseio.com https://*.firebaseapp.com https://*.firebasedatabase.app https://apis.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https://*.googleusercontent.com https://*.firebaseapp.com https://api.dicebear.com https://images.pexels.com;
        connect-src 'self' https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss:;
        font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
        frame-src 'self' https://*.firebaseio.com https://*.firebasedatabase.app https://*.firebaseapp.com https://www.gstatic.com;
      `.replace(/\s{2,}/g, ' ').trim(),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
};