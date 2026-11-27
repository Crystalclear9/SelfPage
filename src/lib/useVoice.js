import { useCallback, useEffect, useRef, useState } from 'react';
import { createVoicePlayer } from './voice-player';

export default function useVoice(src, onError) {
  const player = useRef(null);
  const errorHandler = useRef(onError);
  errorHandler.current = onError;
  const [playing, setPlaying] = useState(false);
  const prepare = useCallback(() => player.current?.prepare(), []);
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
    prepare,
    play: () => player.current?.play(),
    stop: () => player.current?.stop(),
    toggle: () => player.current?.toggle(),
  };
}

// Touch has no hover interval before a tap. Buffer the relevant clip once
// the reader reaches its control, including after scroll restoration.
export function useTouchVoiceWarmup(prepare) {
  const control = useRef(null);
  useEffect(() => {
    if (!prepare || !control.current || !matchMedia('(any-pointer: coarse)').matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        prepare();
        observer.disconnect();
      }
    });
    observer.observe(control.current);
    return () => observer.disconnect();
  }, [prepare]);
  return control;
}
