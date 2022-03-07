import { useRef, useState } from "react";
import { Phrase, Transcript } from "utils/transcription";
import TranscriptView from "./TranscriptView";
import "styles/AudioPlayer.css";

interface AudioPlayerProps {
  src: string;
  transcript: Transcript;
}

function AudioPlayer({ src, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current == null || transcript.length === 0) return;
    setCurrentSeconds(audioRef.current.currentTime);
  };

  const handleSetTime = (segment: Phrase) => {
    if (!audioRef.current) return;
    const newTime = segment.offset / 1000;
    setCurrentSeconds(newTime);
    audioRef.current.currentTime = newTime;
  };

  return (
    <div>
      <audio
        ref={audioRef}
        controls
        autoPlay
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
        src={src}
        className="AudioPlayerAudioElement"
      >
        Your browser does not support the audio element
      </audio>
      <TranscriptView
        transcript={transcript}
        currentSeconds={currentSeconds}
        onSetTime={handleSetTime}
      />
    </div>
  );
}

export default AudioPlayer;
