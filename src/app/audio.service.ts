import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  constructor() {}

  async playMusic(audioUrl: string, volume: number = 1.0) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    this.stopMusic();

    try {
      // Fetch the audio file
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Create an audio source
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = audioBuffer;

      // Create a gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = volume;

      // Connect nodes
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start playing
      this.source.start();

      this.isPlaying = true;

      // When music finishes, reset isPlaying
      this.source.onended = () => {
        this.isPlaying = false;
      };
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  stopMusic() {
    if (this.source) {
      this.source.stop();
      this.source = null;
      this.isPlaying = false;
    }
  }
}
