import { mergeStyleSets } from "@fluentui/merge-styles";

export interface AppClassNames {
  root: string;
  navBar: string;
  mainBody: string;
  sideBar: string;
  paginationContainer: string;
}

export const getClassNames = (): AppClassNames => {
  return mergeStyleSets({
    root: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gridTemplateRows: "min-content 1fr",
      gridTemplateAreas: `"header header header header header"
          "sidebar main main main main"`,
      columnGap: 5,
      height: "100%",
    },
    navBar: {
      gridArea: "header",
    },
    sideBar: {
      gridArea: "sidebar",
    },
    mainBody: {
      gridArea: "main",
      overflowY: "scroll",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 10,
    },
  });
};
