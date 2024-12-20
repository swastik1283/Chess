import { GAME_OVER, INIT_GAME, MOVE } from './messages';

import { Chess } from 'chess.js'
import WebSocket from "ws";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board:Chess;
    private startTime:Date;
    private Movecount=0;

    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }}));
    }
    makeMove(socket:WebSocket,move:{
        from:string,
        to:string,
    }){
        // validate using zod 
        if (this.Movecount%2===0 && socket!=this.player1){
            console.log("early return 1")
            return ;

        }
        if (this.Movecount % 2 ===1 && socket!= this.player2){
            return ;
        }
        console.log("did not eaarly rreturn ")
        try{
            this.board.move(move)
            
        } catch(e){
            console.log(e);
            return 
        }
        console.log("move successded")
        
        //check  game is oveer
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === "w" ? "black":"white"
                }
            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === "w" ? "black":"white"
                }
            }))
            return;
        }
        console.log(this.Movecount%2)
        if (this.Movecount %2 ===0){
            console.log("sent1")
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        } else{
            console.log("sent2")
            this.player2.send(JSON.stringify({

                type:MOVE,
                payload:move
            }))

        }this.Movecount++;
    
}}