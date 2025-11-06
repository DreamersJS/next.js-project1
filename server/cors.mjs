export const CORS_OPTIONS = {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
};