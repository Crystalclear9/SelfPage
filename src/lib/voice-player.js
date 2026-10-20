let activePlayer;

// One voice at a time, including when a previous play request is still pending.
export function createVoicePlayer(src, { onPlaying = () => {}, onError = () => {} } = {}) {
  let audio;
  let version = 0;
  let running = false;
  const player = {
    stop() {
      version++;
      running = false;
      if (audio) {
        audio.pause();
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
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'none';
        audio.volume = .7;
        audio.onended = () => player.stop();
      }
      try {
        await audio.play();
        if (request === version) onPlaying(true);
      } catch (error) {
        if (request !== version) return;
        player.stop();
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
