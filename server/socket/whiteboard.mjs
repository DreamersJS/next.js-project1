export const whiteboardSocketHandler = (io, socket, whiteboardData) => {
    socket.on('previewDraw', (whiteboardId, data) => {
        socket.to(whiteboardId).broadcast.emit('previewDraw', data);
    });

    socket.on('mousemove', (whiteboardId, data) => {
        socket.to(whiteboardId).broadcast.emit('mousemove', data);
    });

    socket.on('join', (whiteboardId) => {
        if (!socket.rooms.has(whiteboardId)) {
            socket.join(whiteboardId);
        }
        if (!whiteboardData.has(whiteboardId)) {
            whiteboardData.set(whiteboardId, {
                drawnShapes: [],
                undoStack: [],
                redoStack: [],
            });
        }
        const board = whiteboardData.get(whiteboardId);
        if (board) {
            // Send the current drawnShapes to the newly joined client
            socket.emit('initDrawings', board.drawnShapes || []);
        }
    });

    socket.on('leave', (whiteboardId) => {
        socket.leave(whiteboardId);
    });

    socket.on('draw', ({ whiteboardId, shape }) => {
        if (!whiteboardData.has(whiteboardId)) {
            whiteboardData.set(whiteboardId, {
                drawnShapes: [],
                undoStack: [],
                redoStack: [],
                content: "",
            });
        }
        const board = whiteboardData.get(whiteboardId);
        if (!board) return;

        board.undoStack.push(shape);
        board.redoStack = [];
        board.drawnShapes.push(shape);

        io.to(whiteboardId).emit('draw', shape);
    });

    socket.on('clear', (whiteboardId) => {
        const board = whiteboardData.get(whiteboardId);
        if (!board) return;

        board.drawnShapes = [];
        board.undoStack = [];
        board.redoStack = [];

        io.to(whiteboardId).emit('clear');
    });

    socket.on('undo', (whiteboardId) => {
        const board = whiteboardData.get(whiteboardId);
        if (!board) return;

        if (board.undoStack.length > 0) {
            const shape = board.undoStack.pop();
            board.redoStack.push(shape);
            board.drawnShapes = board.undoStack.slice();

            io.to(whiteboardId).emit('initDrawings', board.drawnShapes.filter(Boolean));
        }
    });

    socket.on('redo', (whiteboardId) => {
        const board = whiteboardData.get(whiteboardId);
        if (!board) return;

        if (board.redoStack.length > 0) {
            const shape = board.redoStack.pop();
            board.undoStack.push(shape);
            board.drawnShapes.push(shape);

            io.to(whiteboardId).emit('draw', shape);
        }
    });

    socket.on('loadImage', (whiteboardId, imageData) => {
        const imageShape = {
            tool: 'image',
            ...imageData
        };

        const board = whiteboardData.get(whiteboardId);
        if (!board) return;

        board.drawnShapes.push(imageShape);
        board.undoStack.push(imageShape);
        board.redoStack = [];

        io.to(whiteboardId).emit('draw', imageShape)
    });
};
// Persist whiteboard data (e.g., in Redis or a DB) so it’s not lost on server restart.