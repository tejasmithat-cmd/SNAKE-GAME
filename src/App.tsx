/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan font-mono flex flex-col items-center justify-center p-4 relative">
      <div className="scanlines"></div>
      <div className="crt-flicker absolute inset-0 pointer-events-none"></div>

      <header className="absolute top-8 left-8 z-10">
        <h1 className="text-4xl font-bold glitch-text text-cyan tracking-tighter" data-text="NEON_SERPENT_OS">
          NEON_SERPENT_OS
        </h1>
        <p className="text-magenta text-sm mt-1 animate-pulse">v1.0.4 // UNAUTHORIZED_ACCESS</p>
      </header>

      <div className="absolute top-8 right-8 w-80 z-20">
        <MusicPlayer />
      </div>

      <main className="z-10 mt-16">
        <SnakeGame />
      </main>

      <footer className="absolute bottom-4 left-4 text-cyan/40 text-xs z-10">
        SYS_TIME: {new Date().toISOString()}
      </footer>
    </div>
  );
}
