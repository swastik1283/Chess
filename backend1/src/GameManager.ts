import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
import WebSocket from "ws";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
        console.log("User connected. Total users:", this.users.length);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter((user) => user !== socket);
        console.log("User disconnected. Total users:", this.users.length);

        // End the game if the user leaves
        const gameIndex = this.games.findIndex(
            (game) => game.player1 === socket || game.player2 === socket
        );
        if (gameIndex !== -1) {
            this.games.splice(gameIndex, 1);
            console.log("Game ended as user left.");
        }
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => this.handleMessage(socket, data.toString()));
    }

    private handleMessage(socket: WebSocket, data: string) {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case INIT_GAME:
                    this.handleInitGame(socket);
                    break;
                case MOVE:
                    this.handleMove(socket, message);
                    break;
                default:
                    console.error("Unknown message type:", message.type);
                    socket.send(JSON.stringify({ error: "Unknown message type" }));
            }
        } catch (error) {
            console.error("Error parsing message:", error);
            socket.send(JSON.stringify({ error: "Invalid message format" }));
        }
    }

    private handleInitGame(socket: WebSocket) {
        if (this.pendingUser && this.pendingUser === socket) {
            console.error("User is already waiting for a game");
            socket.send(JSON.stringify({ error: "Already waiting for a game" }));
            return;
        }

        if (this.pendingUser) {
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;

            this.pendingUser.send(JSON.stringify({ type: "GAME_STARTED" }));
            socket.send(JSON.stringify({ type: "GAME_STARTED" }));
        } else {
            this.pendingUser = socket;
            socket.send(JSON.stringify({ type: "WAITING_FOR_PLAYER" }));
        }
    }

    private handleMove(socket: WebSocket, message: any) {
        const game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
        );

        if (!game) {
            console.error("No game found for the socket");
            socket.send(JSON.stringify({ error: "No active game found" }));
            return;
        }

        try {
            if (!message.move || typeof message.move !== "string") {
                throw new Error("Invalid move format");
            }
            game.makeMove(socket, message.move);
        } catch (error) {
            console.error("Error processing move:", error);
            socket.send(JSON.stringify({ error: error.message }));
        }
    }
}
