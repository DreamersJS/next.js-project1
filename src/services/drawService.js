export const drawLine = (ctx, shape) => {
    ctx.moveTo(shape.startX, shape.startY);
    ctx.lineTo(shape.endX, shape.endY);
    ctx.stroke();
};

export const drawRectangle = (ctx, shape) => {
    const { startX, startY, endX, endY, fill } = shape;
    if (fill) ctx.fillRect(startX, startY, endX - startX, endY - startY);
    else ctx.strokeRect(startX, startY, endX - startX, endY - startY);
};

export const drawCircle = (ctx, shape) => {
    const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
    ctx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
    shape.fill ? ctx.fill() : ctx.stroke();
};

export const drawTriangle = (ctx, shape) => {
    ctx.moveTo(shape.startX, shape.startY);
    ctx.lineTo(shape.endX, shape.endY);
    ctx.lineTo(shape.startX, shape.endY);
    ctx.closePath();
    shape.fill ? ctx.fill() : ctx.stroke();
};

export const drawShape = (ctx, shape, preview = false) => {
  if (!shape) return;

  ctx.beginPath();
  ctx.strokeStyle = shape.tool === "eraser" ? "#FFFFFF" : shape.color;
  ctx.fillStyle = shape.color;
  ctx.lineWidth = shape.tool === "eraser" ? 10 : 2;

  switch (shape.tool) {
    case "line":
      drawLine(ctx, shape);
      break;
    case "rectangle":
      drawRectangle(ctx, shape);
      break;
    case "circle":
      drawCircle(ctx, shape);
      break;
    case "triangle":
      drawTriangle(ctx, shape);
      break;
    case "pen":
    case "eraser":
      if (shape.points?.length > 1) {
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      }
      break;
    case "image":
      break;
  }

  if (!preview) ctx.closePath();
};
