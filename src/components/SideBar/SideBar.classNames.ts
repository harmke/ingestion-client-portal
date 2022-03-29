import { mergeStyleSets } from "@fluentui/merge-styles";

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
      width: "240px",
      height: "100vh",
      borderRight: "1px solid lightgrey",
      backgroundColor: "#f2f6f9",
    },

    title: {
      fontWeight: 600,
      fontSize: "16px",
      color: "#323130",
      lineHeight: 40,
      height: 40,
      paddingLeft: 8,
      borderBottom: "1px solid lightgrey",
    },

    searchBar: {
      padding: 5,
      borderBottom: "1px solid lightgrey",
    },
    queryTitle: {
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
      paddingTop: 8,
      fontWeight: 600,
    },
    queryIcon: {
      marginRight: 8,
    },
  });
};
