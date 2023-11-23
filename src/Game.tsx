import React, { useRef, useEffect, useState } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paddleY, setPaddleY] = useState(315);
  const [paddleX, setPaddleX] = useState(0);

  const paddleHeight = 90;
  const paddleWidth = 20;
  const [enemyPaddleY, setEnemyPaddleY] = useState(360);
  const [enemyPaddleX, setEnemyPaddleX] = useState(1260);


  const [home_player_score, setHomePlayerScore] = useState(0);
  const [away_player_score, setAwayPlayerScore] = useState(0);


  const [ball, setBall] = useState({
    x: 640,
    y: 360,
    radius: 15,
    speedX: Math.random() > 0.5 ? 0.05 : -0.05,
    speedY: Math.random() > 0.5 ? 0.05 : -0.05,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;	

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = 'red';
    context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    context.fillStyle = 'purple';
    context.fillRect(enemyPaddleX, enemyPaddleY, paddleWidth, paddleHeight);

    // Draw the ball
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    context.fillStyle = 'green';
    context.fill();
    context.closePath();

    // Move the ball based on its direction
    setBall((prevBall) => ({
      ...prevBall,
      x: prevBall.x + prevBall.speedX,
      y: prevBall.y + prevBall.speedY,
    }));
    
    // check if the ball hits the bottom only and reverse its vertical direction
    if (ball.y + ball.radius >= canvas.height) {
      setBall((prevBall) => ({ ...prevBall, speedY: -Math.abs(prevBall.speedY) }));
    }

    // check if the ball hits the top only and reverse its vertical direction
    if (ball.y - ball.radius <= 0) {
      setBall((prevBall) => ({ ...prevBall, speedY: Math.abs(prevBall.speedY) }));
    }

  
    // check if the ball goes beyond the left side, indicating a score for the enemy and reset the ball to the center
    if (ball.x - ball.radius <= 0) {
      setBall({
        x: 640,
        y: 360,
        radius: 15,
        speedX: Math.random() > 0.5 ? 0.05 : -0.05,
        speedY: Math.random() > 0.5 ? 0.05 : -0.05,
      });

        setAwayPlayerScore((prevScore) => prevScore + 1);
        console.log('away:', away_player_score);
    }
    //check if the ball goes beyond the right side, indicating a score for the player and reset the ball to the center
    if (ball.x + ball.radius >= canvas.width) {
      setBall({
        x: 640,
        y: 360,
        radius: 15,
        speedX: Math.random() > 0.5 ? 0.05 : -0.05,
        speedY: Math.random() > 0.5 ? 0.05 : -0.05,
      });

        setHomePlayerScore((prevScore) => prevScore + 1);
        console.log('homescore:', home_player_score);
    }


    // Check if the ball hits the player's paddle and reverse its horizontal direction
    if (
      ball.x - ball.radius <= paddleX + paddleWidth &&
      ball.x - ball.radius >= paddleX &&
      ball.y >= paddleY &&
      ball.y <= paddleY + paddleHeight
    ) {
      setBall((prevBall) => ({ ...prevBall, speedX: Math.abs(prevBall.speedX) }));
    }

    // Check if the ball hits the enemy's paddle and reverse its horizontal direction
    if (
      ball.x + ball.radius >= enemyPaddleX &&
      ball.x + ball.radius <= enemyPaddleX + paddleWidth &&
      ball.y >= enemyPaddleY &&
      ball.y <= enemyPaddleY + paddleHeight
    ) {
      setBall((prevBall) => ({ ...prevBall, speedX: -Math.abs(prevBall.speedX) }));
    }
  });


  //check paddle dont go beyond the canvas
  if (paddleY > 720 - paddleHeight) {
	setPaddleY(720 - paddleHeight);
  }
  if (paddleY < 0) {
	setPaddleY(0);
  }

  if (enemyPaddleY > 720 - paddleHeight) {
	setEnemyPaddleY(720 - paddleHeight);
  }
  if (enemyPaddleY < 0) {
	setEnemyPaddleY(0);
  }

  // Handle keyboard input for the player's paddle
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'w' && paddleY > 0) {
      setPaddleY((prevY) => prevY - 10);
    } else if (event.key === 's' && paddleY < canvasRef.current?.height - paddleHeight) {
      setPaddleY((prevY) => prevY + 10);
    }
  };

  // Handle arrow keys for the enemy's paddle
  const handleArrowDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && enemyPaddleY > 0) {
      setEnemyPaddleY((prevY) => prevY - 10);
    } else if (event.key === 'ArrowDown' && enemyPaddleY < canvasRef.current?.height - paddleHeight) {
      setEnemyPaddleY((prevY) => prevY + 10);
    }
  };
  // draw the score
    const drawScore = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const context = canvas.getContext('2d');
        if (!context) return;
    
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText(`Home: ${home_player_score} Away: ${away_player_score}`, 10, 50);
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
