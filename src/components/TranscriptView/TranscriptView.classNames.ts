import { mergeStyleSets } from "@fluentui/merge-styles";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export interface TranscriptViewClassNames {
  segmentContainer: string;
  segmentTimestamp: string;
  segmentSpeakerTag: string;
  word: string;
}

export const getClassNames = (): TranscriptViewClassNames => {
  return mergeStyleSets({
    segmentContainer: {
      padding: "20px 5px",
      cursor: "pointer",
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      selectors: {
        ":hover": {
          backgroundColor: theme.palette.neutralLight,
        },
      },
    },
    segmentTimestamp: {
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      marginBottom: 4,
    },
    segmentSpeakerTag: {
      marginLeft: 16,
      lineHeight: "100%",
      height: "100%",
      color: theme.palette.themePrimary,
    },
    word: {
      selectors: {
        ":hover": {
          backgroundColor: theme.palette.neutralTertiaryAlt,
        },
      },
    },
  });
};
