"use client";
import { useState } from 'react';

const DrawingTools = ({ onToolChange, onClear }) => {
  const [selectedTool, setSelectedTool] = useState('pen'); 

  const handleToolChange = (tool) => {
    setSelectedTool(tool); // Update the selected tool state
    onToolChange(tool);    // Pass the tool to the parent or canvas component
  };

  const handleClear = () => {
    onClear(); // Trigger the clear function on the canvas
  };

  return (
    <div className="flex flex-col space-x-2">
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
        onClick={handleClear}
        className="px-4 py-2 border rounded bg-red-500 text-white"
      >
        Clear
      </button>
    </div>
  );
};

export default DrawingTools;
