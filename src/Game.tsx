import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/debug";

type GameData = {
  home: {
    x: number;
    y: number;
    width: number;
    height: number;
    display_name: string;
    avatar: string;
  };
  away: {
    x: number;
    y: number;
    width: number;
    height: number;
    display_name: string;
    avatar: string;
  };
  ball: {
    x: number;
    y: number;
    isHidden: boolean;
    speed: {
      x: number;
      y: number;
    };
    radius: number;
  };
  score: { home: number; away: number };
  mode: string;
  willReverse: boolean;
};

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [socket, setSocket] = useState<any>({});

  useEffect(() => {
    const socket = io("http://localhost:3001/game", {
      withCredentials: true,
    });
    socket.emit("ingame");
    socket.on("ingame", (serverdata) => {
      setGameData(serverdata);
    });
    setSocket(socket);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!gameData) return;
    const canvas = canvasRef.current;
    if (!canvas || !gameData.home || !gameData.away || !gameData.ball) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = "red";
    context.fillRect(
      (gameData.home.x / 100) * 1280, // x pos
      (gameData.home.y / 100) * 720, // y pos
      (gameData.home.width / 100) * 1280, // width
      (gameData.home.height / 100) * 720 // height
    );

    context.fillStyle = "purple";
    context.fillRect(
      (gameData.away.x / 100) * 1280, // x pos
      (gameData.away.y / 100) * 720, // y pos
      (gameData.away.width / 100) * 1280, // width
      (gameData.away.height / 100) * 720 // height
    );

    // Draw the ball
    context.beginPath();
    context.arc(
      (gameData.ball.x / 100) * 1280,
      (gameData.ball.y / 100) * 720,
      gameData.ball.radius,
      0,
      2 * Math.PI
    );
    context.fillStyle = "green";
    context.fill();
    context.closePath();
  }, [gameData]);

  // Handle keyboard input for the player's paddle
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "w")
      socket.emit("ingame", {
        action: "UP",
      });
    else if (event.key == "s")
      socket.emit("ingame", {
        action: "DOWN",
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ border: "1px solid black", background: "lightblue" }}
      />
    </div>
  );
};

export default Game;
