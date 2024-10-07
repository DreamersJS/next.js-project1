import { useEffect, useRef, useState } from 'react';
import { useSocketConnection } from '@/app/hooks/useSocket';

const useCanvas = (whiteboardId, user, tool, color, fillMode, drawnShapes) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const currentPathRef = useRef([]);
  let previewCounter = 0;
  const granularity = 5;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  const socketRef = useSocketConnection(socketUrl, user);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set ARIA attributes on canvas for accessibility
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Interactive whiteboard session ID: ${whiteboardId}`);

    if (!socketRef.current) {
      console.error("Socket is not defined.");
      return;
    }

    // Socket event listeners
    const initDrawingsListener = (shapes) => {
      redrawAllShapes(shapes, context);
    };

    const drawListener = (shape) => {
      setDrawnShapes((prevShapes) => [...prevShapes, shape]);
      drawShape(context, shape); // Draw the shape on the canvas
    };

    const previewDrawListener = (shape) => {
      drawShape(context, shape, true); // Preview draw without finalizing
    };

    const clearListener = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnShapes([]); // Clear local state
    };

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      redrawAllShapes(drawnShapes, context); // Redraw shapes if needed
    };

    // Function to redraw all shapes and pen strokes
    const redrawAllShapes = (shapes, ctx) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((shape) => {
        drawShape(ctx, shape);
      });
    };

    // Function to draw shapes
    const drawShape = (ctx, shape, preview = false) => {
      ctx.beginPath();
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.tool === 'pen' || shape.tool === 'line' ? 2 : 1;

      switch (shape.tool) {
        case 'line':
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          ctx.stroke();
          break;
        case 'rectangle':
          if (shape.fill) {
            ctx.fillRect(
              shape.startX,
              shape.startY,
              shape.endX - shape.startX,
              shape.endY - shape.startY
            );
          } else {
            ctx.strokeRect(
              shape.startX,
              shape.startY,
              shape.endX - shape.startX,
              shape.endY - shape.startY
            );
          }
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2)
          );
          ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
          if (shape.fill) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;
        case 'triangle':
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          ctx.lineTo(shape.startX, shape.endY);
          ctx.closePath();
          if (shape.fill) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;
        case 'pen':
        case 'eraser':
          ctx.lineWidth = shape.tool === 'eraser' ? 10 : 2;
          ctx.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : shape.color;
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          ctx.stroke();
          break;
        default:
          break;
      }

      if (!preview) {
        ctx.closePath();
      }
    };

    // Mouse event handlers
    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPosition({ x, y });
      setCurrentPosition({ x, y });
      setIsDrawing(true);

      if (tool === 'pen' || tool === 'eraser') {
        context.lineWidth = tool === 'eraser' ? 10 : 2;
        context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        context.beginPath();
        context.moveTo(x, y);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPosition({ x, y });

      if (tool === 'pen' || tool === 'eraser') {
        if (previewCounter % granularity === 0) {
          context.lineTo(x, y);
          context.stroke();

          const previewData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
          currentPathRef.current.push(previewData);
          socketRef.current.emit('previewDraw', previewData);

          setStartPosition({ x, y });
        }
        previewCounter++;
        context.lineTo(x, y);
        context.stroke();

        const shapeData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
        setDrawnShapes((prevShapes) => [...prevShapes, shapeData]);
        socketRef.current.emit('draw', shapeData);
        setStartPosition({ x, y });
      } else {
        redrawAllShapes(drawnShapes, context);
        drawShape(context, {
          tool,
          color,
          fill: fillMode,
          startX: startPosition.x,
          startY: startPosition.y,
          endX: x,
          endY: y,
        }, true);
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      const x = currentPosition.x;
      const y = currentPosition.y;

      const shapeData = {
        tool,
        color,
        fill: fillMode,
        startX: startPosition.x,
        startY: startPosition.y,
        endX: x,
        endY: y,
      };

      setDrawnShapes((prevShapes) => [...prevShapes, shapeData]);
      socketRef.current.emit('draw', shapeData);

      // Emit each pen segment as a draw event (finalize all segments of this stroke)
      currentPathRef.current.forEach((segment) => {
        socketRef.current.emit('draw', segment);
        setDrawnShapes((prevShapes) => [...prevShapes, segment]);
      });

      // Clear the ref after finalizing
      currentPathRef.current = [];

      setIsDrawing(false);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Cleanup on component unmount
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);

      // Remove socket listeners
      socketRef.current.off('initDrawings', initDrawingsListener);
      socketRef.current.off('draw', drawListener);
      socketRef.current.off('previewDraw', previewDrawListener);
      socketRef.current.off('clear', clearListener);
    };
  }, [tool, drawnShapes, color, fillMode, socketRef]);

  return {
    canvasRef,
    setDrawnShapes,
  };
};

export default useCanvas;
