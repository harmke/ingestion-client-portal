import {
  CheckboxVisibility,
  DetailsRow,
  getTheme,
  IColumn,
  Icon,
  IconButton,
  IDetailsListProps,
  IDetailsRowStyles,
  ShimmeredDetailsList,
} from "@fluentui/react";
import "styles/FilesExplorer.css";
import { Blob } from "utils/blobData";
import { LoadingStatus } from "./App";

interface FilesExplorerProps {
  showAudioPlayer: (item: Blob) => void;
  blobs: Blob[];
  loadingStatus: LoadingStatus;
}

function FilesExplorer({
  showAudioPlayer,
  blobs,
  loadingStatus,
}: FilesExplorerProps) {
  const theme = getTheme();

  const columns: IColumn[] = [
    {
      key: "playAudioIcon",
      fieldName: "playAudio",
      minWidth: 32,
      maxWidth: 32,
      name: "Play Audio",
      iconName: "Play",
      isIconOnly: true,
      headerClassName: "IconHeaderCell",

      onRender: function Render(item: Blob) {
        return (
          <IconButton
            iconProps={{ iconName: "Play" }}
            styles={{
              iconHovered: {
                fontWeight: 900,
              },
              icon: {
                // fontWeight: item === selectedInteraction ? 900 : "normal",
                fontWeight: "normal",
              },
            }}
            onClick={() => {
              showAudioPlayer(item);
              // setSelectedInteraction(item);
            }}
          />
        );
      },
    },
    {
      key: "mediaIcon",
      fieldName: "mediaIcon",
      minWidth: 32,
      maxWidth: 32,
      name: "File Types",
      iconName: "Media",
      isIconOnly: true,
      headerClassName: "IconHeaderCell",

      onRender: function Render(item: Blob) {
        return (
          <>
            <Icon iconName="Volume3" />
            <Icon iconName="TextDocument" />
          </>
        );
      },
    },
    {
      key: "column1",
      name: "File Name",
      minWidth: 200,
      maxWidth: 400,
      fieldName: "name",
    },
    {
      key: "column2",
      name: "Creation Date",
      minWidth: 200,
      maxWidth: 400,
      fieldName: "createdOn",
    },
    {
      key: "column3",
      name: "Duration",
      minWidth: 200,
      maxWidth: 400,
      fieldName: "duration",
    },
  ];

  const handleRenderRow: IDetailsListProps["onRenderRow"] = (props) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        // Every other row renders with a different background color
        customStyles.root = { backgroundColor: theme.palette.themeLighterAlt };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };
  return (
    <ShimmeredDetailsList
      enableShimmer={loadingStatus === "loading"}
      shimmerLines={blobs.length}
      compact
      checkboxVisibility={CheckboxVisibility.hidden}
      items={blobs}
      columns={columns}
      groupProps={{
        showEmptyGroups: true,
      }}
      onRenderRow={handleRenderRow}
    />
  );
}
export default FilesExplorer;
