"use client";
import { loadWhiteboardById, deleteWhiteboard, saveWhiteboardAsImage, } from '@/services/whiteboardService';
import DrawingTools from './DrawingTools';
import UserToolbar from './UserToolbar';
import { useRouter } from 'next/navigation';

const WhiteboardControls = ({ onClear, setTool, setColor, setFillMode, whiteboardId, user, socketRef, canvasRef, drawnShapesRef, redrawAllShapes }) => {
    const router = useRouter();

    const handleToolChange = (newTool) => setTool(newTool);
    const handleColorChange = (newColor) => setColor(newColor);
    const handleFillToggle = (fillStatus) => setFillMode(fillStatus);

    const handleUndo = () => { socketRef.current.emit('undo', whiteboardId) };
    const handleRedo = () => { socketRef.current.emit('redo', whiteboardId) };

    const handleClear = () => {
        if (!confirm('Are you sure you want to clear the board?')) return;
        onClear();
        socketRef.current.emit('clear', whiteboardId);
    };

    const handleSaveAsImage = async () => {
        try {
            await saveWhiteboardAsImage(canvasRef.current, whiteboardId, user.uid);
        } catch (error) {
            console.error('Error saving whiteboard image:', error);
        }
    };

    const handleLoad = async () => {
        try {
            const data = await loadWhiteboardById(whiteboardId);
            if (data.content) {
                const imageShape = {
                    tool: 'image',
                    src: data.content,
                    startX: 0,
                    startY: 0,
                    width: canvasRef.current.width,
                    height: canvasRef.current.height,
                };

                drawnShapesRef.current = [...(drawnShapesRef.current || []), imageShape];

                // Notify others
                socketRef.current.emit('loadImage', whiteboardId, imageShape);

                // Redraw all shapes including image properly
                redrawAllShapes();
                alert('Whiteboard loaded successfully!');
            } else {
                alert('Failed to load the whiteboard.');
            }
        } catch (error) {
            console.error('Error loading whiteboard:', error);
        }
    };

    const handleDeleteWhiteboard = async () => {
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
        <div className="w-44 bg-gray-200 p-2 border-r border-gray-300">
            <DrawingTools
                onToolChange={handleToolChange}
                onClear={handleClear}
                onColorChange={handleColorChange}
                onFillToggle={handleFillToggle}
                onUndo={handleUndo}
                onRedo={handleRedo}
            />
            <UserToolbar
                user={user}
                whiteboardId={whiteboardId}
                onSave={handleSaveAsImage}
                onLoad={handleLoad}
                onDelete={handleDeleteWhiteboard}
            />
        </div>
    );
};
export default WhiteboardControls;