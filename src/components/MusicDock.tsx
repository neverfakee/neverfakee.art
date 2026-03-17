import { useEffect, useRef, useState } from "react";

const TRACK_SRC = "audio/aces-slowed-lofi.mp3";

export function MusicDock() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    let active = true;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.28;
    audio.preload = "auto";

    const tryPlay = async () => {
      try {
        await audio.play();
        if (active) setAutoplayBlocked(false);
      } catch {
        if (active) setAutoplayBlocked(true);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setAutoplayBlocked(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsMissing(true);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", tryPlay);

    const onIntroDone = () => {
      void tryPlay();
    };
    window.addEventListener("intro:done", onIntroDone);

    const onFirstGesture = () => {
      void tryPlay();
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });

    const onFirstKeydown = () => {
      void tryPlay();
    };
    window.addEventListener("keydown", onFirstKeydown, { once: true });

    const onFocus = () => {
      if (!audio.paused) return;
      void tryPlay();
    };
    window.addEventListener("focus", onFocus);

    void tryPlay();

    void fetch(TRACK_SRC, { method: "HEAD" })
      .then((res) => {
        if (active && !res.ok) setIsMissing(true);
      })
      .catch(() => {
        if (active) setIsMissing(true);
      });

    return () => {
      active = false;
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", tryPlay);
      window.removeEventListener("intro:done", onIntroDone);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstKeydown);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || isMissing) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <aside
      className={`music-dock glass-panel${isMissing ? " music-dock--missing" : ""}`}
    >
      <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" autoPlay />
      <button
        type="button"
        className="music-dock__toggle"
        onClick={togglePlayback}
        disabled={isMissing}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="music-dock__copy">
        <strong>Aces Slowed Lofi</strong>
        <span>
          {isMissing
            ? "Add /public/audio/aces-slowed-lofi.mp3"
            : isPlaying
              ? "Ambient track playing"
              : autoplayBlocked
                ? "Browser blocked autoplay, click play"
                : "Trying to autoplay..."}
        </span>
      </div>
    </aside>
  );
}
