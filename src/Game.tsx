import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

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
    is_hidden: boolean;
    speed: {
      x: number;
      y: number;
    };
    radius: number;
  };
  score: { home: number; away: number };
  mode: string;
  will_reverse: boolean;
};

enum Colors {
  BG = "#22303c",
  HOME_PADDLE = "#8899ac",
  AWAY_PADDLE = "	#8899ac",
  BALL = "#ffffff",
}

const PongGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameData | null>(null);

  useEffect(() => {
    if (!window.location.pathname.slice(1)) return console.log("add game id");
    const socket = io("http://10.53.85.225:3001/game", {
      withCredentials: true,
    });

    socket.on(window.location.pathname.slice(1), (newGameState: GameData) => {
      setGameState(newGameState);
    });

    socket.emit("ingame", {
      action: "JOIN",
      game_id: window.location.pathname.slice(1),
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "w") {
        socket.emit("ingame", {
          action: "UP",
          game_id: window.location.pathname.slice(1),
        });
      }

      if (event.key === "s") {
        socket.emit("ingame", {
          action: "DOWN",
          game_id: window.location.pathname.slice(1),
        });
      }
    };

    window.addEventListener("keypress", handleKeyDown);

    return () => {
      socket.disconnect();
      window.removeEventListener("keypress", handleKeyDown);
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!gameState) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);

      // Draw the paddles and ball
      drawPaddle(ctx, gameState, canvas, true);
      drawPaddle(ctx, gameState, canvas, false);
      drawBall(ctx, gameState.ball, canvas);
    }
  }, [gameState]);

  const drawPaddle = (
    ctx: CanvasRenderingContext2D,
    gameState: GameData,
    canvas: any,
    isHome: boolean
  ) => {
    // Apply fade-in/fade-out effect when will_reverse is true
    const opacity = gameState?.will_reverse ? 0.1 : 1;
    const paddle = isHome ? gameState.home : gameState.away;

    ctx.fillStyle = isHome ? Colors.HOME_PADDLE : Colors.AWAY_PADDLE;
    ctx.globalAlpha = opacity;

    ctx.fillRect(
      (paddle.x / 100) * canvas.width,
      (paddle.y / 100) * canvas.height,
      (paddle.width / 100) * canvas.width,
      (paddle.height / 100) * canvas.height
    );

    // Reset global alpha after drawing
    ctx.globalAlpha = 1;
  };

  const drawBall = (
    ctx: CanvasRenderingContext2D,
    ball: GameData["ball"],
    canvas: any
  ) => {
    if (!ball.is_hidden) {
      ctx.fillStyle = Colors.BALL;
      ctx.beginPath();
      ctx.arc(
        (ball.x / 100) * canvas.width,
        (ball.y / 100) * canvas.height,
        (ball.radius / 100) * Math.min(canvas.width, canvas.height),
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.closePath();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          fontWeight: "900",
        }}
      >
        {`${gameState?.away.display_name} ${gameState?.score.away} - ${gameState?.score.home} ${gameState?.home.display_name}`}
      </div>
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ backgroundColor: Colors.BG }}
      ></canvas>
    </div>
  );
};

export default PongGame;
