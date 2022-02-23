import './App.css';
import { BlobServiceClient } from "@azure/storage-blob";
import { useEffect, useRef, useState } from "react";
import { DetailsList } from "@fluentui/react";

interface Container {
  name: string
}

function App() {
  const [containers, setContainers] = useState<Array<Container>>([]);

  const blobServiceClientRef = useRef(
    new BlobServiceClient(process.env.REACT_APP_BLOB_SERVICE_SAS as string)
  );

  const fetchContainers = async () => {
    const newContainers = [];
    for await (const container of blobServiceClientRef.current.listContainers()) {
      newContainers.push({name: container.name});
    }
    setContainers(newContainers);
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="App">
      {/* {containers.map((container, index) => (
        <p key={`${container}-${index}`}>{container}</p>
      ))} */}
      <DetailsList items={containers} />
    </div>
  );
}

export default App;
