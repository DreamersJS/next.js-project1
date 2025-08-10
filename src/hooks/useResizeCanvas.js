import { useCallback } from 'react';
import throttle from 'lodash.throttle';

export const useResizeCanvas = (canvasRef, redrawAllShapes) => {
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;

        const { width, height } = canvas.parentElement.getBoundingClientRect();
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            redrawAllShapes();
        }
    }, [canvasRef, redrawAllShapes]);

    return useCallback(throttle(resizeCanvas, 200), [resizeCanvas]);
};
