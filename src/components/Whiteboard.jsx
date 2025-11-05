"use client";
import { useRef, useState, useCallback } from 'react';
import { useSocketConnection } from '@/context/SocketProvider';
import { useResizeCanvas } from '@/hooks/useResizeCanvas';
import { useRedrawAllShapes } from '@/hooks/useRedrawAllShapes';
import { drawShape } from '@/services/drawService';
import { useDrawingEvents } from '@/hooks/useDrawingEvents';
import { useUser } from '@/hooks/useUser';
import WhiteboardControls from './WhiteboardControls';
import { useWhiteboardLogic } from '@/hooks/useWhiteboardLogic';

const Whiteboard = ({ id }) => {
  const whiteboardId = id;
  const canvasRef = useRef(null);
  const drawnShapesRef = useRef([]);
  const { user } = useUser();

  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [fillMode, setFillMode] = useState(false);
  const socketRef = useSocketConnection();
  const imageCache = useRef(new Map());

  const redrawAllShapes = useRedrawAllShapes(canvasRef, drawnShapesRef, imageCache);
  const throttledResizeCanvas = useResizeCanvas(canvasRef, redrawAllShapes);
  const stableDrawShape = useCallback(drawShape, []);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingEvents({
    canvasRef,
    tool,
    color,
    fillMode,
    socketRef,
    whiteboardId,
    redrawAllShapes,
    drawnShapesRef,
    drawShape: stableDrawShape,
  });

  const { handleClear } = useWhiteboardLogic({
    socketRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    throttledResizeCanvas,
    whiteboardId,
    canvasRef,
    drawnShapesRef,
    redrawAllShapes,
  });

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Drawing tools and Save, Load, Delete buttons */}
        <WhiteboardControls
          onClear={handleClear}
          setTool={setTool}
          setColor={setColor}
          setFillMode={setFillMode}
          whiteboardId={whiteboardId}
          user={user}
          socketRef={socketRef}
          canvasRef={canvasRef}
          drawnShapesRef={drawnShapesRef}
          redrawAllShapes={redrawAllShapes}
        />
        {/* Canvas */}
        <div className="flex grow w-full h-full overflow-hidden p-0 items-center justify-center">
          <canvas ref={canvasRef} className="border bg-white w-full h-full"></canvas>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;