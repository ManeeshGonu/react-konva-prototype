import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

const App = () => {
  const [shapes, setShapes] = useState([]);

  const addShape = () => {
    setShapes([
      ...shapes,
      {
        id: shapes.length.toString(),
        x: 100 + shapes.length * 150,
        y: 100,
        width: 150,
        height: 150,
        isDragging: true,
      },
    ]);
  };

  const handleDragStart = (e) => {
    const id = e.target.id();
    setShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, isDragging: true } : shape
      )
    );
  };

  const handleDragMove = (e) => {
    const id = e.target.id();
    const { x, y } = e.target.position();

    setShapes(
      shapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
    );
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const { x, y } = e.target.position();

    setShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, x, y, isDragging: false } : shape
      )
    );
  };

  const handleResize = (id, position, newPos) => {

    setShapes(
      shapes.map((shape) => {
        if (shape.id !== id) return shape;

        let newWidth = shape.width;
        let newHeight = shape.height;
        let newX = shape.x;
        let newY = shape.y;

        // Ensure the resizing stays within bounds of the main rectangle
        const maxWidth = window.innerWidth - shape.x - 20;
        const maxHeight = window.innerHeight - shape.y - 20;

        // Set a minimum size for width and height
        const minSize = 150;

        switch (position) {
          case "top-left":
            newWidth = Math.max(minSize, shape.width + (shape.x - newPos.x));
            newHeight = Math.max(minSize, shape.height + (shape.y - newPos.y));
            newX = newPos.x;
            newY = newPos.y;
            break;
          case "top-right":
            newWidth = Math.max(minSize, newPos.x - shape.x);
            newHeight = Math.max(minSize, shape.height + (shape.y - newPos.y));
            newY = newPos.y;
            break;
          case "bottom-left":
            newWidth = Math.max(minSize, shape.width + (shape.x - newPos.x));
            newHeight = Math.max(minSize, newPos.y - shape.y);
            newX = newPos.x;
            break;
          case "bottom-right":
            newWidth = Math.max(minSize, newPos.x - shape.x);
            newHeight = Math.max(minSize, newPos.y - shape.y);
            break;
          case "top":
            newHeight = Math.max(minSize, shape.height + (shape.y - newPos.y));
            newY = newPos.y;
            break;
          case "bottom":
            newHeight = Math.max(minSize, newPos.y - shape.y);
            break;
          case "left":
            newWidth = Math.max(minSize, shape.width + (shape.x - newPos.x));
            newX = newPos.x;
            break;
          case "right":
            newWidth = Math.max(minSize, newPos.x - shape.x);
            break;
          default:
            break;
        }

        // Constrain the width and height to the available window space
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        // Ensure the rectangle's position remains centered, keeping the resize handle in place
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;

        newX = centerX - newWidth / 2;
        newY = centerY - newHeight / 2;

        return {
          ...shape,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        };
      })
    );
  };

  return (
    <div className="bg-gray-200 p-4">
      <button onClick={addShape} className="bg-gray-400 p-2 rounded-md mb-4">
        Add Square
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {shapes.map((shape) => (
            <React.Fragment key={shape.id}>
              {/* Main Rectangle */}
              <Rect
                id={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill="white"
                draggable
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
                shadowOffsetX={shape.isDragging ? 10 : 5}
                shadowOffsetY={shape.isDragging ? 10 : 5}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                className="relative"
              />

              {/* Resize Handles */}
              {/* Top-Left */}
              <Rect
                className="absolute top-0 left-0"
                x={shape.x}
                y={shape.y}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "top-left", e.target.position())
                }
              />
              {/* Top-Right */}
              <Rect
                x={shape.x + shape.width - 8}
                y={shape.y}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "top-right", e.target.position())
                }
              />
              {/* Bottom-Left */}
              <Rect
                x={shape.x}
                y={shape.y + shape.height - 8}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "bottom-left", e.target.position())
                }
              />
              {/* Bottom-Right */}
              <Rect
                x={shape.x + shape.width - 8}
                y={shape.y + shape.height - 8}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "bottom-right", e.target.position())
                }
              />
              {/* Top */}
              <Rect
                x={shape.x + shape.width / 2 - 4}
                y={shape.y}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "top", e.target.position())
                }
              />
              {/* Bottom */}
              <Rect
                x={shape.x + shape.width / 2 - 4}
                y={shape.y + shape.height - 8}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "bottom", e.target.position())
                }
              />
              {/* Left */}
              <Rect
                x={shape.x}
                y={shape.y + shape.height / 2 - 4}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "left", e.target.position())
                }
              />
              {/* Right */}
              <Rect
                x={shape.x + shape.width - 8}
                y={shape.y + shape.height / 2 - 4}
                width={8}
                height={8}
                fill="gray"
                draggable
                onDragMove={(e) =>
                  handleResize(shape.id, "right", e.target.position())
                }
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

