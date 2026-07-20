export function calculateLayout(
    containerWidth,
    containerHeight,
    participants
) {
    const GAP = 16;
    const PADDING = 20;

    const count = participants.length;

    if (count === 0) {
        return {
            tileWidth: 0,
            tileHeight: 0,
            rows: [],
        };
    }

    let best = null;

    for (let columns = 1; columns <= count; columns++) {

        const rowsCount = Math.ceil(count / columns);

        const maxWidth =
            (containerWidth - PADDING * 2 - GAP * (columns - 1)) / columns;

        const maxHeight =
            (containerHeight - PADDING * 2 - GAP * (rowsCount - 1)) / rowsCount;

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
                rowsCount,
                tileWidth,
                tileHeight,
                area,
            };
        }
    }

    const rows = [];

    for (let i = 0; i < count; i += best.columns) {
        rows.push(
            participants.slice(i, i + best.columns)
        );
    }

    return {
        tileWidth: best.tileWidth,
        tileHeight: best.tileHeight,
        rows,
    };
}