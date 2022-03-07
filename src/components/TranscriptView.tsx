import { getTheme } from "@fluentui/react";
import {
  convertMilliseconds,
  Phrase,
  Transcript,
} from "../utils/transcription";
import "styles/TranscriptView.css";

interface TranscriptProps {
  transcript: Transcript;
  currentSeconds: number;
  onSetTime: (segment: Phrase) => void;
}

function TranscriptView({
  transcript,
  currentSeconds,
  onSetTime,
}: TranscriptProps) {
  const theme = getTheme();

  const isActive = (segment: Phrase) => {
    // if (interaction.transcriptAudioURI === '') return '';
    const offsetSecs = segment.offset / 1000;
    const endSecs = offsetSecs + segment.duration / 1000;
    return currentSeconds >= offsetSecs && currentSeconds < endSecs
      ? " active"
      : "";
  };

  return (
    <div>
      {transcript.map((phrase) => (
        <div
          key={phrase.offset}
          style={{
            backgroundColor: isActive(phrase) && theme.palette.themeLighterAlt,
          }}
          onClick={() => {
            onSetTime(phrase);
          }}
          className="TranscriptViewSegmentContainer"
        >
          <div className="TranscriptViewSegmentTimestamp">
            {convertMilliseconds(phrase.offset)} -{" "}
            {convertMilliseconds(phrase.offset + phrase.duration)}
          </div>
          {phrase.phrase}
        </div>
      ))}
    </div>
  );
}
export default TranscriptView;
