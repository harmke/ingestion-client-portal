import { mergeStyleSets } from "@fluentui/merge-styles";

export interface ConnectionStringBarClassNames {
  audioPlayer: string;
}

export const getClassNames = (): ConnectionStringBarClassNames => {
  return mergeStyleSets({
    audioPlayer: {
      margin: "25px 0px",

      maxHeight: "100%",
      maxWidth: "100%",
      objectFit: "contain",

      position: "sticky",
      top: 40,
    },
  });
};
