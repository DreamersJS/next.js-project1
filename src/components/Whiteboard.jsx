"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { useSocketConnection } from '@/context/SocketProvider';
import { useResizeCanvas } from '@/hooks/useResizeCanvas';
import { useRedrawAllShapes } from '@/hooks/useRedrawAllShapes';
import { drawShape } from '@/services/drawService';
import { useDrawingEvents } from '@/hooks/useDrawingEvents';
import { useUser } from '@/hooks/useUser';
import WhiteboardControls from './WhiteboardControls';
import { clearCanvas } from '@/services/canvasService';

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const drawnShapesRef = useRef([]);
  const { user } = useUser();

  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  const [socketUrl, setSocketUrl] = useState(null);
  const socketRef = useSocketConnection();
  const imageCache = useRef(new Map());

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        setSocketUrl(data.socketUrl);
      } catch (err) {
        console.error('Failed to fetch socket URL:', err);
      }
    };
    fetchConfig();
  }, []);

  const redrawAllShapes = useRedrawAllShapes(canvasRef, drawnShapesRef, imageCache);
  const throttledResizeCanvas = useResizeCanvas(canvasRef, redrawAllShapes);
  const stableDrawShape = useCallback(drawShape, []);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingEvents({
    canvasRef,
    tool,
    color,
    fillMode,
    socketRef,
    whiteboardId,
    redrawAllShapes,
    drawnShapesRef,
    drawShape: stableDrawShape,
  });

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
        // For normal shapes, just draw immediately (optional optimization) 
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

    // Observe the parent container for any size changes
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

  const handleClear = async () => {
    clearCanvas(canvasRef)
    drawnShapesRef.current = [];
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Drawing tools and Save, Load, Delete buttons */}
        <WhiteboardControls
          onClear={handleClear}
          setTool={setTool}
          setColor={setColor}
          setFillMode={setFillMode}
          whiteboardId={whiteboardId}
          user={user}
          socketRef={socketRef}
          canvasRef={canvasRef}
          drawnShapesRef={drawnShapesRef}
          redrawAllShapes={redrawAllShapes}
        />
        {/* Canvas */}
        <div className="flex grow w-full h-full overflow-hidden p-0 items-center justify-center">
          <canvas ref={canvasRef} className="border bg-white w-full h-full"></canvas>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;