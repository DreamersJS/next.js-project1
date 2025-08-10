"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DrawingTools from './DrawingTools';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { useSocketConnection } from '@/context/SocketProvider';
import { useResizeCanvas } from '@/hooks/useResizeCanvas';
import { useRedrawAllShapes } from '@/hooks/useRedrawAllShapes';
import { drawShape } from '@/services/drawService';
import { useDrawingEvents } from '@/hooks/useDrawingEvents';

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const drawnShapesRef = useRef([]);
  const router = useRouter();
  const user = useRecoilValue(userState);

  const [tool, setTool] = useState('pen');
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  const socketRef = useSocketConnection();
  const imageCache = useRef(new Map());

  const drawFunctionsRef = useRef({
    drawLine: () => { },
    drawRectangle: () => { },
    drawCircle: () => { },
    drawTriangle: () => { },
  });
  const canvasFn = useRef({
    clearCanvasFn: () => { },
    // saveAsImageFn: () => Promise.resolve(),
    // loadImageFn: () => Promise.resolve({}),
    // deleteFn: () => Promise.resolve(),
  });

  let whiteboardServiceModule;

  const getWhiteboardService = async () => {
    if (!whiteboardServiceModule) {
      whiteboardServiceModule = await import('@/services/whiteboardService');
    }
    return whiteboardServiceModule;
  };

  if (!socketUrl) return <div>Socket URL is not configured.</div>;

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const [drawService, canvasService, whiteboardService] = await Promise.all([
          import('@/services/drawService'),
          import('@/services/canvasService'),
          import('@/services/whiteboardService'),
        ]);

        if (!isMounted) return;

        drawFunctionsRef.current = {
          drawLine: drawService.drawLine,
          drawRectangle: drawService.drawRectangle,
          drawCircle: drawService.drawCircle,
          drawTriangle: drawService.drawTriangle,
        };

        canvasFn.current = {
          clearCanvasFn: canvasService.clearCanvas,
          // saveAsImageFn: whiteboardService.saveWhiteboardAsImage,
          // loadImageFn: whiteboardService.loadWhiteboardImageById,
          // deleteFn: whiteboardService.deleteWhiteboard,
        };
      } catch (error) {
        console.error('Failed to load whiteboard services:', error);
        alert('Failed to load drawing tools. Please refresh the page or try again later.');
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
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
      setDrawnShapes(shapes);
      redrawAllShapes();
      // shapes.forEach(shape => drawShape(context, shape));
    };

    const handleDraw = (shape) => {
      drawnShapesRef.current.push(shape);
      setDrawnShapes([...drawnShapesRef.current]);

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

    const handleClear = () => {
      canvasFn.current.clearCanvasFn(canvasRef);
      drawnShapesRef.current = [];
      setDrawnShapes([]);
    };

    socketRef.current.on('initDrawings', handleInit);
    socketRef.current.on('draw', handleDraw);
    socketRef.current.on('previewDraw', handlePreviewDraw);
    socketRef.current.on('clear', handleClear);

    return () => {
      if (whiteboardId) {
        socketRef.current.emit('leave', whiteboardId);
      }

      socketRef.current.off('initDrawings', handleInit);
      socketRef.current.off('draw', handleDraw);
      socketRef.current.off('previewDraw', handlePreviewDraw);
      socketRef.current.off('clear', handleClear);
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

  const handleToolChange = (newTool) => setTool(newTool);
  const handleColorChange = (newColor) => setColor(newColor);
  const handleFillToggle = (fillStatus) => setFillMode(fillStatus);

  const handleUndo = () => { socketRef.current.emit('undo', whiteboardId) };
  const handleRedo = () => { socketRef.current.emit('redo', whiteboardId) };

  const handleClear = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the board? This will clear the board for everyone!");
    if (confirmClear) {
      canvasFn.current.clearCanvasFn(canvasRef)
      setDrawnShapes([]);
      drawnShapesRef.current = [];
      socketRef.current.emit('clear', whiteboardId);
    } else {
      console.error("Error clearing the board.");
    }
  };

  const handleSaveAsImage = async () => {
    try {
      const { saveWhiteboardAsImage } = await getWhiteboardService();
      await saveWhiteboardAsImage(canvasRef.current, whiteboardId, user.uid);
      // await canvasFn.current.saveAsImageFn(canvasRef.current, whiteboardId, user.uid)
    } catch (error) {
      console.error('Error saving whiteboard image:', error);
    }
  };

  const handleLoad = async (whiteboardId) => {
    try {
      const { loadWhiteboardImageById } = await getWhiteboardService();
      const data = await loadWhiteboardImageById(whiteboardId);
      // const data = await canvasFn.current.loadImageFn(whiteboardId);

      if (data.content) {
        const imageShape = {
          tool: 'image',
          src: data.content,
          startX: 0,
          startY: 0,
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        };

        drawnShapesRef.current = [...(drawnShapesRef.current || []), imageShape];
        setDrawnShapes([...drawnShapesRef.current]);

        // Notify others
        socketRef.current.emit('loadImage', whiteboardId, imageShape);

        // Redraw all shapes including image properly
        redrawAllShapes();
        alert('Whiteboard loaded successfully!');
      } else {
        alert('Failed to load the whiteboard.');
      }
    } catch (error) {
      console.error('Error loading whiteboard:', error);
    }
  };

  const handleDeleteWhiteboard = async (whiteboardId) => {
    if (confirm('Are you sure you want to delete this whiteboard?')) {
      try {
        // const { deleteWhiteboard } = await import('@/services/whiteboardService');
        const { deleteWhiteboard } = await getWhiteboardService();
        await deleteWhiteboard(whiteboardId, user.uid);
        router.push(`/`);
      } catch (error) {
        console.error('Error deleting whiteboard:', error);
      }
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Drawing tools and Save, Load, Delete buttons */}
        <div className="w-44 bg-gray-200 p-2 border-r border-gray-300">
          <DrawingTools
            onToolChange={handleToolChange}
            onClear={handleClear}
            onColorChange={handleColorChange}
            onFillToggle={handleFillToggle}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
          {user?.role === 'registered' && (<div className='flex flex-row'>
            <button onClick={handleSaveAsImage} className="px-4 py-2 mt-2 border rounded bg-blue-700 text-white">
              Save
            </button>
            <button onClick={() => handleLoad(whiteboardId)} className="px-4 py-2 mt-2 border rounded bg-blue-700 text-white">
              Load
            </button>
          </div>)}
          <div className='flex flex-col'>
            <button onClick={() => handleDeleteWhiteboard(whiteboardId)} className="px-4 py-2 mt-2 border rounded bg-red-600 text-white">
              Delete
            </button>
          </div>
        </div>
        {/* Canvas */}
        <div className="flex grow w-full h-full overflow-hidden p-0 items-center justify-center">
          <canvas ref={canvasRef} className="border bg-white w-full h-full"></canvas>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;