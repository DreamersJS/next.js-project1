"use client";

import { useState } from 'react';

const DrawingTools = ({ onToolChange, onClear, onColorChange, onFillToggle }) => {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [fillMode, setFillMode] = useState(false); // To toggle between fill and stroke mode
  const [color, setColor] = useState('#000000'); // Default color

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    onToolChange(tool); // Notify the parent about tool change
  };

  const handleClear = () => {
    onClear(); // Clear the canvas
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    onColorChange(e.target.value); // Notify parent about color change
  };

  const handleFillToggle = () => {
    setFillMode(!fillMode);
    onFillToggle(!fillMode); // Notify parent about fill/stroke toggle
  };

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => handleToolChange('pen')}
        className={`px-4 py-2 border rounded ${selectedTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Pen
      </button>
      <button
        onClick={() => handleToolChange('eraser')}
        className={`px-4 py-2 border rounded ${selectedTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Eraser
      </button>
      <button
        onClick={() => handleToolChange('rectangle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Rectangle
      </button>
      <button
        onClick={() => handleToolChange('circle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Circle
      </button>
      <button
        onClick={() => handleToolChange('line')}
        className={`px-4 py-2 border rounded ${selectedTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Line
      </button>
      <button
        onClick={() => handleToolChange('triangle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Triangle
      </button>

      {/* Color Picker */}
      <input type="color" value={color} onChange={handleColorChange} className="w-full py-2" />

      {/* Fill/Stroke Toggle */}
      <button
        onClick={handleFillToggle}
        className={`px-4 py-2 border rounded ${fillMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {fillMode ? 'Fill Mode' : 'Stroke Mode'}
      </button>

      <button
        onClick={handleClear}
        className="px-4 py-2 border rounded bg-red-500 text-white"
      >
        Clear
      </button>
    </div>
  );
};

export default DrawingTools;
