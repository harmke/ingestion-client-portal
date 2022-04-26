import { mergeStyleSets } from "@fluentui/merge-styles";

export interface ConnectionStringBarClassNames {
  root: string;
  label: string;
  textField: string;
}

export const getClassNames = (): ConnectionStringBarClassNames => {
  return mergeStyleSets({
    root: {
      marginTop: 8,
      display: "flex",
      paddingRight: 8,
    },
    label: {
      marginLeft: 24,
      marginRight: 24,
    },
    textField: {
      flexGrow: 1,
      marginRight: 8,
    },
  });
};
