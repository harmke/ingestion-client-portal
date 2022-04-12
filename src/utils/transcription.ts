export interface RecognizedPhrase {
  offsetInTicks: string;
  durationInTicks: string;
  recognitionStatus: string;
  channel?: number;
  speaker?: number;
  nBest: {
    display: string;
    words?: {
      word: string;
      offsetInTicks: string;
      durationInTicks: string;
    }[];
  }[];
}

export interface JsonResultOutput {
  recognizedPhrases: RecognizedPhrase[];
}

export interface Segment {
  text: string;
  offset: number;
  duration: number;
}

export interface Word extends Segment {}

export interface Phrase extends Segment {
  recognitionStatus: string;
  speaker: number;
  words?: Word[];
}

export interface Transcript extends Array<Phrase> {}

export const convertMilliseconds = (milli: number) => {
  if (milli < 3600000) {
    // if it's less than an hour, then just give the user mm:ss
    return new Date(milli).toISOString().substr(14, 5);
  }
  return new Date(milli).toISOString().substr(11, 8);
};

export function generateTranscript(
  jsonResultOutput: JsonResultOutput
): Transcript {
  const unsorted = jsonResultOutput.recognizedPhrases.map(
    ({
      offsetInTicks,
      durationInTicks,
      recognitionStatus,
      nBest,
      channel,
      speaker,
    }) => ({
      offset: parseInt(offsetInTicks) / 10000,
      duration: parseInt(durationInTicks) / 10000,
      recognitionStatus,
      text: nBest[0]?.display,
      speaker: speaker || (channel || 0) + 1,
      words: nBest[0]?.words?.map(
        ({ word, durationInTicks, offsetInTicks }) => ({
          text: word,
          duration: parseInt(durationInTicks) / 10000,
          offset: parseInt(offsetInTicks) / 10000,
        })
      ),
    })
  );
  return unsorted.sort((a, b) => a.offset - b.offset);
}
