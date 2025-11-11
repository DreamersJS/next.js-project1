import { useCallback } from "react";
import { clearCanvas } from "@/services/canvasService";
import { drawShape } from "@/services/drawService";

export const useRedrawAllShapes = (canvasRef, drawnShapesRef, imageCacheRef) => {
  return useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    clearCanvas(canvasRef);

    if (!drawnShapesRef.current || !imageCacheRef.current) return;

    const imageShapes = drawnShapesRef.current.filter(s => s.tool === "image");
    const otherShapes = drawnShapesRef.current.filter(s => s.tool !== "image");

    const loadImage = (src) => {
      if (imageCacheRef.current.has(src)) {
        return Promise.resolve(imageCacheRef.current.get(src));
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageCacheRef.current.set(src, img);
          resolve(img);
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
          resolve(null);
        };
        img.src = src;
      });
    };

    Promise.all(imageShapes.map(shape => loadImage(shape.src))).then(images => {
      images.forEach((img, i) => {
        const shape = imageShapes[i];
        ctx.drawImage(img, shape.startX, shape.startY, shape.width, shape.height);
      });
      otherShapes.forEach(shape => drawShape(ctx, shape));
    });
  }, [canvasRef, drawnShapesRef, imageCacheRef]);
};
