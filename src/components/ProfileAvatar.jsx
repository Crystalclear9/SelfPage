import { useEffect, useState } from 'react';
import useVoice, { useTouchVoiceWarmup } from '../lib/useVoice';

export default function ProfileAvatar({ enabled, voiceSrc = '' }) {
  const [greeting, setGreeting] = useState(false);
  const voice = useVoice(voiceSrc);
  const control = useTouchVoiceWarmup(enabled ? voice.prepare : null);
  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => setGreeting(false), 850);
    return () => clearTimeout(timer);
  }, [greeting]);

  const greet = () => {
    if (!greeting) {
      setGreeting(true);
    }
    if (!voice.playing) document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'greeting' }));
    voice.toggle();
  };

  return <button className={`avatar avatar-button${greeting || voice.playing ? ' is-greeting' : ''}`}
    ref={control} type="button" disabled={!enabled}
    onPointerEnter={voice.prepare} onFocus={voice.prepare} onPointerDown={voice.prepare}
    aria-label={voiceSrc ? (voice.playing ? '停止加藤惠语音' : '播放加藤惠语音') : '向 Crystalclear9 打个招呼'}
    onClick={greet}>
    <img src={`${import.meta.env.BASE_URL}images/keyvisual-3.jpg`} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" />
    </button>;
}
