export default function createGame(width, height) {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width,
      height,
    },
  };

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];
  }

  function movePlayer(command) {
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          console.log(
            `game.movePlayer().ArrowUp() -> Moving ${command.playerId} with ${command.keyPressed}`
          );
          player.y = player.y - 1;
        }
      },

      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          console.log(
            `game.movePlayer().ArrowRight() -> Moving ${command.playerId} with ${command.keyPressed}`
          );
          player.x = player.x + 1;
        }
      },

      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          console.log(
            `game.movePlayer().ArrowDown() -> ${command.playerId} with ${command.keyPressed}`
          );
          player.y = player.y + 1;
        }
      },

      ArrowLeft(player) {
        if (player.x > 0) {
          console.log(
            `game.movePlayer().ArrowLeft() -> ${command.playerId} with ${command.keyPressed}`
          );
          player.x = player.x - 1;
        }
      },
    };

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);
        removeFruit({ fruitId });
      }
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
  };
}
