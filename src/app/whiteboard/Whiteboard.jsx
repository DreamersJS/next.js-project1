"use client";
import { useRef, useEffect, useState } from 'react';
import DrawingTools from '../../components/DrawingTools';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen'); // Default tool is 'pen'

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set up the drawing context based on the selected tool
    const handleMouseDown = (e) => {
      context.lineWidth = tool === 'eraser' ? 10 : 2; // Set eraser or pen width
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : '#000000'; // White for eraser, black for pen
      context.beginPath();
      context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    const handleMouseMove = (e) => {
      if (e.buttons !== 1) return; // Only draw when the mouse is pressed
      context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      context.stroke();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tool]); // Re-run the effect whenever the tool changes

  const handleToolChange = (newTool) => {
    setTool(newTool); // Update the selected tool
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  };

  return (
    <div className="flex h-screen overflow-hidden">
    <div className="w-44 bg-gray-200 p-4 border-r border-gray-300">
      <DrawingTools onToolChange={handleToolChange} onClear={handleClear} />
    </div>
    <div className="flex-1 overflow-auto p-4">
      <canvas ref={canvasRef} width={800} height={600} className="border bg-white"></canvas>
    </div>
  </div>
  );
};

export default Whiteboard;
