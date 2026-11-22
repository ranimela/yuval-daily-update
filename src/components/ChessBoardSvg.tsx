const FEN_GLYPHS: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

function parseFenBoard(fen: string): Array<Array<string | null>> {
  const placement = fen.split(" ")[0] ?? "";
  const ranks = placement.split("/");
  const board: Array<Array<string | null>> = [];

  for (let r = 0; r < 8; r += 1) {
    const row: Array<string | null> = [];
    const rankStr = ranks[r] ?? "";
    for (const ch of rankStr) {
      if (ch >= "1" && ch <= "8") {
        const emptyCount = Number.parseInt(ch, 10);
        for (let k = 0; k < emptyCount; k += 1) {
          row.push(null);
        }
      } else if (FEN_GLYPHS[ch]) {
        row.push(FEN_GLYPHS[ch]);
      }
    }
    while (row.length < 8) {
      row.push(null);
    }
    board.push(row.slice(0, 8));
  }
  return board;
}

export const ChessBoardSvg = ({ fen, title }: { fen: string; title: string }) => {
  const board = parseFenBoard(fen);
  const sq = 40;

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={`Chess board for ${title}`}
      className="block h-auto w-full rounded-[10px] border-[3px] border-ink"
    >
      {board.map((row, rIdx) =>
        row.map((glyph, cIdx) => {
          const isLight = (rIdx + cIdx) % 2 === 0;
          const x = cIdx * sq;
          const y = rIdx * sq;
          return (
            <g key={`${rIdx}-${cIdx}`}>
              <rect
                x={x}
                y={y}
                width={sq}
                height={sq}
                fill={isLight ? "#ffe5a0" : "#b79cf2"}
              />
              {glyph ? (
                <text
                  x={x + sq / 2}
                  y={y + sq / 2 + 10}
                  textAnchor="middle"
                  fontSize="28"
                  fill="#111111"
                >
                  {glyph}
                </text>
              ) : null}
            </g>
          );
        })
      )}
    </svg>
  );
};
