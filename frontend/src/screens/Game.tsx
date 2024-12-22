import { useEffect, useState } from "react";

import { Button } from "../components/Button";
import { Chess } from "chess.js";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const[started,setstarted]=useState(false);
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          // handle game initiation
        
          setBoard(chess.board());
          console.log("game started");
          setstarted(true);
          break;
          case MOVE:
            { const move = message.payload;
            chess.move(move); // Apply the move to the chess game state
            setBoard(chess.board()); // Update the board display
            console.log("move made");
            break; }
        
        
        case GAME_OVER:
          // handle game over
          console.log("game over");
          break;
      }
    };
  }, [socket, chess]);
  if (!socket) return <div>Connecting.....</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4  w-full flex justify-center ">
            <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>
          <div className="col-span-2 bg-slate-800 w-full flex justify-center">
            <div className="pt-8">
              {!(started)&&<Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                PLay Online
              </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
