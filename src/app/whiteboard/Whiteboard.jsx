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
  const [color, setColor] = useState('#000000'); // Color for shapes
  const [fillMode, setFillMode] = useState(false); // Track fill vs stroke

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');


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
        context.beginPath();
        context.strokeStyle = shape.color;
        context.fillStyle = shape.color;
        context.lineWidth = shape.tool === 'pen' || shape.tool === 'line' ? 2 : 1;

        switch (shape.tool) {
          case 'line':
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            context.stroke();
            break;
          case 'rectangle':
            if (shape.fill) {
              context.fillRect(
                shape.startX,
                shape.startY,
                shape.endX - shape.startX,
                shape.endY - shape.startY
              );
            } else {
              context.strokeRect(
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
            context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
            if (shape.fill) {
              context.fill();
            } else {
              context.stroke();
            }
            break;
          case 'triangle':
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            context.lineTo(shape.startX, shape.endY);
            context.closePath();
            if (shape.fill) {
              context.fill();
            } else {
              context.stroke();
            }
            break;
          case 'pen': // Handle pen as multiple line segments
          case 'eraser':
            context.lineWidth = shape.tool === 'eraser' ? 10 : 2;
            context.strokeStyle = shape.tool === 'eraser' ? '#FFFFFF' : shape.color;
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
            context.stroke();
            break;
          default:
            break;
        }
      });
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
        context.lineTo(x, y);
        context.stroke();
        setDrawnShapes((prevShapes) => [
          ...prevShapes,
          { tool, color, fill: false, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y },
        ]);
        setStartPosition({ x, y });
      } else {
        redrawAllShapes();
        context.beginPath();
        context.strokeStyle = color;
        context.fillStyle = color;

        switch (tool) {
          case 'line':
            context.moveTo(startPosition.x, startPosition.y);
            context.lineTo(x, y);
            context.stroke();
            break;
          case 'rectangle':
            if (fillMode) {
              context.fillRect(
                startPosition.x,
                startPosition.y,
                x - startPosition.x,
                y - startPosition.y
              );
            } else {
              context.strokeRect(
                startPosition.x,
                startPosition.y,
                x - startPosition.x,
                y - startPosition.y
              );
            }
            break;
          case 'circle':
            const radius = Math.sqrt(
              Math.pow(x - startPosition.x, 2) + Math.pow(y - startPosition.y, 2)
            );
            context.arc(startPosition.x, startPosition.y, radius, 0, 2 * Math.PI);
            if (fillMode) {
              context.fill();
            } else {
              context.stroke();
            }
            break;
          case 'triangle':
            context.moveTo(startPosition.x, startPosition.y);
            context.lineTo(x, y);
            context.lineTo(startPosition.x, y);
            context.closePath();
            if (fillMode) {
              context.fill();
            } else {
              context.stroke();
            }
            break;
          default:
            break;
        }
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;

      const x = currentPosition.x;
      const y = currentPosition.y;

      // Add the shape/line to drawnShapes
      setDrawnShapes((prevShapes) => [
        ...prevShapes,
        { tool, color, fill: fillMode, startX: startPosition.x, startY: startPosition.y, endX: x, endY: y },
      ]);

      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial size


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
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnShapes([]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-44 bg-gray-200 p-2 border-r border-gray-300">
        <DrawingTools
          onToolChange={handleToolChange}
          onClear={handleClear}
          onColorChange={handleColorChange}
          onFillToggle={handleFillToggle}
        />
      </div>
      {/* <div className="flex overflow-auto p-2">
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          className="border bg-white"
        ></canvas>
      </div> */}

      <div className="flex grow h-full overflow-hidden p-2 items-center justify-center">
        <canvas
          ref={canvasRef}
          className="border bg-white w-full h-full"
        ></canvas>
      </div>
      
    </div>
  );
};

export default Whiteboard;
