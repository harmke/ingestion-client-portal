import "styles/App.css";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { DefaultButton, Panel } from "@fluentui/react";
import AudioPlayer from "./AudioPlayer";
import { generateTranscript, Transcript } from "../utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";

import FilesExplorer from "./FilesExplorer";
import NavBar from "./NavBar/NavBar";
import FilterBar from "./FilterBar";
import OptionsBar from "./OptionsBar";
import SideBar from "./SideBar/SideBar";
import ConnectionStringBar from "./ConnectionStringBar";
import { Blob, getJsonData } from "utils/blobData";
import PaginatedAudio from "utils/audioPagination";

export type LoadingStatus = "pending" | "loading" | "successful" | "failed";

function App() {
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [blobsLoadingStatus, setBlobsLoadingStatus] =
    useState<LoadingStatus>("pending");
  const paginatedAudioRef = useRef<PaginatedAudio>();

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

    paginatedAudioRef.current = new PaginatedAudio(
      blobServiceClientRef.current,
      "audio-processed",
      5
    );

    jsonResultOutputContainerClientRef.current =
      blobServiceClientRef.current.getContainerClient("json-result-output");

    const setAudioBlobs = async () => {
      if (!blobServiceClientRef.current || !paginatedAudioRef.current) {
        setBlobsLoadingStatus("failed");
        return;
      }
      setBlobsLoadingStatus("loading");
      try {
        const newBlobs = await paginatedAudioRef.current
          .getNextAudioBlobs()
          .catch(() => []);

        setBlobs(newBlobs);
        setBlobsLoadingStatus("successful");
      } catch (e) {
        setBlobsLoadingStatus("failed");
      }
    };
    setAudioBlobs();
  }, [blobServiceSas]);

  const loadNextAudioBlobPage = async () => {
    if (!blobServiceClientRef.current || !paginatedAudioRef.current) {
      setBlobsLoadingStatus("failed");
      return;
    }
    setBlobsLoadingStatus("loading");
    const newBlobs = await paginatedAudioRef.current.getNextAudioBlobs();
    setBlobs([...blobs, ...newBlobs]);
    setBlobsLoadingStatus("successful");
  };

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
      <div className="App__NavBar">
        <NavBar />
      </div>
      <div className="App__SideBar">
        <SideBar />
      </div>
      <div className="App__MainBody">
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
        <div className="PaginationButton__Container">
          <DefaultButton text="load more" onClick={loadNextAudioBlobPage} />
        </div>

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
      </div>
    </div>
  );
}

export default App;
