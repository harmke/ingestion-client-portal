export interface RecognizedPhrase {
  offsetInTicks: string;
  durationInTicks: string;
  recognitionStatus: string;
  nBest: {
    display: string;
    words: {
      word: string;
      offsetInTicks: string;
      durationInTicks: string;
    }[];
  }[];
}

export interface JsonResultOutput {
  recognizedPhrases: RecognizedPhrase[];
}

export interface Word {
  word: string;
  offset: number;
}

export interface Phrase {
  offset: number;
  duration: number;
  recognitionStatus: string;
  phrase: string;
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
  return jsonResultOutput.recognizedPhrases.map(
    ({ offsetInTicks, durationInTicks, recognitionStatus, nBest }) => ({
      offset: parseInt(offsetInTicks) / 10000,
      duration: parseInt(durationInTicks) / 10000,
      recognitionStatus,
      phrase: nBest[0]?.display,
    })
  );
}
