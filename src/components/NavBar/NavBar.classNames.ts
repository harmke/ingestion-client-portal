import { mergeStyleSets } from "@fluentui/merge-styles";
import { FontWeights, getTheme } from "@fluentui/react";

const theme = getTheme();

export interface NavBarClassNames {
  root: string;
  left: string;
  right: string;
  icon: string;
  logo: string;
  title: string;
  tabName: string;
}

export const getClassNames = (): NavBarClassNames => {
  return mergeStyleSets({
    root: {
      display: "flex",
      backgroundColor: theme.palette.neutralPrimaryAlt,
      color: theme.palette.white,
      justifyContent: "space-between",
    },
    left: {
      display: "flex",
      alignItems: "center",
    },
    right: {
      display: "flex",
      alignItems: "center",
      paddingRight: 16,
    },
    icon: {
      color: theme.palette.neutralLight,
      marginRight: 16,
    },
    logo: {
      display: "block",
      paddingLeft: 16,
      height: 32,
    },
    title: {
      paddingLeft: 16,
      paddingRight: 16,
      fontWeight: FontWeights.semibold,
    },
    tabName: {
      paddingLeft: 16,
      paddingRight: 16,
      lineHeight: 48,
      color: theme.palette.neutralTertiaryAlt,
      fontWeight: FontWeights.semibold,
    },
  });
};
