// // Ramer–Douglas–Peucker Algorithm implementation
// const ramerDouglasPeucker = (points, epsilon) => {
//     if (points.length < 3) return points;
  
//     // Find the point with the maximum distance
//     let dmax = 0;
//     let index = 0;
//     const start = points[0];
//     const end = points[points.length - 1];
  
//     for (let i = 1; i < points.length - 1; i++) {
//       const d = perpendicularDistance(points[i], start, end);
//       if (d > dmax) {
//         index = i;
//         dmax = d;
//       }
//     }
  
//     // If max distance is greater than epsilon, recursively simplify
//     if (dmax > epsilon) {
//       const recResults1 = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
//       const recResults2 = ramerDouglasPeucker(points.slice(index), epsilon);
  
//       // Merge results
//       return recResults1.slice(0, recResults1.length - 1).concat(recResults2);
//     } else {
//       return [start, end];
//     }
//   };
  
//   // Helper function to calculate perpendicular distance from a point to a line
//   const perpendicularDistance = (point, lineStart, lineEnd) => {
//     const x = point.x;
//     const y = point.y;
//     const x1 = lineStart.x;
//     const y1 = lineStart.y;
//     const x2 = lineEnd.x;
//     const y2 = lineEnd.y;
  
//     const numerator = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
//     const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
//     return numerator / denominator;
//   };
  