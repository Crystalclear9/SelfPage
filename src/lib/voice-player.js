let activePlayer;

// One voice at a time, including when a previous play request is still pending.
export function createVoicePlayer(src, { onPlaying = () => {}, onError = () => {} } = {}) {
  let audio;
  let version = 0;
  let running = false;
  const player = {
    prepare() {
      if (!src || audio) return audio;
      const media = new Audio();
      audio = media;
      media.preload = 'auto';
      media.volume = .7;
      media.onended = () => {
        if (audio === media && media.ended) player.stop();
      };
      media.onerror = () => {
        if (audio !== media) return;
        const report = running && activePlayer === player;
        audio = undefined;
        if (report) { player.stop(); onError(); }
      };
      media.src = src;
      return media;
    },
    stop() {
      version++;
      running = false;
      if (audio && !audio.paused) {
        audio.pause();
      }
      if (audio?.currentTime > 0) {
        audio.currentTime = 0;
      }
      if (activePlayer === player) activePlayer = undefined;
      onPlaying(false);
    },
    async play() {
      if (!src || running) return;
      activePlayer?.stop();
      activePlayer = player;
      running = true;
      const request = ++version;
      const media = player.prepare();
      // The avatar can cancel this request while the browser buffers.
      onPlaying(true);
      try {
        await media.play();
      } catch (error) {
        if (request !== version) return;
        player.stop();
        audio = undefined;
        if (error.name !== 'AbortError') onError();
      }
    },
    toggle() {
      if (running) player.stop();
      else void player.play();
    },
  };
  return player;
}
