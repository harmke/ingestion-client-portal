import "styles/App.css";
import {
  BlobClient,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import {
  IGroup,
  INavLinkGroup,
  INavStyles,
  Nav,
  Panel,
  Stack,
} from "@fluentui/react";
import AudioPlayer from "./AudioPlayer";
import {
  convertMilliseconds,
  generateTranscript,
  Transcript,
} from "../utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";

import getBlobDuration from "get-blob-duration";
import FilesExplorer from "./FilesExplorer";
import NavBar from "./NavBar";
import FilterBar from "./FilterBar";
import OptionsBar from "./OptionsBar";

interface Container {
  name: string;
  containerClient: ContainerClient;
  size: number;
}

export interface Blob {
  name: string;
  createdOn: string | undefined;
  duration: string;
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

        const blobClient = containerClient.getBlobClient(blob.name);

        newBlobs.push({
          name: blob.name,
          createdOn: blob.properties.createdOn?.toString(),
          duration: convertMilliseconds(
            (await getBlobDuration(blobClient.url)) * 1000
          ),
          blobClient: blobClient,
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

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: "Home",
          url: "http://example.com",
          expandAriaLabel: "Expand Home section",
          collapseAriaLabel: "Collapse Home section",
          links: [
            {
              name: "Activity",
              url: "http://msn.com",
              key: "key1",
              target: "_blank",
            },
            {
              name: "MSN",
              url: "http://msn.com",
              key: "key2",
              target: "_blank",
            },
          ],
          isExpanded: true,
        },
        {
          name: "Documents",
          url: "http://example.com",
          key: "key3",
          isExpanded: true,
          target: "_blank",
        },
        {
          name: "Pages",
          url: "http://msn.com",
          key: "key4",
          target: "_blank",
        },
        {
          name: "Notebook",
          url: "http://msn.com",
          key: "key5",
        },
        {
          name: "Communication and Media",
          url: "http://msn.com",
          key: "key6",
          target: "_blank",
        },
        {
          name: "News",
          url: "http://cnn.com",
          icon: "News",
          key: "key7",
          target: "_blank",
        },
      ],
    },
  ];

  const navStyles: Partial<INavStyles> = {
    root: {
      width: 208,
      height: "100vh",
      boxSizing: "border-box",
      border: "1px solid #eee",
      overflowY: "auto",
      backgroundColor: "#fafafa",
    },
  };

  return (
    <div className="App">
      <NavBar />
      <Stack horizontal>
        <Stack.Item>
          <Nav
            // onLinkClick={_onLinkClick}
            selectedKey="key3"
            ariaLabel="Nav basic example"
            styles={navStyles}
            groups={navLinkGroups}
          />
        </Stack.Item>
        <Stack.Item grow>
          <OptionsBar />
          <FilterBar />

          <FilesExplorer showAudioPlayer={showAudioPlayer} blobs={blobs} />
          <Panel
            isLightDismiss
            isOpen={isOpen}
            onDismiss={dismissPanel}
            closeButtonAriaLabel="Close"
            headerText="Audio Player"
          >
            <AudioPlayer src={audioUrl} transcript={transcript} />
          </Panel>
        </Stack.Item>
      </Stack>
    </div>
  );
}

export default App;
