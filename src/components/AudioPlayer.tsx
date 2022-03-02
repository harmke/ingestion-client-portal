import { useRef, useState } from "react";
import { Transcript } from "../utils/transcription";
import TranscriptView from "./TranscriptView";

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
      >
        Your browser does not support the audio element
      </audio>
      <TranscriptView transcript={transcript} currentSeconds={currentSeconds} />
    </div>
  );
}

export default AudioPlayer;
