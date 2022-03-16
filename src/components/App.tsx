import "styles/App.css";
import {
  BlobClient,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { IGroup, Panel } from "@fluentui/react";
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

  return (
    <div className="App">
      <NavBar />
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
    </div>
  );
}

export default App;
