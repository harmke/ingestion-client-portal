import { useRef, useState } from "react";
import { Segment, Transcript } from "utils/transcription";
import TranscriptView from "./TranscriptView";
import "styles/AudioPlayer.css";
import { LoadingStatus } from "./App";

interface AudioPlayerProps {
  src: string;
  transcript: Transcript;
  transcriptLoadingStatus: LoadingStatus;
}

function AudioPlayer({
  src,
  transcript,
  transcriptLoadingStatus,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current == null || transcript.length === 0) return;
    setCurrentSeconds(audioRef.current.currentTime);
  };

  const handleSetTime = (segment: Segment) => {
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
        autoPlay={transcriptLoadingStatus === "successful"}
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
        loadingStatus={transcriptLoadingStatus}
        currentSeconds={currentSeconds}
        onSetTime={handleSetTime}
      />
    </div>
  );
}

export default AudioPlayer;
