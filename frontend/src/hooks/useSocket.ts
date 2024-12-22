import { useEffect, useState } from "react";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [chessBoard, setChessBoard] = useState<any>(null); // Assuming you are managing the chess board state
    const WS_URL = "ws://localhost:8080";

    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout | null = null;

        const connect = () => {
            ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                console.log("Message received:", event.data);
                const message = JSON.parse(event.data);

                // Handle the different message types
                switch (message.type) {
                    case "init_game":
                        // Handle game initialization (e.g., update the UI)
                        break;
                    case "move":
                        // Handle the move (e.g., update the board)
                        {const move = message.payload;
                        updateBoard(move); // Call function to update the board
                        break;}
                    case "game_over":
                        // Handle game over (e.g., show winner)
                        break;
                    default:
                        console.log("Unknown message type:", message.type);
                }
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected");
                setSocket(null);

                // Attempt to reconnect after 3 seconds
                reconnectTimeout = setTimeout(() => {
                    console.log("Reconnecting WebSocket...");
                    connect();
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        };

        connect();

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws) {
                ws.close();
            }
        };
    }, []);

    // Function to update the chess board with the new move
    const updateBoard = (move: { from: string; to: string }) => {
        console.log("Updating board with move:", move);
        if (chessBoard) {
            chessBoard.move(move);
            setChessBoard({ ...chessBoard }); // Trigger re-render of the board
            renderBoard(chessBoard); // Assuming renderBoard updates the UI
        }
    };

    // This function can be used to render the board in your UI
    const renderBoard = (board: unknown) => {
        console.log("Rendering board with current state:", board);
        // Implement the logic to update the UI with the new board state
    

        // Implement the logic to update the board UI here
    };

    return socket;
};
