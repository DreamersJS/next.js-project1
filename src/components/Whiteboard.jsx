"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DrawingTools from './DrawingTools';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { deleteWhiteboard, loadWhiteboardImage, loadWhiteboardImageById, saveWhiteboardAsImage } from "@/services/whiteboardService";
import { drawLine, drawRectangle, drawCircle, drawTriangle } from "@/services/drawService";
import { clearCanvas } from "@/services/canvasService";
import { useSocketConnection } from '@/context/SocketProvider';

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const drawnShapesRef = useRef([]);
  const router = useRouter();
  const user = useRecoilValue(userState);

  // State variables
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  const socketRef = useSocketConnection();
  const currentStroke = useRef(null)
  const previousWhiteboardIdRef = useRef(null);

  if (!socketUrl) return;

  const drawShape = useCallback((ctx, shape, preview = false) => {
    if (!shape) return;
    ctx.beginPath();
    ctx.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape.tool === 'eraser' ? 10 : 2;

    switch (shape.tool) {
      case 'line':
        drawLine(ctx, shape);
        break;
      case 'rectangle':
        drawRectangle(ctx, shape);
        break;
      case 'circle':
        drawCircle(ctx, shape);
        break;
      case 'triangle':
        drawTriangle(ctx, shape);
        break;
      case 'pen':
      case 'eraser':
        ctx.beginPath();
        ctx.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : shape.color;
        ctx.lineWidth = shape.tool === 'eraser' ? 10 : 2;

        const points = shape.points;
        if (points.length > 1) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
        break;
      case 'image':
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, shape.startX, shape.startY, shape.width, shape.height);
        };
        img.src = shape.src;
        break;
      default:
        break;
    }

    if (!preview) ctx.closePath();
  }, []);

  const redrawAllShapes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    clearCanvas(canvasRef);

    // Separate image shapes and other shapes
    const imageShapes = drawnShapesRef.current.filter(shape => shape && shape.tool === 'image');
    const otherShapes = drawnShapesRef.current.filter(shape => shape && shape.tool !== 'image');

    // Helper to load image and return Promise with loaded img element
    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });

    // Load all images first
    Promise.all(imageShapes.map(shape => loadImage(shape.src))).then(images => {
      // Draw all images
      images.forEach((img, i) => {
        const shape = imageShapes[i];
        ctx.drawImage(img, shape.startX, shape.startY, shape.width, shape.height);
      });

      // Draw all other shapes on top
      otherShapes.forEach(shape => drawShape(ctx, shape));
    });
  }, [drawShape]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const { width, height } = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      redrawAllShapes();
    }
  }, [redrawAllShapes]);

  useEffect(() => {
    if (!socketRef.current || !whiteboardId) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Leave previous whiteboard room if any
    console.log('Switching rooms:', {
      prev: previousWhiteboardIdRef.current,
      next: whiteboardId,
    });

    if (previousWhiteboardIdRef.current !== whiteboardId) {
      if (previousWhiteboardIdRef.current) {
        socketInstance.emit('leave', previousWhiteboardIdRef.current);
        console.log(`Emit Left whiteboard session with ID: ${previousWhiteboardIdRef.current}`);
      }

      socketRef.current.emit('join', whiteboardId);
      console.log(`Emit Joined whiteboard session with ID: ${whiteboardId}`);
      previousWhiteboardIdRef.current = whiteboardId; // Update the reference
    }

    const handleInit = (shapes) => {
      if (!Array.isArray(shapes)) {
        console.warn('initDrawings received invalid shapes:', shapes);
        return;
      }
      drawnShapesRef.current = shapes;
      setDrawnShapes(shapes);
      redrawAllShapes();
      drawShape(shapes);
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
      clearCanvas(canvasRef);
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
        console.log(`Emit Left (unmount) whiteboard session with ID: ${whiteboardId}`);
      }
      previousWhiteboardIdRef.current = null;  // Reset ref on unmount
    
      socketRef.current.off('initDrawings', handleInit);
      socketRef.current.off('draw', handleDraw);
      socketRef.current.off('previewDraw', handlePreviewDraw);
      socketRef.current.off('clear', handleClear);
    };
  }, [socketRef, whiteboardId, redrawAllShapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Interactive whiteboard session ID: ${whiteboardId}`);

    if (!socketRef.current) {
      console.error("Socket is not defined.");
      return;
    }

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only respond to left-click
      const canvas = canvasRef.current;
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
          points: [{ x, y }]
        };
      } else {
        setStartPosition({ x, y });
      }
    };

    const handleMouseMove = (e) => {
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
        setCurrentPosition({ x, y });
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
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const ctx = canvasRef.current.getContext('2d');

      if (tool === 'pen' || tool === 'eraser') {
        if (currentStroke.current) {
          drawShape(ctx, currentStroke.current);
          socketRef.current.emit('draw', { whiteboardId, shape: currentStroke.current });
          drawnShapesRef.current.push(currentStroke.current);
          setDrawnShapes([...drawnShapesRef.current]);
        }
        currentStroke.current = null;
      } else {
        const shapeData = {
          tool, color, fill: fillMode,
          startX: startPosition.x, startY: startPosition.y,
          endX: currentPosition.x, endY: currentPosition.y,
        };

        drawShape(ctx, shapeData);
        socketRef.current.emit('draw', { whiteboardId, shape: shapeData });
        drawnShapesRef.current.push(shapeData);
        setDrawnShapes([...drawnShapesRef.current]);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    resizeCanvas(canvasRef);

    // Observe the parent container for any size changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas(canvasRef);
    });
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      resizeObserver.disconnect();
    };
  }, [tool, isDrawing, startPosition, currentPosition, color, fillMode, socketRef]);

  const handleToolChange = (newTool) => setTool(newTool);
  const handleColorChange = (newColor) => setColor(newColor);
  const handleFillToggle = (fillStatus) => setFillMode(fillStatus);

  const handleUndo = () => { socketRef.current.emit('undo', whiteboardId) };
  const handleRedo = () => { socketRef.current.emit('redo', whiteboardId) };

  const handleClear = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the board? This will clear the board for everyone!");
    if (confirmClear) {
      clearCanvas(canvasRef)
      setDrawnShapes([]);
      drawnShapesRef.current = [];
      socketRef.current.emit('clear', whiteboardId);
    } else {
      console.error("Error clearing the board.");
    }
  };

  const handleSaveAsImage = async () => {
    try {
      await saveWhiteboardAsImage(canvasRef.current, whiteboardId, user.uid)
    } catch (error) {
      console.error('Error saving whiteboard image:', error);
    }
  };

  const handleLoad = async (whiteboardId) => {
    try {
      const data = await loadWhiteboardImageById(whiteboardId);

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
            <button onClick={handleSaveAsImage} className="px-4 py-2 mt-2 border rounded bg-blue-500 text-white">
              Save
            </button>
            <button onClick={() => handleLoad(whiteboardId)} className="px-4 py-2 mt-2 border rounded bg-blue-500 text-white">
              Load
            </button>
          </div>)}
          <div className='flex flex-col'>
            <button onClick={() => handleDeleteWhiteboard(whiteboardId)} className="px-4 py-2 mt-2 border rounded bg-red-500 text-white">
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