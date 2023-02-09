import { getClassNames } from "./App.classNames";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { DefaultButton, Panel, PanelType } from "@fluentui/react";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import { generateTranscript, Transcript, OpenAiDictionary } from "utils/transcription";
import { useBoolean } from "@fluentui/react-hooks";

import FilesExplorer from "components/FilesExplorer/FilesExplorer";
import NavBar from "components/NavBar/NavBar";
import FilterBar from "components/FilterBar/FilterBar";
import OptionsBar from "components/OptionsBar/OptionsBar";
import SideBar from "components/SideBar/SideBar";
import ConnectionStringBar from "components/ConnectionStringBar/ConnectionStringBar";
import { Blob, getJsonData } from "utils/blobData";
import PaginatedAudio from "utils/audioPagination";

export type LoadingStatus = "pending" | "loading" | "successful" | "failed";

const classNames = getClassNames();

function App() {
  const [blobs, setBlobs] = useState<Array<Blob>>([]);
  const [blobsLoadingStatus, setBlobsLoadingStatus] =
    useState<LoadingStatus>("pending");
  const paginatedAudioRef = useRef<PaginatedAudio>();

  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState<Transcript>([]);
  const [transcriptLoadingStatus, setTranscriptLoadingStatus] =
    useState<LoadingStatus>("pending");
  const [fullTranscriptObject, setFullTranscriptObject] = useState<OpenAiDictionary>(Object);


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
      // blobServiceClientRef.current.getContainerClient("json-result-output"); openai-result-output
      blobServiceClientRef.current.getContainerClient("openai-result-output"); 

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

    var remote_json_file = await getJsonResultOutput(item.name);
    console.log(remote_json_file);
    
    setTranscript(generateTranscript(remote_json_file));
    setTranscriptLoadingStatus("successful");

    // console.log("typeof remote", remote_json_file.summary)
    // console.log("typeof remote", typeof(remote_json_file))

    setFullTranscriptObject(remote_json_file);
  };

  return (
    <div className={classNames.root}>
      <div className={classNames.navBar}>
        <NavBar />
      </div>
      <div className={classNames.sideBar}>
        <SideBar />
      </div>
      <div className={classNames.mainBody}>
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
        <div className={classNames.paginationContainer}>
          <DefaultButton text="load more" onClick={loadNextAudioBlobPage} />
        </div>

        <Panel
          isLightDismiss
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          headerText="Audio Player"
          type={PanelType.large}
        >
          <AudioPlayer
            src={audioUrl}
            transcript={transcript}
            transcriptLoadingStatus={transcriptLoadingStatus}
            fullTranscriptObject={fullTranscriptObject}
          />
        </Panel>
      </div>
    </div>
  );
}

export default App;
