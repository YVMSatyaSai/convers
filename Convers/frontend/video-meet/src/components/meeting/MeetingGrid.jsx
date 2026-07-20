import { useEffect, useRef, useState } from "react";
import { calculateLayout } from "../../utils/layoutEngine";

export default function MeetingGrid({
  participants,
  children,
}) {
  const containerRef = useRef(null);

  const [layout, setLayout] = useState({
    tileWidth: 0,
    tileHeight: 0,
    rows: [],
  });

  useEffect(() => {
    function updateLayout() {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      setLayout(calculateLayout(width, height, participants));
    }

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, [participants]);

  const childArray = Array.isArray(children) ? children : [children];

  let index = 0;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 170px)",
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {layout.rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {row.map(() => {
            const child = childArray[index++];

            return (
              <div
                key={index}
                style={{
                  width: layout.tileWidth,
                  height: layout.tileHeight,
                  flexShrink: 0,
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}