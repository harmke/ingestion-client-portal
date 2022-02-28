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

  const blobServiceClientRef = useRef(
    new BlobServiceClient(process.env.REACT_APP_BLOB_SERVICE_SAS as string)
  );

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

  useEffect(() => {
    setGroups(createGroups());
  }, [containers]);

  const storageSasToken = process.env.REACT_APP_STORAGE_SAS_TOKEN;

  const handleActiveItemChanged = (item: Blob) => {
    setAudioUrl(item.blobClient.url);
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
          <AudioPlayer src={audioUrl} />
        </StackItem>
      </Stack>
    </div>
  );
}

export default App;
