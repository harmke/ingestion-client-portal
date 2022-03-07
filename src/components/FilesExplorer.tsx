import {
  CheckboxVisibility,
  DetailsList,
  DetailsRow,
  getTheme,
  IColumn,
  IconButton,
  IDetailsListProps,
  IDetailsRowStyles,
} from "@fluentui/react";
import { Blob } from "../App";

interface FilesExplorerProps {
  showAudioPlayer: (item: Blob) => void;
  blobs: Blob[];
}

function FilesExplorer({ showAudioPlayer, blobs }: FilesExplorerProps) {
  const theme = getTheme();

  const columns: IColumn[] = [
    {
      key: "playAudio",
      fieldName: "playAudio",
      minWidth: 32,
      maxWidth: 32,
      name: "Play Audio",
      iconName: "Play",
      isIconOnly: true,
      headerClassName: "playIconHeaderCell",

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
    <DetailsList
      compact
      checkboxVisibility={CheckboxVisibility.hidden}
      // disableSelectionZone
      items={blobs}
      columns={columns}
      // groups={groups}
      groupProps={{
        showEmptyGroups: true,
      }}
      onRenderRow={handleRenderRow}
    />
  );
}
export default FilesExplorer;
