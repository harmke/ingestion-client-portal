import { useRef, useState } from "react";
import { Segment, Transcript } from "utils/transcription";
import TranscriptView from "components/TranscriptView/TranscriptView";
import { LoadingStatus } from "components/App/App";
import { getClassNames } from "./AudioPlayer.classNames";

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
  const classNames = getClassNames();

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
        className={classNames.audioPlayer}
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
