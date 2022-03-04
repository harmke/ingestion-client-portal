import {
  convertMilliseconds,
  Phrase,
  Transcript,
} from "../utils/transcription";

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
            backgroundColor: isActive(phrase) && "yellow",
            cursor: "pointer",
            marginBottom: 20,
          }}
          onClick={() => {
            onSetTime(phrase);
          }}
        >
          {convertMilliseconds(phrase.offset)} -{" "}
          {convertMilliseconds(phrase.offset + phrase.duration)} -{" "}
          {phrase.phrase}
          <br />
        </div>
      ))}
    </div>
  );
}
export default TranscriptView;
