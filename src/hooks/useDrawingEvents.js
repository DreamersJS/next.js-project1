import throttle from 'lodash.throttle';
import { useState, useRef, useCallback } from 'react';

export const useDrawingEvents = ({
    canvasRef,
    tool,
    color,
    fillMode,
    socketRef,
    whiteboardId,
    redrawAllShapes,
    drawnShapesRef,
    drawShape,
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const currentStroke = useRef(null);

    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0) return; // only left click

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setStartPosition({ x, y });
        setCurrentPosition({ x, y });
        setIsDrawing(true);

        if (tool === 'pen' || tool === 'eraser') {
            currentStroke.current = {
                tool,
                color,
                points: [{ x, y }],
            };
        }
    }, [tool, color, canvasRef]);

    const handleMouseMove = useCallback(
        throttle((e) => {
            if (!isDrawing) return;

            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setCurrentPosition({ x, y });

            if (tool === 'pen' || tool === 'eraser') {
                currentStroke.current.points.push({ x, y });

                const ctx = canvas.getContext('2d');
                drawShape(ctx, currentStroke.current); // draw the line segment live
            } else {
                const shapeData = {
                    tool,
                    color,
                    fill: fillMode,
                    startX: startPosition.x,
                    startY: startPosition.y,
                    endX: x,
                    endY: y,
                };
                redrawAllShapes();
                const ctx = canvas.getContext('2d');
                drawShape(ctx, shapeData, true);
            }
        }, 50), // throttle delay in ms, adjust as needed
        [isDrawing, tool, color, fillMode, startPosition, redrawAllShapes, canvasRef]
    );

    const handleMouseUp = useCallback(() => {
        if (!isDrawing) return;

        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (tool === 'pen' || tool === 'eraser') {
            if (currentStroke.current) {
                drawShape(ctx, currentStroke.current);
                socketRef.current.emit('draw', { whiteboardId, shape: currentStroke.current });
                drawnShapesRef.current.push(currentStroke.current);
            }
            currentStroke.current = null;
        } else {
            const shapeData = {
                tool,
                color,
                fill: fillMode,
                startX: startPosition.x,
                startY: startPosition.y,
                endX: currentPosition.x,
                endY: currentPosition.y,
            };

            drawShape(ctx, shapeData);
            socketRef.current.emit('draw', { whiteboardId, shape: shapeData });
            drawnShapesRef.current.push(shapeData);
        }
    }, [isDrawing, tool, color, fillMode, startPosition, currentPosition, whiteboardId, canvasRef]);

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};
