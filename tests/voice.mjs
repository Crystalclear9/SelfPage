import assert from 'node:assert/strict';
import { createVoicePlayer } from '../src/lib/voice-player.js';

const clips = [];
globalThis.Audio = class {
  constructor(src) { this.src = src; this.paused = true; clips.push(this); }
  play() {
    this.paused = false;
    return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; });
  }
  pause() { this.paused = true; }
};
let greetingPlaying = false, thanksPlaying = false, errors = 0;
const greeting = createVoicePlayer('greeting.mp3', { onPlaying: value => { greetingPlaying = value; } });
const thanks = createVoicePlayer('thanks.mp3', {
  onPlaying: value => { thanksPlaying = value; }, onError: () => errors++,
});
await createVoicePlayer('').play();
assert.equal(clips.length, 0);
const first = greeting.play();
await greeting.play(); // A pending request must not create an overlapping clip.
assert.equal(clips.length, 1);
const second = thanks.play();
assert.equal(clips[0].paused, true);
clips[0].resolve();
await first;
assert.equal(greetingPlaying, false);
clips[1].resolve();
await second;
assert.equal(thanksPlaying, true);
thanks.stop();
assert.equal(thanksPlaying, false);
assert.equal(clips[1].currentTime, 0);
const failed = thanks.play();
clips[1].reject(new Error('Unavailable file'));
await failed;
assert.equal(errors, 1);
assert.equal(thanksPlaying, false);
const retry = thanks.play();
clips[1].resolve();
await retry;
clips[1].onended();
assert.equal(thanksPlaying, false);
const cancelled = greeting.play();
greeting.toggle();
clips[0].reject(Object.assign(new Error('Stopped'), { name: 'AbortError' }));
await cancelled;
assert.equal(greetingPlaying, false);
assert.equal(errors, 1);
console.log('Voice playback: empty configuration, exclusivity, pending requests, stop, retry and completion passed.');
