"use client";
import { useRef, useEffect, useState } from 'react';
import DrawingTools from '../../components/DrawingTools';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [drawnShapes, setDrawnShapes] = useState([]); // Store all drawn shapes

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Helper function to redraw all saved shapes
    const redrawAllShapes = () => {
      // Clear canvas first
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all saved shapes
      drawnShapes.forEach((shape) => {
        context.beginPath();
        switch (shape.tool) {
          case 'line':
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            break;
          case 'rectangle':
            context.strokeRect(
              shape.startX,
              shape.startY,
              shape.endX - shape.startX,
              shape.endY - shape.startY
            );
            break;
          case 'triangle':
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            context.lineTo(shape.startX, shape.endY);
            context.closePath();
            break;
          case 'circle':
            const radius = Math.sqrt(
              Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2)
            );
            context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
            break;
          case 'pen':
          case 'eraser':
            context.lineWidth = shape.tool === 'eraser' ? 10 : 2;
            context.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : '#000000';
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            break;
          default:
            break;
        }
        context.stroke();
      });
    };

    // Drawing handlers
    const handleMouseDown = (e) => {
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      setStartPosition({ x, y });
      setCurrentPosition({ x, y });
      setIsDrawing(true);

      if (tool === 'pen' || tool === 'eraser') {
        context.lineWidth = tool === 'eraser' ? 10 : 2;
        context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : '#000000';
        context.beginPath();
        context.moveTo(x, y);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      setCurrentPosition({ x, y });

      // For freehand drawing (pen or eraser)
      if (tool === 'pen' || tool === 'eraser') {
        context.lineTo(x, y);
        context.stroke();
        setDrawnShapes((prevShapes) => [
          ...prevShapes,
          { tool, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y },
        ]);
        setStartPosition({ x, y }); // Update start position to continue freehand drawing
      } else {
        // For shapes, clear and redraw the entire canvas
        redrawAllShapes();

        // Draw preview of the current shape
        context.beginPath();
        switch (tool) {
          case 'line':
            context.moveTo(startPosition.x, startPosition.y);
            context.lineTo(x, y);
            break;
          case 'rectangle':
            context.strokeRect(
              startPosition.x,
              startPosition.y,
              x - startPosition.x,
              y - startPosition.y
            );
            break;
          case 'triangle':
            context.moveTo(startPosition.x, startPosition.y);
            context.lineTo(x, y);
            context.lineTo(startPosition.x, y);
            context.closePath();
            break;
          case 'circle':
            const radius = Math.sqrt(
              Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2)
            );
            context.arc(startPosition.x, startPosition.y, radius, 0, 2 * Math.PI);
            break;
          default:
            break;
        }
        context.stroke();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;

      const x = currentPosition.x;
      const y = currentPosition.y;

      // Save the final shape into the drawnShapes array
      setDrawnShapes((prevShapes) => [
        ...prevShapes,
        { tool, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y },
      ]);

      setIsDrawing(false); // Finish drawing
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [tool, isDrawing, startPosition, currentPosition, drawnShapes]);

  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnShapes([]); // Clear stored shapes as well
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-44 bg-gray-200 p-4 border-r border-gray-300">
        <DrawingTools onToolChange={handleToolChange} onClear={handleClear} />
      </div>
      <div className="flex-1 overflow-auto p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border bg-white"
        ></canvas>
      </div>
    </div>
  );
};

export default Whiteboard;
