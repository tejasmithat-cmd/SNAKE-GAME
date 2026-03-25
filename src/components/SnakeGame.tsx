import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Game state refs to avoid dependency issues in loop
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      const { x, y } = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y === 0) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (y === 0) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (x === 0) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (x === 0) nextDirRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    let lastTime = 0;
    let animationFrameId: number;

    const gameLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);
      if (time - lastTime < SPEED) return;
      lastTime = time;

      // Update logic
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

      // Collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Collision with self
      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      snakeRef.current.unshift(newHead);

      // Food collision
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 10);
        foodRef.current = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } else {
        snakeRef.current.pop();
      }

      // Draw
      ctx.fillStyle = '#050505'; // Black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      for(let i=0; i<GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i*CELL_SIZE, 0);
        ctx.lineTo(i*CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*CELL_SIZE);
        ctx.lineTo(canvas.width, i*CELL_SIZE);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#ff00ff'; // Magenta
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      ctx.fillRect(foodRef.current.x * CELL_SIZE, foodRef.current.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Draw Snake
      ctx.fillStyle = '#00ffff'; // Cyan
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      snakeRef.current.forEach((segment, index) => {
        // Glitch effect on snake body randomly
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
        }
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
      });
      ctx.shadowBlur = 0; // Reset
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between mb-2 text-cyan font-bold text-2xl uppercase tracking-widest">
        <span>SCORE: {score.toString().padStart(4, '0')}</span>
        <span className="text-magenta">{gameOver ? 'SYSTEM_FAILURE' : isPaused ? 'PAUSED' : 'ACTIVE'}</span>
      </div>
      <div className="relative p-1 bg-cyan/20 border-2 border-cyan shadow-[0_0_20px_#00ffff]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="bg-black block"
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
            <div className="text-magenta text-4xl mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</div>
            <button
              onClick={resetGame}
              className="px-6 py-2 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-all uppercase tracking-widest cursor-pointer"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 text-cyan/50 text-sm uppercase tracking-widest text-center">
        [W,A,S,D] OR [ARROWS] TO INTERFACE.<br/>[SPACE] TO SUSPEND.
      </div>
    </div>
  );
}
