import "./App.css";
import {
  BlobClient,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import {
  DetailsList,
  IColumn,
  IGroup,
  Stack,
  StackItem,
} from "@fluentui/react";
import AudioPlayer from "./components/AudioPlayer";
import { generateTranscript, Transcript } from "./utils/transcription";

interface Container {
  name: string;
  containerClient: ContainerClient;
  size: number;
}

interface Blob {
  name: string;
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
      key: "column1",
      name: "Name",
      minWidth: 16,
      fieldName: "name",
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

  const handleActiveItemChanged = async (item: Blob) => {
    setAudioUrl(item.blobClient.url);
    setTranscript(generateTranscript(await getJsonResultOutput(item.name)));
  };

  return (
    <div className="App">
      <Stack horizontal>
        <StackItem grow>
          <DetailsList
            items={blobs}
            columns={columns}
            groups={groups}
            groupProps={{
              showEmptyGroups: true,
            }}
            onActiveItemChanged={handleActiveItemChanged}
          />
        </StackItem>
        <StackItem>
          <AudioPlayer src={audioUrl} transcript={transcript} />
        </StackItem>
      </Stack>
    </div>
  );
}

export default App;
