import {
  GRID_GAP,
  TILE_RATIO,
} from "./LayoutConstants";

export function calculateBestGrid(
  participantCount,
  containerWidth,
  containerHeight
) {
  let best = null;

  for (let columns = 1; columns <= participantCount; columns++) {
    const rows = Math.ceil(participantCount / columns);

    const availableWidth =
      containerWidth - GRID_GAP * (columns - 1);

    const availableHeight =
      containerHeight - GRID_GAP * (rows - 1);

    const tileWidth = availableWidth / columns;

    const tileHeight = Math.min(
      availableHeight / rows,
      tileWidth / TILE_RATIO
    );

    const score = tileWidth * tileHeight;

    if (!best || score > best.score) {
      best = {
        rows,
        columns,
        tileWidth,
        tileHeight,
        score,
      };
    }
  }

  return best;
}