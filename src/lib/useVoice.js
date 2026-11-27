import { useEffect, useRef, useState } from 'react';
import { createVoicePlayer } from './voice-player';

export default function useVoice(src, onError) {
  const player = useRef(null);
  const errorHandler = useRef(onError);
  errorHandler.current = onError;
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const voice = createVoicePlayer(src, {
      onPlaying: setPlaying,
      onError: () => errorHandler.current?.(),
    });
    player.current = voice;
    window.addEventListener('pagehide', voice.stop);
    return () => {
      voice.stop();
      player.current = null;
      window.removeEventListener('pagehide', voice.stop);
    };
  }, [src]);
  return {
    playing,
    play: () => player.current?.play(),
    stop: () => player.current?.stop(),
    toggle: () => player.current?.toggle(),
  };
}
