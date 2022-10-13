import express from "express";
import http from "http";
import createGame from "./public/game.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("public"));

const game = createGame(10, 10);
game.start();

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected with id: ${playerId}`);

  game.addPlayer({ playerId });

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    console.log(`> Player disconnected with id: ${playerId}`);
    game.removePlayer({ playerId });
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log(`> Server listening on port 3000`);
});
