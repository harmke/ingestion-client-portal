import { getTheme } from "@fluentui/react";
import {
  convertMilliseconds,
  Phrase,
  Segment,
  Transcript,
} from "../utils/transcription";
import "styles/TranscriptView.css";

interface TranscriptProps {
  transcript: Transcript;
  currentSeconds: number;
  onSetTime: (segment: Segment) => void;
}

function TranscriptView({
  transcript,
  currentSeconds,
  onSetTime,
}: TranscriptProps) {
  const theme = getTheme();

  const isActive = (segment: Segment) => {
    // if (interaction.transcriptAudioURI === '') return '';
    const offsetSecs = segment.offset / 1000;
    const endSecs = offsetSecs + segment.duration / 1000;
    return currentSeconds >= offsetSecs && currentSeconds < endSecs;
  };

  return (
    <div>
      {transcript.map((phrase) => (
        <div
          key={`${phrase.offset}-${phrase.text}`}
          style={{
            backgroundColor: isActive(phrase)
              ? theme.palette.themeLighterAlt
              : undefined,
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
          {/* {phrase.text} */}
          <div>
            {phrase.words.map((word) => (
              <span
                key={`${word.offset}-${word.text}`}
                className="TranscriptView__Word"
                style={{
                  textDecoration: isActive(word) ? "underline" : undefined,
                }}
                onClick={(event) => {
                  onSetTime(word);
                  event.stopPropagation();
                }}
              >
                {word.text}{" "}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default TranscriptView;
