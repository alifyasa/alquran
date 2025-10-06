export class AudioPlayer {
  private audio: HTMLAudioElement;
  private playPauseBtn: HTMLButtonElement;
  private playIcon: HTMLSpanElement;
  private progressBar: HTMLInputElement;
  private currentTimeEl: HTMLSpanElement;
  private durationEl: HTMLSpanElement;
  private skipBackBtn: HTMLButtonElement;
  private skipForwardBtn: HTMLButtonElement;
  private muteBtn: HTMLButtonElement;
  private volumeSlider: HTMLInputElement;
  private loopBtn: HTMLButtonElement;

  private repeatIcon: Element | null;
  private repeatOneIcon: Element | null;
  private playSpinner: SVGSVGElement;
  private playArrow: Element | null;
  private pauseIcon: Element | null;
  private volumeUp: Element | null;
  private volumeOff: Element | null;

  private isLooping = false;
  private lastVolume = 1;
  private surahNumber: number;

  constructor(
    elements: {
      audio: HTMLAudioElement;
      playPauseBtn: HTMLButtonElement;
      playIcon: HTMLSpanElement;
      progressBar: HTMLInputElement;
      currentTimeEl: HTMLSpanElement;
      durationEl: HTMLSpanElement;
      skipBackBtn: HTMLButtonElement;
      skipForwardBtn: HTMLButtonElement;
      muteBtn: HTMLButtonElement;
      volumeSlider: HTMLInputElement;
      loopBtn: HTMLButtonElement;
      repeatIcon: Element | null;
      repeatOneIcon: Element | null;
      playSpinner: SVGSVGElement;
      playArrow: Element | null;
      pauseIcon: Element | null;
      volumeUp: Element | null;
      volumeOff: Element | null;
    },
    reciter: string,
    surahNumber: number,
  ) {
    this.audio = elements.audio;
    this.playPauseBtn = elements.playPauseBtn;
    this.playIcon = elements.playIcon;
    this.progressBar = elements.progressBar;
    this.currentTimeEl = elements.currentTimeEl;
    this.durationEl = elements.durationEl;
    this.skipBackBtn = elements.skipBackBtn;
    this.skipForwardBtn = elements.skipForwardBtn;
    this.muteBtn = elements.muteBtn;
    this.volumeSlider = elements.volumeSlider;
    this.loopBtn = elements.loopBtn;
    this.repeatIcon = elements.repeatIcon;
    this.repeatOneIcon = elements.repeatOneIcon;
    this.playSpinner = elements.playSpinner;
    this.playArrow = elements.playArrow;
    this.pauseIcon = elements.pauseIcon;
    this.volumeUp = elements.volumeUp;
    this.volumeOff = elements.volumeOff;
    this.surahNumber = surahNumber;

    // Set audio source
    this.audio.src = `https://download.quranicaudio.com/quran/${reciter}/${surahNumber.toString().padStart(3, "0")}.mp3`;

    // Load saved volume
    const savedVolume = localStorage.getItem("recitation-volume") || "1";
    this.audio.volume = parseFloat(savedVolume);
    this.volumeSlider.value = savedVolume;
    this.lastVolume = parseFloat(savedVolume);

    this.updateMuteIcon();
    this.addEventListeners();
  }

  private updateMuteIcon() {
    if (this.audio.muted) {
      this.volumeUp?.classList.add("hidden");
      this.volumeOff?.classList.remove("hidden");
    } else {
      this.volumeUp?.classList.remove("hidden");
      this.volumeOff?.classList.add("hidden");
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  private updateProgress() {
    if (this.audio.duration) {
      this.progressBar.value = (
        (this.audio.currentTime / this.audio.duration) *
        100
      ).toString();
      this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    }
  }

  private addEventListeners() {
    // Play/Pause
    this.playPauseBtn.addEventListener("click", () => {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    });

    this.audio.addEventListener("play", () => {
      this.playArrow?.classList.add("hidden");
      this.pauseIcon?.classList.remove("hidden");
    });

    this.audio.addEventListener("pause", () => {
      this.playArrow?.classList.remove("hidden");
      this.pauseIcon?.classList.add("hidden");
    });

    // Progress bar
    this.progressBar.addEventListener("input", () => {
      const seekTime =
        (parseFloat(this.progressBar.value) / 100) * this.audio.duration;
      this.audio.currentTime = seekTime;
    });

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("loadedmetadata", () => this.updateProgress());

    // Skip controls
    this.skipBackBtn.addEventListener("click", () => {
      this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
    });

    this.skipForwardBtn.addEventListener("click", () => {
      this.audio.currentTime = Math.min(
        this.audio.duration,
        this.audio.currentTime + 10,
      );
    });

    // Volume
    this.volumeSlider.addEventListener("input", () => {
      if (this.audio.muted) {
        this.audio.muted = false;
        this.updateMuteIcon();
      }
      this.audio.volume = parseFloat(this.volumeSlider.value);
      this.lastVolume = this.audio.volume;
      localStorage.setItem("recitation-volume", this.volumeSlider.value);
    });

    this.volumeSlider.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      let newVolume = parseFloat(this.volumeSlider.value) + delta;
      newVolume = Math.max(0, Math.min(1, newVolume));
      this.volumeSlider.value = newVolume.toString();
      this.audio.volume = newVolume;
      this.lastVolume = newVolume;
      localStorage.setItem("recitation-volume", newVolume.toString());
      if (this.audio.muted) {
        this.audio.muted = false;
        this.updateMuteIcon();
      }
    });

    this.muteBtn.addEventListener("click", () => {
      if (this.audio.muted) {
        // Unmuting: restore previous volume
        this.audio.volume = this.lastVolume;
        this.volumeSlider.value = this.lastVolume.toString();
      } else {
        // Muting: store current volume and set to 0
        this.lastVolume = this.audio.volume;
        this.audio.volume = 0;
        this.volumeSlider.value = "0";
      }
      this.audio.muted = !this.audio.muted;
      this.updateMuteIcon();
    });

    // Loop toggle
    this.loopBtn.addEventListener("click", () => {
      this.isLooping = !this.isLooping;
      if (this.isLooping) {
        this.repeatIcon?.classList.add("hidden");
        this.repeatOneIcon?.classList.remove("hidden");
      } else {
        this.repeatIcon?.classList.remove("hidden");
        this.repeatOneIcon?.classList.add("hidden");
      }
    });

    // Error
    this.audio.addEventListener("error", () => {
      this.playPauseBtn.disabled = true;
    });

    // Buffering spinner
    this.audio.addEventListener("waiting", () => {
      this.playIcon.classList.add("hidden");
      this.playSpinner.classList.remove("hidden");
    });

    this.audio.addEventListener("playing", () => {
      this.playIcon.classList.remove("hidden");
      this.playSpinner.classList.add("hidden");
    });

    // Loop functionality
    this.audio.addEventListener("ended", () => {
      if (this.isLooping) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
    });
  }

  public changeReciter(newReciter: string) {
    this.audio.src = `https://download.quranicaudio.com/quran/${newReciter}/${this.surahNumber.toString().padStart(3, "0")}.mp3`;
    this.audio.load();
    this.audio.currentTime = 0;
    this.audio.pause();
    // Update UI
    this.playArrow?.classList.remove("hidden");
    this.pauseIcon?.classList.add("hidden");
    this.progressBar.value = "0";
    this.currentTimeEl.textContent = "0:00";
    this.durationEl.textContent = "0:00";
  }
}
