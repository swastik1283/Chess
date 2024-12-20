"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const messages_1 = require("./messages");
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        // Send initialization messages to both players
        try {
            this.player1.send(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    color: "white",
                },
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    color: "black",
                },
            }));
        }
        catch (e) {
            console.error("Error initializing game for players:", e);
        }
    }
    makeMove(socket, move) {
        console.log("Received move:", move);
        // Validate the turn logic
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("It's Player 1's turn. Move rejected.");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("It's Player 2's turn. Move rejected.");
            return;
        }
        console.log("Move is valid for current player.");
        // Attempt the move on the board
        try {
            const result = this.board.move(move);
            if (!result) {
                console.error("Invalid move:", move);
                return;
            }
            console.log("Move applied:", move);
        }
        catch (e) {
            console.error("Error processing move:", move, e);
            return;
        }
        // Check if the game is over
        if (this.board.isGameOver()) {
            console.log("Game Over. Final board state:\n", this.board.ascii());
            const winner = this.board.turn() === "w" ? "black" : "white";
            try {
                this.player1.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: { winner },
                }));
                this.player2.send(JSON.stringify({
                    type: messages_1.GAME_OVER,
                    payload: { winner },
                }));
            }
            catch (e) {
                console.error("Error sending GAME_OVER message:", e);
            }
            return;
        }
        // Broadcast the move to the other player
        if (this.moveCount % 2 === 0) {
            try {
                console.log("Sending move to Player 2.");
                this.player2.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            catch (e) {
                console.error("Error sending move to Player 2:", e);
            }
        }
        else {
            try {
                console.log("Sending move to Player 1.");
                this.player1.send(JSON.stringify({
                    type: messages_1.MOVE,
                    payload: move,
                }));
            }
            catch (e) {
                console.error("Error sending move to Player 1:", e);
            }
        }
        // Increment move count
        this.moveCount++;
        console.log("Move count incremented to:", this.moveCount);
    }
}
exports.Game = Game;
