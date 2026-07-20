export function calculateGrid(participantCount) {
  if (participantCount <= 1) {
    return {
      rows: 1,
      columns: 1,
    };
  }

  let bestLayout = {
    rows: 1,
    columns: participantCount,
    score: 0,
  };

  for (let columns = 1; columns <= participantCount; columns++) {
    const rows = Math.ceil(participantCount / columns);

    // Try to keep rows and columns balanced
    const balanceScore = 100 - Math.abs(columns - rows) * 10;

    // Prefer fewer empty cells
    const emptyCells = rows * columns - participantCount;
    const emptyPenalty = emptyCells * 5;

    const score = balanceScore - emptyPenalty;

    if (score > bestLayout.score) {
      bestLayout = {
        rows,
        columns,
        score,
      };
    }
  }

  return {
    rows: bestLayout.rows,
    columns: bestLayout.columns,
  };
}