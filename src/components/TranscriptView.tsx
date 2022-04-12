import { getTheme, Spinner, SpinnerSize } from "@fluentui/react";
import {
  convertMilliseconds,
  Segment,
  Transcript,
} from "../utils/transcription";
import "styles/TranscriptView.css";
import { LoadingStatus } from "./App";

interface TranscriptProps {
  transcript: Transcript;
  loadingStatus: LoadingStatus;
  currentSeconds: number;
  onSetTime: (segment: Segment) => void;
}

function TranscriptView({
  transcript,
  loadingStatus,
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
      {loadingStatus === "loading" ? (
        <>
          <Spinner size={SpinnerSize.large} />
        </>
      ) : (
        transcript.map((phrase) => (
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
              <span className="TranscriptViewSegment__SpeakerTag">
                Speaker {phrase.speaker}
              </span>
            </div>
            <div>
              {!phrase.words
                ? phrase.text
                : phrase.words.map((word) => (
                    <span
                      key={`${word.offset}-${word.text}`}
                      className="TranscriptView__Word"
                      style={{
                        textDecoration: isActive(word)
                          ? "underline"
                          : undefined,
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
        ))
      )}
    </div>
  );
}
export default TranscriptView;
