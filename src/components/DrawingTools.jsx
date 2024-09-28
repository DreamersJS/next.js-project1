"use client";

import { useState } from 'react';
import { FaPen, FaEraser, FaSquare, FaUndo, FaRedo, FaCircle, FaSlash, FaPlay } from 'react-icons/fa'; 

const DrawingTools = ({ onToolChange, onClear, onColorChange, onFillToggle, onUndo, onRedo }) => {
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
      {/* Drawing Tools */}
      <div className="flex flex-wrap">
      <button
        onClick={() => handleToolChange('pen')}
        className={`px-4 py-2 border rounded ${selectedTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'pen'}
        aria-label="Pen Tool"
        title="Pen Tool"
      >
        <FaPen className="mr-2" /> 
      </button>
      <button
        onClick={() => handleToolChange('eraser')}
        className={`px-4 py-2 border rounded ${selectedTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'eraser'}
        aria-label="Eraser Tool"
        title="Eraser Tool"
      >
         <FaEraser className="mr-2" />
      </button>
      <button
        onClick={() => handleToolChange('rectangle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'rectangle'}
        aria-label="Rectangle Tool"
        title="Rectangle Tool"
      >
                <FaSquare className="mr-2" />
      </button>
      <button
        onClick={() => handleToolChange('circle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'circle'}
        aria-label="Circle Tool"
        title="Circle Tool"
      >
        <FaCircle className="mr-2" /> 
      </button>
      <button
        onClick={() => handleToolChange('line')}
        className={`px-4 py-2 border rounded ${selectedTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'line'}
        aria-label="Line Tool"
        title="Line Tool"
      >
        <FaSlash className="mr-2" />
      </button>
      <button
        onClick={() => handleToolChange('triangle')}
        className={`px-4 py-2 border rounded ${selectedTool === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={selectedTool === 'triangle'}
        aria-label="Triangle Tool"
        title="Triangle Tool"
      >
        <FaPlay className="mr-2" />
      </button>
      </div>

      {/* Undo & Redo Buttons */}
      <div className='flex flex-row'>
      <button onClick={onUndo} className="px-4 py-2 border rounded bg-blue-400 text-black" aria-label="Undo" title="Undo"><FaUndo className="mr-2" /></button>
      <button onClick={onRedo} className="px-4 py-2 border rounded bg-blue-400 text-black" aria-label="Redo" title="Redo"><FaRedo className="mr-2" /></button>
      </div>

      {/* Color Picker */}
      <label htmlFor="color-picker" className="sr-only">
        Select Color
      </label>
      <input
        type="color"
        id="color-picker"
        value={color}
        onChange={handleColorChange}
        className="w-full py-2"
        aria-label="Color Picker"
        title="Color Picker"
      />

      {/* Fill/Stroke Toggle */}
      <button
        onClick={handleFillToggle}
        className={`px-4 py-2 border rounded ${fillMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        aria-pressed={fillMode}
        aria-label={fillMode ? 'Fill Mode Enabled' : 'Stroke Mode Enabled'}
        title={fillMode ? 'Fill Mode' : 'Stroke Mode'}
      >
        {fillMode ? 'Fill Mode' : 'Stroke Mode'}
      </button>

      <button
        onClick={handleClear}
        className="px-4 py-2 border rounded bg-red-500 text-white"
        aria-label="Clear Canvas"
        title="Clear Canvas"
      >
        Clear
      </button>
    </div>
  );
};

export default DrawingTools;
