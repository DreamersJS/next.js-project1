export const chatSocketHandler = (io, socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('message', (data) => {
        const { roomId, username, text } = data;
        if (!roomId) return;
        io.to(roomId).emit('message', { username, text });
    });
};
//Add server-side validation and rate limiting (to prevent spam or malformed data).