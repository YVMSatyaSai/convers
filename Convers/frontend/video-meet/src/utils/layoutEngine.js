export function calculateLayout(
  containerWidth,
  containerHeight,
  participantCount
) {
  if (participantCount === 0) {
    return {
      columns: 1,
      rows: 1,
      tileWidth: 0,
      tileHeight: 0,
    };
  }

  const GAP = 16;
  const PADDING = 20;
  const HEADER_SPACE = 0;

  const availableWidth =
    containerWidth - PADDING * 2;

  const availableHeight =
    containerHeight - PADDING * 2 - HEADER_SPACE;

  let best = null;

  for (let columns = 1; columns <= participantCount; columns++) {
    const rows = Math.ceil(participantCount / columns);

    const maxWidth =
      (availableWidth - GAP * (columns - 1)) / columns;

    const maxHeight =
      (availableHeight - GAP * (rows - 1)) / rows;

    let tileWidth = maxWidth;
    let tileHeight = tileWidth * 9 / 16;

    if (tileHeight > maxHeight) {
      tileHeight = maxHeight;
      tileWidth = tileHeight * 16 / 9;
    }

    const area = tileWidth * tileHeight;

    if (!best || area > best.area) {
      best = {
        columns,
        rows,
        tileWidth,
        tileHeight,
        area,
      };
    }
  }

  return best;
}