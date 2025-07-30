// components/Whiteboard.jsx
"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { useSocketConnection } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';
import DrawingTools from './DrawingTools';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { deleteWhiteboard, saveWhiteboardAsImage } from "@/services/whiteboardService";
import { drawLine, drawRectangle, drawCircle, drawTriangle } from "@/services/drawService";
import { clearCanvas } from "@/services/canvasService";

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const drawnShapesRef = useRef([]);
  const router = useRouter();
  const user = useRecoilValue(userState);
  const previewCounterRef = useRef(0);

  // State variables
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  const granularity = 5;
  const currentPathRef = useRef([]);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
  if (!socketUrl) {
    console.error('Socket URL is undefined');
    return;
  }
  const socketRef = useSocketConnection(socketUrl, user);

  // Function to draw shapes
  // React requires hooks and hook-dependent functions (like drawShape with useCallback) to be declared before useEffect if used inside it.Draw shape is stable and won't cause unexpected re-renders or stale values inside useEffect.Prevents lint errors like: React Hook “useEffect” has a missing dependency if it's defined after useEffect but used within it.
  const drawShape = useCallback((ctx, shape, preview = false) => {
    ctx.beginPath();
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape.tool === 'pen' || shape.tool === 'line' ? 2 : 1;

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
        ctx.lineWidth = shape.tool === 'eraser' ? 10 : 2;
        ctx.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : shape.color;
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;
      case 'image':
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, shape.startX, shape.startY, shape.width, shape.height);
        };
        img.src = shape.src;  // Use the base64 image data
        break;
      default:
        break;
    }

    if (!preview) {
      ctx.closePath();
    }
  }, [drawLine, drawRectangle, drawCircle, drawTriangle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Interactive whiteboard session ID: ${whiteboardId}`);

    if (!socketRef.current) {
      console.error("Socket is not defined.");
      return;
    }

    const handleInit = (shapes) => {
      setDrawnShapes(shapes);
      drawnShapesRef.current = shapes;
      redrawAllShapes();
    };

    const handleDraw = (shape) => {
      setDrawnShapes(prev => {
        const updated = [...prev, shape];
        drawnShapesRef.current = updated;
        return updated;
      });
      drawShape(context, shape);
    };

    socketRef.current.on('initDrawings', handleInit);
    socketRef.current.on('draw', handleDraw);

    socketRef.current.on('previewDraw', (shape) => {
      drawShape(context, shape, true);
    });

    socketRef.current.on('clear', () => {
      clearCanvas(canvasRef);
      setDrawnShapes([]);
    });

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only respond to left-click
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPosition({ x, y });
      setCurrentPosition({ x, y });
      setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing || e.button !== 0) return; // Ignore if not drawing or not left-click

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPosition({ x, y });

      if (tool === 'pen' || tool === 'eraser') {
        if (previewCounterRef.current % granularity === 0) {
          const previewData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
          currentPathRef.current.push(previewData);
          socketRef.current.emit('previewDraw', previewData);
          setStartPosition({ x, y });
        }
        previewCounterRef.current++;//  In React useRef, .current is how you access the mutable value. The ref object itself (e.g., previewCounterRef) is constant and shouldn't be reassigned. Always use .current when reading or updating the value.
        context.lineTo(x, y);
        context.stroke();

        const shapeData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
        setDrawnShapes((prevShapes) => [...prevShapes, shapeData]);
        socketRef.current.emit('draw', shapeData);
        setStartPosition({ x, y });
      } else {
        redrawAllShapes();
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

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    // window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Observe the parent container for any size changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (canvas && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    // Cleanup on component unmount
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();

      // Remove socket listeners
      socketRef.current.off('initDrawings');
      socketRef.current.off('draw');
      socketRef.current.off('previewDraw');
      socketRef.current.off('clear');
    };
  }, [tool, isDrawing, startPosition, currentPosition, drawnShapes, color, fillMode, socketRef]);

  const redrawAllShapes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    clearCanvas(canvasRef);
    drawnShapesRef.current.forEach((shape) => {
      drawShape(context, shape);
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const { width, height } = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      redrawAllShapes();  // Will now use latest shapes
    }
  }, [redrawAllShapes]);

  const handleToolChange = (newTool) => setTool(newTool);
  const handleColorChange = (newColor) => setColor(newColor);
  const handleFillToggle = (fillStatus) => setFillMode(fillStatus);

  const handleUndo = () => { socketRef.current.emit('undo') };
  const handleRedo = () => { socketRef.current.emit('redo') };

  const handleClear = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the board? This will clear the board for everyone!");
    if (confirmClear) {
      clearCanvas(canvasRef)
      setDrawnShapes([]);
      socketRef.current.emit('clear');
    } else {
      console.error("Error clearing the board.");
    }
  };

  // Save/update the existing blank whiteboard as an image to db
  const handleSaveAsImage = async () => {
    if (!whiteboardId) {
      console.error("Whiteboard ID is not defined.");
      return;
    }
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png'); // Convert to PNG image format

    try {
      const response = await fetch(`/api/whiteboards/${whiteboardId}?userId=${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: whiteboardId, content: dataURL }), // Sending image data
      });

      console.log('API response status:', response.status);
      console.log('API response:', await response.json()); // Log the entire response for debugging

      if (response.ok) {
        alert('Whiteboard image saved successfully!');
      } else {
        alert('Failed to save the whiteboard image.');
      }
    } catch (error) {
      console.error('Error saving whiteboard image:', error);
    }
  };

  // Load like a quick load in game for now
  const handleLoad = async (whiteboardId) => {
    try {
      const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();

        if (data.content) {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Clear the canvas before drawing the loaded image
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the loaded image onto the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Add the image as a "shape" to drawnShapes array for further interaction
            const imageShape = {
              tool: 'image',  // Use 'image' as a new shape type
              src: data.content, // Store the base64 image data
              startX: 0,
              startY: 0,
              width: canvas.width,
              height: canvas.height,
            };

            socketRef.current.emit('loadImage', imageShape);

            // Add this image "shape" to the drawnShapes array
            setDrawnShapes((prevShapes) => [...prevShapes, imageShape]);

          };
          img.src = data.content; // Set the source of the image to the base64 data
          alert('Whiteboard loaded successfully!');
        } else {
          alert('No whiteboard data found.');
        }
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
        <div className="flex grow w-full h-full overflow-hidden p-0 pl-2 items-center justify-center">
          <canvas ref={canvasRef} className="border bg-white w-full h-full"></canvas>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;
