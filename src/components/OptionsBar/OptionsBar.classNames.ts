import { mergeStyleSets } from "@fluentui/merge-styles";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export interface OptionsBarClassNames {
  root: string;
  tag: string;
}

export const getClassNames = (): OptionsBarClassNames => {
  return mergeStyleSets({
    root: {
      display: "flex",
      alignItems: "center",
      height: 32,
      paddingBottom: 8,
      paddingTop: 8,
      paddingLeft: 24,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    tag: {
      marginRight: 24,
    },
  });
};
