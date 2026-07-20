import { useEffect, useRef, useState } from "react";
import { calculateLayout } from "../../utils/layoutEngine";

export default function MeetingGrid({
  participantCount,
  children,
}) {
  const containerRef = useRef(null);

  const [layout, setLayout] = useState({
    rows: 1,
    columns: 1,
    tileWidth: 0,
    tileHeight: 0,
  });

  useEffect(() => {
    function updateLayout() {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      setLayout(
        calculateLayout(
          width,
          height,
          participantCount
        )
      );
    }

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [participantCount]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 170px)",
        padding: "20px",
        boxSizing: "border-box",

        display: "grid",

        gridTemplateColumns: `repeat(${layout.columns}, ${layout.tileWidth}px)`,

        gridAutoRows: `${layout.tileHeight}px`,

        justifyContent: "center",
        alignContent: "center",

        gap: "16px",

        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}