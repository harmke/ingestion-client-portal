import { mergeStyleSets } from "@fluentui/merge-styles";
import { FontWeights, getTheme } from "@fluentui/react";

const theme = getTheme();

export interface SideBarClassNames {
  root: string;
  title: string;
  searchBar: string;
  queryTitle: string;
  queryIcon: string;
}

export const getClassNames = (): SideBarClassNames => {
  return mergeStyleSets({
    root: {
      width: "100%",
      height: "100%",
      borderRight: `1px solid ${theme.palette.neutralSecondary}`,
      backgroundColor: theme.palette.neutralLighterAlt,
    },

    title: {
      ...theme.fonts.mediumPlus,
      fontWeight: FontWeights.semibold,
      color: theme.palette.neutralPrimary,
      lineHeight: 40,
      height: 40,
      paddingLeft: 8,
      borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
    },

    searchBar: {
      padding: 5,
      borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
    },
    queryTitle: {
      ...theme.fonts.medium,
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
      paddingTop: 8,
      fontWeight: FontWeights.semibold,
    },
    queryIcon: {
      marginRight: 8,
    },
  });
};
