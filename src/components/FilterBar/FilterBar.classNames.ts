import { mergeStyleSets } from "@fluentui/merge-styles";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export interface FilterBarClassNames {
  root: string;
  icon: string;
}

export const getClassNames = (): FilterBarClassNames => {
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
    icon: {
      marginLeft: 12,
      color: theme.palette.neutralTertiary,
    },
  });
};
