export const chatSocketHandler = (io, socket) => {
    console.log('hey');
    socket.on('joinRoom', (roomId) => {
        console.log('joinRoom received:', roomId);
        socket.join(roomId);
        console.log('joined room');
    });

    socket.on('message', (data) => {
        console.log('message received:', data);
        const { roomId, username, text } = data;
        if (!roomId) {
            console.log('Chat message rejected: missing roomId');
            return;
        }

        io.to(roomId).emit('message', { username, text });
    });
};
//Add server-side validation and rate limiting (to prevent spam or malformed data).