import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';


type GameData = {
  home: {
    x: number,
    y: number,
    display_name: string,
    avatar: string,
  },
  away: {
    x: number,
    y: number,
    display_name: string,
    avatar: string,
  },
  ball: { x: number, y: number, isHidden: boolean },
  score: { home: number, away: number },
  mode: string,
  willReverse: boolean,
}


const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameData, seGameData] = useState({} as GameData); 


  // const [ball, setBall] = useState({
  //   x: 640,
  //   y: 360,
  //   radius: 15,
  //   speedX: Math.random() > 0.5 ? 0.05 : -0.05,
  //   speedY: Math.random() > 0.5 ? 0.05 : -0.05,
  // });

  useEffect(() => {

    const socket = io('http://10.53.82.147:3001');

    socket.on('ingame', (serverdata) => {
      console.log(serverdata);
    });

    const canvas = canvasRef.current;
    if (!canvas || !gameData.home || !gameData.away || !gameData.ball) return;

    const context = canvas.getContext('2d');
    if (!context) return;	

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = 'red';
    context.fillRect(gameData.home.x, gameData.home.y, 20, 144);

    context.fillStyle = 'purple';
    context.fillRect(gameData.away.x, gameData.away.y, 20, 144);

    // Draw the ball
    context.beginPath();
    context.arc((gameData.ball.x /100)*1280, (gameData.ball.y/100)*720, 15, 0, 2 * Math.PI);
    context.fillStyle = 'green';
    context.fill();
    context.closePath();

    // Move the ball based on its direction
    // setBall((prevBall) => ({
    //   ...prevBall,
    //   x: prevBall.x + prevBall.speedX,
    //   y: prevBall.y + prevBall.speedY,
    // }));
    
    // check if the ball hits the bottom only and reverse its vertical direction
    // if (gameData.ball.y + ball.radius >= canvas.height) {
    //   setBall((prevBall) => ({ ...prevBall, speedY: -Math.abs(prevBall.speedY) }));
    // }

    // // check if the ball hits the top only and reverse its vertical direction
    // if (gameData.ball.y - ball.radius <= 0) {
    //   setBall((prevBall) => ({ ...prevBall, speedY: Math.abs(prevBall.speedY) }));
    // }

  
    // // check if the ball goes beyond the left side, indicating a score for the enemy and reset the ball to the center
    // if (gameData.ball.x - ball.radius <= 0) {
    //   setBall({
    //     x: 640,
    //     y: 360,
    //     radius: 15,
    //     speedX: Math.random() > 0.5 ? 0.05 : -0.05,
    //     speedY: Math.random() > 0.5 ? 0.05 : -0.05,
    //   });

    //     // setAwayPlayerScore((prevScore) => prevScore + 1);
    //     // console.log('away:', away_player_score);
    // }
    // //check if the ball goes beyond the right side, indicating a score for the player and reset the ball to the center
    // if (gameData.ball.x + ball.radius >= canvas.width) {
    //   setBall({
    //     x: 640,
    //     y: 360,
    //     radius: 15,
    //     speedX: Math.random() > 0.5 ? 0.05 : -0.05,
    //     speedY: Math.random() > 0.5 ? 0.05 : -0.05,
    //   });

        // setHomePlayerScore((prevScore) => prevScore + 1);
        // console.log('homescore:', home_player_score);
    }, []);


    // Check if the ball hits the player's paddle and reverse its horizontal direction
  //   if (
  //     gameData.ball.x - ball.radius <= gameData.home.x + 20 &&
  //     gameData.ball.x - ball.radius >= gameData.home.x &&
  //     gameData.ball.y >= gameData.away.y &&
  //     gameData.ball.y <= gameData.away.y + 144
  //   ) {
  //     setBall((prevBall) => ({ ...prevBall, speedX: Math.abs(prevBall.speedX) }));
  //   }

  //   // Check if the ball hits the enemy's paddle and reverse its horizontal direction
  //   if (
  //     ball.x + ball.radius >= gameData.away.x &&
  //     ball.x + ball.radius <= gameData.away.x + 144 &&
  //     ball.y >= gameData.away.y &&
  //     ball.y <= gameData.away.y + 144
  //   ) {
  //     setBall((prevBall) => ({ ...prevBall, speedX: -Math.abs(prevBall.speedX) }));
  //   }
  // });


  // //check paddle dont go beyond the canvas
  // if (gameData.home.y > 720 - paddleHeight) {
	// setPaddleY(720 - paddleHeight);
  // }
  // if (gameData.home.y < 0) {
	// setPaddleY(0);
  // }

  // if (gameData.away.y > 720 - paddleHeight) {
	// setEnemyPaddleY(720 - paddleHeight);
  // }
  // if (gameData.away.y < 0) {
	// setEnemyPaddleY(0);
  // }

  // Handle keyboard input for the player's paddle
  const handleKeyDown = (event: KeyboardEvent) => {
    // if (event.key === 'w' && gameData.home.y > 0) {
    //   setPaddleY((prevY) => prevY - 10);
    // } else if (event.key === 's' && gameData.home.y < canvasRef.current?.height - paddleHeight) {
    //   setPaddleY((prevY) => prevY + 10);
    // }
  };

  // Handle arrow keys for the enemy's paddle
  const handleArrowDown = (event: KeyboardEvent) => {
    // if (event.key === 'ArrowUp' && gameData.away.y > 0) {
    //   setEnemyPaddleY((prevY) => prevY - 10);
    // } else if (event.key === 'ArrowDown' && gameData.away.y < canvasRef.current?.height - paddleHeight) {
    //   setEnemyPaddleY((prevY) => prevY + 10);
    // }
  };
  // draw the score
    const drawScore = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const context = canvas.getContext('2d');
        if (!context) return;
    
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText(`Home: ${gameData.score.home} Away: ${gameData.score.away}`, 10, 50);
    };
    drawScore();
  useEffect(() => {
    // Add event listeners for keydown
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleArrowDown);

    // Cleanup function (remove event listeners)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleArrowDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ border: '1px solid black', background: 'lightblue' }}
      />
    </div>
  );
};

export default Game;
