"use client";
import { useRef, useEffect, useState } from 'react';
import DrawingTools from '../../components/DrawingTools';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Drawing handlers
    const handleMouseDown = (e) => {
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      setStartPosition({ x, y });
      setIsDrawing(true);

      if (tool === 'pen' || tool === 'eraser') {
        context.lineWidth = tool === 'eraser' ? 10 : 2; // Eraser is thicker, 10px
        context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : '#000000'; // White for eraser, black for pen
        context.beginPath();
        context.moveTo(x, y);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;

      if (tool === 'pen' || tool === 'eraser') {
        context.lineTo(x, y);
        context.stroke();
      }
    };

    const handleMouseUp = (e) => {
      if (!isDrawing) return;
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;

      if (tool === 'pen' || tool === 'eraser') {
        context.lineTo(x, y);
        context.stroke();
        context.closePath(); // End the path for pen or eraser
      } else {
        // Shape drawing logic
        context.beginPath();
        switch (tool) {
          case 'line':
            context.moveTo(startPosition.x, startPosition.y);
            context.lineTo(x, y);
            context.stroke();
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
            context.stroke();
            break;
          case 'circle':
            const radius = Math.sqrt(
              Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2)
            );
            context.arc(
              startPosition.x,
              startPosition.y,
              radius,
              0,
              2 * Math.PI
            );
            context.stroke();
            break;
          default:
            break;
        }
      }
      setIsDrawing(false);
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
  }, [tool, isDrawing, startPosition]);

  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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
