import { useEffect, useState } from 'react';

export default function ProfileAvatar({ enabled, onGreet }) {
  const [greeting, setGreeting] = useState(false);
  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => setGreeting(false), 850);
    return () => clearTimeout(timer);
  }, [greeting]);

  return <button className={`avatar avatar-button${greeting ? ' is-greeting' : ''}`}
    type="button" disabled={!enabled} aria-label="向 Crystalclear9 打个招呼" title="打个招呼"
    onClick={() => { if (!greeting) { setGreeting(true); onGreet(); } }}>
    <img src={`${import.meta.env.BASE_URL}images/keyvisual-3.jpg`} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" />
  </button>;
}
