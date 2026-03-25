import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI_GEN_01.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'NEURAL_NET_BEAT.MP3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SYNTH_GHOST.FLAC', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="border-2 border-magenta p-4 bg-black/80 shadow-[0_0_15px_#ff00ff] relative overflow-hidden">
       <h2 className="text-magenta text-xl mb-4 glitch-text" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
       <div className="flex items-center justify-between mb-4">
         <div className="text-cyan text-sm truncate w-48 animate-pulse">
           &gt; {TRACKS[currentTrack].title}
         </div>
         <div className="flex gap-2">
           <button onClick={prevTrack} className="text-cyan hover:text-magenta transition-colors"><SkipBack size={20} /></button>
           <button onClick={togglePlay} className="text-cyan hover:text-magenta transition-colors">
             {isPlaying ? <Pause size={20} /> : <Play size={20} />}
           </button>
           <button onClick={nextTrack} className="text-cyan hover:text-magenta transition-colors"><SkipForward size={20} /></button>
         </div>
       </div>
       <audio
         ref={audioRef}
         src={TRACKS[currentTrack].url}
         onEnded={nextTrack}
         className="hidden"
       />
       <div className="h-1 w-full bg-cyan/20">
         <div className="h-full bg-magenta animate-[pulse_2s_infinite]" style={{ width: isPlaying ? '100%' : '0%', transition: 'width 0.5s linear' }}></div>
       </div>
    </div>
  );
}
