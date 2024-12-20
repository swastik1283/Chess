import { INIT_GAME, MOVE } from "./messages";

import { Game } from "./Game";
import WebSocket from "ws";

interface Games{
    makeMove(socket: WebSocket, move: any): unknown;
    id: number;
    name:string;
    player1:WebSocket;
    player2:WebSocket;
}

export class GameManager{
    private games :Game[];
    private pendingUser:WebSocket | null;
    private users: WebSocket[];
    constructor(){
        this.games=[]
        this.pendingUser=null
        this.users=[]
    }

    addUser(socket:WebSocket){
        this.users.push(socket);
        this.addhandler(socket);
    }

    removeuser( socket:WebSocket){
        this.users=this.users.filter(user=>user!==socket)
        //game ends as user left the game 

    }
    private handleMessage(){
        
    }
    private addhandler(socket:WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());
            
            if(message.type===INIT_GAME){
                if (this.pendingUser){
                    //start a game
                    const game= new Game(this.pendingUser,socket)
                    this.games.push(game);
                    this.pendingUser=null
                }
                else{
                    this.pendingUser=socket;
                }                
            }

            if(message.type===MOVE){
                console.log("inside move")
                const game= this.games.find(game=>game.player1=== socket || game)
                if (game){
                    console.log("iside madke move")
                    game.makeMove(socket,message.move);

                }
                
            }

        })
    }
}