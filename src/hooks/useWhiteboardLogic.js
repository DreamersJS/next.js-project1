"use client";
import { useEffect } from 'react';
import { drawShape } from '@/services/drawService';
import { clearCanvas } from '@/services/canvasService';

export const useWhiteboardLogic = ({ socketRef, handleMouseDown, handleMouseMove, handleMouseUp, throttledResizeCanvas, whiteboardId, canvasRef, drawnShapesRef, redrawAllShapes }) => {
    const handleClear = async () => {
        clearCanvas(canvasRef)
        drawnShapesRef.current = [];
    };

    useEffect(() => {
        if (!socketRef.current || !whiteboardId) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        socketRef.current.emit('join', whiteboardId);

        const handleInit = (shapes) => {
            if (!Array.isArray(shapes)) {
                console.warn('initDrawings received invalid shapes:', shapes);
                return;
            }
            drawnShapesRef.current = shapes;
            redrawAllShapes();
        };

        const handleDraw = (shape) => {
            drawnShapesRef.current.push(shape);

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (shape.tool === 'image') {
                // For images, just call redrawAllShapes to ensure loading order & redraw consistency
                redrawAllShapes();
            } else {
                drawShape(context, shape);
            }
        };

        const handlePreviewDraw = (shape) => {
            drawShape(context, shape, true);
        };

        socketRef.current.on('initDrawings', handleInit);
        socketRef.current.on('draw', handleDraw);
        socketRef.current.on('previewDraw', handlePreviewDraw);
        socketRef.current.on("clear", handleClear);
        return () => {
            if (whiteboardId) {
                socketRef.current.emit('leave', whiteboardId);
            }

            socketRef.current.off('initDrawings', handleInit);
            socketRef.current.off('draw', handleDraw);
            socketRef.current.off('previewDraw', handlePreviewDraw);
            socketRef.current.off("clear", handleClear);
        };
    }, [socketRef, whiteboardId, redrawAllShapes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `Interactive whiteboard session ID: ${whiteboardId}`);

        if (!socketRef.current) {
            console.error("Socket is not defined.");
            return;
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        throttledResizeCanvas();

        const resizeObserver = new ResizeObserver(() => {
            throttledResizeCanvas();
        });
        if (canvas && canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            if (handleMouseMove.cancel) handleMouseMove.cancel();
            if (throttledResizeCanvas.cancel) throttledResizeCanvas.cancel();
            canvas.removeEventListener('mouseup', handleMouseUp);
            resizeObserver.disconnect();
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, throttledResizeCanvas, whiteboardId, socketRef]);

    return { handleClear };
}