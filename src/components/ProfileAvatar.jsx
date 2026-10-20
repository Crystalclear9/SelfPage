import { useEffect, useState } from 'react';
import useVoice from '../lib/useVoice';

export default function ProfileAvatar({ enabled, onGreet, voiceSrc = '' }) {
  const [greeting, setGreeting] = useState(false);
  const voice = useVoice(voiceSrc, () => onGreet('语音暂时无法播放，请稍后再试。'));
  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => setGreeting(false), 850);
    return () => clearTimeout(timer);
  }, [greeting]);

  const greet = () => {
    if (!greeting) {
      setGreeting(true);
      onGreet();
    }
    voice.toggle();
  };

  return <button className={`avatar avatar-button${greeting || voice.playing ? ' is-greeting' : ''}`}
    type="button" disabled={!enabled}
    aria-label={voiceSrc ? (voice.playing ? '停止加藤惠语音' : '播放加藤惠语音') : '向 Crystalclear9 打个招呼'}
    title={voiceSrc ? (voice.playing ? '停止语音' : '点击听一句问候') : '打个招呼'}
    onClick={greet}>
    <img src={`${import.meta.env.BASE_URL}images/keyvisual-3.jpg`} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" />
    </button>;
}
