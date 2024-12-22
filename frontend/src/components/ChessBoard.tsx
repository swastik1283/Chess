import { Color, PieceSymbol, Square } from "chess.js";
import { MOVE } from "../screens/Game";
import { useState } from "react";

export const ChessBoard = ({
  chess,
  socket,
  board,
  setBoard,
}: {
  chess: import("chess.js").Chess;
  setBoard: (board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]) => void;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => (
        <div key={i} className="flex flex-row">
          {row.map((square, j) => {
            const squareRepresentation = `${String.fromCharCode(97 + j)}${8 - i}`;

            return (
              <div
                onClick={() => {
                  if (!from) {
                    setFrom(squareRepresentation as Square);
                  } else {
                    console.log("Attempting move:", {
                      from,
                      to: squareRepresentation,
                    });
                    const move = chess.move({
                      from,
                      to: squareRepresentation,
                    });

                    if (move) {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: { from, to: squareRepresentation },
                        })
                      );
                      setBoard(chess.board()); // Update the board state
                      console.log({ from, to: squareRepresentation });
                    } else {
                      console.error("Invalid move");
                    }

                    setFrom(null); // Reset `from`
                  }
                }}
                key={j}
                className={`w-16 h-16 ${
                  (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                }`}
              >
                <div className="w-full justify-center flex h-full">
                  <div className="h-full justify-center flex flex-col">
                    {square ? <img className="w-10"src={`/${square.color === "b"  ? square?.type:`${square?.type?.toUpperCase()}copy`}.png`}/>:null}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
