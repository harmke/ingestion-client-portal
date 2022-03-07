import "./App.css";
import {
  BlobClient,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import {
  CheckboxVisibility,
  DetailsList,
  DetailsRow,
  IColumn,
  IconButton,
  IDetailsListProps,
  IDetailsRowStyles,
  IGroup,
  Panel,
} from "@fluentui/react";
import AudioPlayer from "./components/AudioPlayer";
import { generateTranscript, Transcript } from "./utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";
import { getTheme } from "@fluentui/react/lib/Styling";

const theme = getTheme();

interface Container {
  name: string;
  containerClient: ContainerClient;
  size: number;
}

interface Blob {
  name: string;
  createdOn: string | undefined;
  duration: number | undefined;
  blobClient: BlobClient;
}

function App() {
  const [containers, setContainers] = useState<Array<Container>>([]);
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [groups, setGroups] = useState<Array<IGroup>>([]);

  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript>([]);

  const blobServiceClientRef = useRef(
    new BlobServiceClient(process.env.REACT_APP_BLOB_SERVICE_SAS as string)
  );
  const jsonResultOutputContainerClientRef = useRef(
    blobServiceClientRef.current.getContainerClient("json-result-output")
  );

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  function getJsonData<T = any>(url: string): Promise<T> {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  const getJsonResultOutput = async (audioFileName: string) => {
    const blobClient = jsonResultOutputContainerClientRef.current.getBlobClient(
      `${audioFileName}.json`
    );
    return await getJsonData(blobClient.url);
  };

  const fetchBlobs = async () => {
    const newContainers = [];
    const newBlobs = [];
    for await (const container of blobServiceClientRef.current.listContainers({
      prefix: "audio",
    })) {
      // if (
      //   !["audio", "json"].some((prefix) => container.name.startsWith(prefix))
      // ) {
      //   continue;
      // }

      const containerClient = blobServiceClientRef.current.getContainerClient(
        container.name
      );

      let blobCount = 0;
      for await (const blob of containerClient.listBlobsFlat()) {
        if (!blob.name.endsWith(".wav")) continue;

        newBlobs.push({
          name: blob.name,
          createdOn: blob.properties.createdOn?.toString(),
          duration: blob.properties.contentLength,
          blobClient: containerClient.getBlobClient(blob.name),
        });
        blobCount++;
      }

      newContainers.push({
        name: container.name,
        containerClient: containerClient,
        size: blobCount,
      });
    }

    setBlobs(newBlobs);
    setContainers(newContainers);
  };

  useEffect(() => {
    fetchBlobs();
  }, []);

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

      onRender: function Render(item) {
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
      minWidth: 16,
      fieldName: "createdOn",
    },
  ];

  useEffect(() => {
    const createGroups = () => {
      let groups = [];
      let indexCount = 0;

      for (const { name, size } of containers) {
        groups.push({
          key: `group${name}`,
          name: name,
          startIndex: indexCount,
          count: size,
          level: 0,
        });
        indexCount += size;
      }

      return groups;
    };

    setGroups(createGroups());
  }, [containers]);

  const showAudioPlayer = async (item: Blob) => {
    setAudioUrl(item.blobClient.url);
    setTranscript(generateTranscript(await getJsonResultOutput(item.name)));
    openPanel();
  };

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
    <div className="App">
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

      <Panel
        isLightDismiss
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        headerText="Audio Player"
      >
        <AudioPlayer src={audioUrl} transcript={transcript} />
      </Panel>
    </div>
  );
}

export default App;
