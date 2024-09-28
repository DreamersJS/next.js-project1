"use client";
import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation'
import DrawingTools from './DrawingTools';

const socket = io();

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const router = useRouter()
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  let previewCounter = 0;
  const granularity = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set ARIA attributes on canvas for accessibility
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Interactive whiteboard session ID: ${whiteboardId}`);

    // Listen for the initial drawing state from the server
    socket.on('initDrawings', (shapes) => {
      setDrawnShapes(shapes);
    });

    // Listen for drawing events from other clients
    socket.on('draw', (shape) => {
      setDrawnShapes((prevShapes) => [...prevShapes, shape]);
    });

    socket.on('previewDraw', (shape) => {
      drawShape(context, shape, true); // Preview draw without finalizing
    });

    socket.on('clear', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnShapes([]); // Clear local state
    });

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      redrawAllShapes(); // Redraw shapes if needed
    };

    // Function to redraw all shapes and pen strokes
    const redrawAllShapes = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawnShapes.forEach((shape) => {
        drawShape(context, shape);
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

    const handleMouseDown = (e) => {
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
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

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      setCurrentPosition({ x, y });

      if (tool === 'pen' || tool === 'eraser') {
        if (previewCounter % granularity === 0) {
          context.lineTo(x, y);
          context.stroke();

          const previewData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
          socket.emit('previewDraw', previewData);

          setStartPosition({ x, y });
        }
        previewCounter++;
        context.lineTo(x, y);
        context.stroke();

        const shapeData = { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y };
        setDrawnShapes((prevShapes) => [...prevShapes, shapeData]);
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
      socket.emit('draw', shapeData);
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [tool, isDrawing, startPosition, currentPosition, drawnShapes, color, fillMode]);

  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleFillToggle = (fillStatus) => {
    setFillMode(fillStatus);
  };

  const handleClear = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the board? This will clear the board for everyone!");
    if (confirmClear) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      setDrawnShapes([]);
      socket.emit('clear');
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
      const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: whiteboardId, content: dataURL }), // Sending image data
      });

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

  // Delete 
  const deleteWhiteboard = async (whiteboardId) => {
    if (confirm('Are you sure you want to delete this whiteboard?')) {
      try {
        const response = await fetch(`/api/whiteboards/${whiteboardId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Deleted whiteboard:', data);
          // Handle the UI updates, e.g., remove the whiteboard from the list
          router.push(`/`);
        } else {
          alert('Failed to delete the whiteboard.');
        }
      } catch (error) {
        console.error('Error deleting whiteboard:', error);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Drawing tools and Save, Load, Delete buttons */}
      <div className="w-44 bg-gray-200 p-2 border-r border-gray-300">
        <DrawingTools
          onToolChange={handleToolChange}
          onClear={handleClear}
          onColorChange={handleColorChange}
          onFillToggle={handleFillToggle}
        />
        <div className='flex flex-row'>
          <button
            onClick={handleSaveAsImage}
            aria-label="Save the current whiteboard as an image"
            className="px-4 py-2 mt-2 border rounded bg-green-500 text-white">
            Save
          </button>
          <button
            onClick={() => handleLoad(whiteboardId)}
            aria-label="Load the whiteboard session"
            className="px-4 py-2 mt-2 border rounded bg-blue-500 text-white">
            Load
          </button>
        </div>
        <div className='flex'>
          <button
            onClick={() => deleteWhiteboard(whiteboardId)}
            aria-label="Delete this whiteboard session"
            className="px-4 py-2 mt-2 border rounded bg-red-500 text-white">
            Delete
          </button>
        </div>
      </div>
      {/* Canvas */}
      <div className="flex grow w-full h-full overflow-hidden p-2 items-center justify-center">
        <canvas ref={canvasRef} className="border bg-white w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default Whiteboard;
