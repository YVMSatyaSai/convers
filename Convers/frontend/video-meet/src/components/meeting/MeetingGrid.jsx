import { calculateGrid } from "../../utils/meetingLayout";

export default function MeetingGrid({
  children,
  participantCount,
}) {
  const { rows, columns } = calculateGrid(participantCount);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 170px)",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "16px",
        justifyItems: "stretch",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}