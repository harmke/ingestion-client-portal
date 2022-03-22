import "styles/App.css";
import { BlobServiceClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { IGroup, Panel, Stack } from "@fluentui/react";
import AudioPlayer from "./AudioPlayer";
import { generateTranscript, Transcript } from "../utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";

import FilesExplorer from "./FilesExplorer";
import NavBar from "./NavBar";
import FilterBar from "./FilterBar";
import OptionsBar from "./OptionsBar";
import SideBar from "./SideBar";
import ConnectionStringBar from "./ConnectionStringBar";
import { Blob, Container, fetchAudioBlobs, getJsonData } from "utils/blobData";

export type LoadingStatus = "loading" | "successful" | "failed";

function App() {
  const [containers, setContainers] = useState<Array<Container>>([]);
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [blobsLoadingStatus, setBlobsLoadingStatus] =
    useState<LoadingStatus>("loading");
  const [groups, setGroups] = useState<Array<IGroup>>([]);

  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript>([]);

  const [blobServiceSas, setBlobServiceSas] = useState<string>(
    (process.env.REACT_APP_BLOB_SERVICE_SAS as string) || ""
  );

  const blobServiceClientRef = useRef(new BlobServiceClient(blobServiceSas));
  const jsonResultOutputContainerClientRef = useRef(
    blobServiceClientRef.current.getContainerClient("json-result-output")
  );

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const getJsonResultOutput = async (audioFileName: string) => {
    const blobClient = jsonResultOutputContainerClientRef.current.getBlobClient(
      `${audioFileName}.json`
    );
    return await getJsonData(blobClient.url);
  };

  useEffect(() => {
    blobServiceClientRef.current = new BlobServiceClient(blobServiceSas);
    jsonResultOutputContainerClientRef.current =
      blobServiceClientRef.current.getContainerClient("json-result-output");

    const setAudioBlobs = async () => {
      setBlobsLoadingStatus("loading");
      try {
        const [newBlobs, newContainers] = await fetchAudioBlobs(
          blobServiceClientRef.current
        );

        setBlobs(newBlobs);
        setContainers(newContainers);
        setBlobsLoadingStatus("successful");
      } catch (e) {
        setBlobsLoadingStatus("failed");
      }
    };
    setAudioBlobs();
  }, [blobServiceSas]);

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
    setTranscript([]);
    openPanel();
    setTranscript(generateTranscript(await getJsonResultOutput(item.name)));
  };

  return (
    <div className="App">
      <NavBar />
      <Stack horizontal>
        <Stack.Item>
          <SideBar />
        </Stack.Item>
        <Stack.Item grow>
          <ConnectionStringBar
            blobServiceSas={blobServiceSas}
            onConnect={setBlobServiceSas}
          />
          <OptionsBar />
          <FilterBar />

          <FilesExplorer
            showAudioPlayer={showAudioPlayer}
            blobs={blobs}
            loadingStatus={blobsLoadingStatus}
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
        </Stack.Item>
      </Stack>
    </div>
  );
}

export default App;
