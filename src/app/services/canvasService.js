export const clearCanvas = (canvasRef) => {
  const context = canvasRef.current.getContext('2d');

  context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
};

export const resizeCanvas = (canvasRef) => {
  const canvas = canvasRef.current;

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
};
