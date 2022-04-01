import "styles/App.css";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { IGroup, Panel, Stack } from "@fluentui/react";
import AudioPlayer from "./AudioPlayer";
import { generateTranscript, Transcript } from "../utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";

import FilesExplorer from "./FilesExplorer";
import NavBar from "./NavBar/NavBar";
import FilterBar from "./FilterBar";
import OptionsBar from "./OptionsBar";
import SideBar from "./SideBar/SideBar";
import ConnectionStringBar from "./ConnectionStringBar";
import { Blob, Container, fetchAudioBlobs, getJsonData } from "utils/blobData";

export type LoadingStatus = "pending" | "loading" | "successful" | "failed";

function App() {
  const [containers, setContainers] = useState<Array<Container>>([]);
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [blobsLoadingStatus, setBlobsLoadingStatus] =
    useState<LoadingStatus>("pending");
  const [groups, setGroups] = useState<Array<IGroup>>([]);

  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript>([]);
  const [transcriptLoadingStatus, setTranscriptLoadingStatus] =
    useState<LoadingStatus>("pending");

  const [blobServiceSas, setBlobServiceSas] = useState<string>("");

  const blobServiceClientRef = useRef<BlobServiceClient>();
  const jsonResultOutputContainerClientRef = useRef<ContainerClient>();

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const getJsonResultOutput = async (audioFileName: string) => {
    if (!jsonResultOutputContainerClientRef.current) {
      return Promise.reject();
    }
    const blobClient = jsonResultOutputContainerClientRef.current.getBlobClient(
      `${audioFileName}.json`
    );
    return await getJsonData(blobClient.url);
  };

  useEffect(() => {
    if (!blobServiceSas) {
      return;
    }
    try {
      blobServiceClientRef.current =
        BlobServiceClient.fromConnectionString(blobServiceSas);
    } catch (error) {
      console.log(error);
      setBlobsLoadingStatus("failed");
      return;
    }

    if (!blobServiceClientRef.current) {
      return;
    }

    jsonResultOutputContainerClientRef.current =
      blobServiceClientRef.current.getContainerClient("json-result-output");

    const setAudioBlobs = async () => {
      if (!blobServiceClientRef.current) {
        return;
      }
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
    setTranscriptLoadingStatus("loading");
    openPanel();
    setTranscript(generateTranscript(await getJsonResultOutput(item.name)));
    setTranscriptLoadingStatus("successful");
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
            <AudioPlayer
              src={audioUrl}
              transcript={transcript}
              transcriptLoadingStatus={transcriptLoadingStatus}
            />
          </Panel>
        </Stack.Item>
      </Stack>
    </div>
  );
}

export default App;
