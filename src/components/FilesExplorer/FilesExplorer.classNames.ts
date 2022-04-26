import { mergeStyleSets } from "@fluentui/merge-styles";

export interface FilesExplorerClassNames {
  iconHeaderCell: string;
}

export const getClassNames = (): FilesExplorerClassNames => {
  return mergeStyleSets({
    iconHeaderCell: {
      selectors: {
        "*.ms-DetailsHeader-cellTitle": {
          justifyContent: "center",
        },
      },
    },
  });
};
