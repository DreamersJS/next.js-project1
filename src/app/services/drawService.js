// Drawing shapes functions
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