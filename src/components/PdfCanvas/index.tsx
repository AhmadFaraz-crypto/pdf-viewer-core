/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

type PDFCanvasProps = {
  page: Promise<any>;
};

const PDFCanvas = ({ page }: PDFCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const render = async () => {
    const _page = await page;
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    const viewport = _page.getViewport({ scale: 1 });
    setWidth(viewport.width);
    setHeight(viewport.height);
    await _page.render({
      canvasContext: context,
      viewport,
    }).promise;
  };

  useEffect(() => {
    render();
  }, [width, page]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full pdf-canvas"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default PDFCanvas;
