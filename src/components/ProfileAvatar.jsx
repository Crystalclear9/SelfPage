import { useEffect, useRef, useState } from 'react';

export default function ProfileAvatar({ enabled, onGreet, voiceSrc = '' }) {
  const audio = useRef(null);
  const [greeting, setGreeting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    const player = audio.current;
    const stop = () => {
      player?.pause();
      pending.current = false;
      setPlaying(false);
    };
    window.addEventListener('pagehide', stop);
    return () => {
      player?.pause();
      window.removeEventListener('pagehide', stop);
    };
  }, [voiceSrc]);
  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => setGreeting(false), 850);
    return () => clearTimeout(timer);
  }, [greeting]);

  const greet = async () => {
    if (!greeting) {
      setGreeting(true);
      onGreet();
    }
    const player = audio.current;
    if (!player || pending.current) return;
    if (!player.paused) {
      player.pause();
      player.currentTime = 0;
      setPlaying(false);
      return;
    }
    pending.current = true;
    player.currentTime = 0;
    player.volume = .7;
    try {
      await player.play();
    } catch (error) {
      if (error.name !== 'AbortError') onGreet('语音暂时无法播放，请稍后再试。');
      setPlaying(false);
    } finally {
      pending.current = false;
    }
  };

  return <>
    <button className={`avatar avatar-button${greeting || playing ? ' is-greeting' : ''}`}
    type="button" disabled={!enabled}
    aria-label={voiceSrc ? (playing ? '停止加藤惠语音' : '播放加藤惠语音') : '向 Crystalclear9 打个招呼'}
    title={voiceSrc ? (playing ? '停止语音' : '点击听一句问候') : '打个招呼'}
    onClick={greet}>
    <img src={`${import.meta.env.BASE_URL}images/keyvisual-3.jpg`} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" />
    </button>
    {voiceSrc && <audio ref={audio} src={voiceSrc} preload="none"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)} />}
  </>;
}
