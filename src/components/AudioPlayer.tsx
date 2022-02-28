import { useRef } from "react";

interface AudioPlayerProps {
  src: string;
}

function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef(null);
  return (
    <div>
      <audio
        ref={audioRef}
        controls
        autoPlay
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        //   onTimeUpdate={OnTimeUpdate}
        src={src}
      >
        Your browser does not support the audio element
      </audio>
    </div>
  );
}

export default AudioPlayer;
