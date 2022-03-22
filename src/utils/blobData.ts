import {
  BlobClient,
  BlobItem,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import getBlobDuration from "get-blob-duration";
import { convertMilliseconds } from "./transcription";

export interface Container {
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

export function getJsonData<T = any>(url: string): Promise<T> {
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

const handleBlobClient = async (
  blob: BlobItem,
  containerClient: ContainerClient
): Promise<Blob> => {
  const blobClient = containerClient.getBlobClient(blob.name);
  const duration = await getBlobDuration(blobClient.url).catch(() => 0);

  return {
    name: blob.name,
    createdOn: blob.properties.createdOn?.toString(),
    duration: convertMilliseconds(duration * 1000),
    blobClient: blobClient,
  };
};

const handleContainerClient = async (
  containerName: string,
  blobServiceClient: BlobServiceClient,
  newContainers: Container[]
) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobRequests = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    if ([".wav", ".mp3"].some((suffix) => blob.name.endsWith(suffix)))
      blobRequests.push(handleBlobClient(blob, containerClient));
  }

  const resolvedBlobRequests = await Promise.all(blobRequests);

  newContainers.push({
    name: containerName,
    containerClient: containerClient,
    size: resolvedBlobRequests.length,
  });

  return resolvedBlobRequests;
};

export const fetchAudioBlobs = async (
  blobServiceClient: BlobServiceClient
): Promise<[Blob[], Container[]]> => {
  const newContainers: Container[] = [];

  const containerRequests = [];
  for await (const container of blobServiceClient.listContainers({
    prefix: "audio",
  })) {
    containerRequests.push(
      handleContainerClient(container.name, blobServiceClient, newContainers)
    );
  }

  const resolvedContainerRequests = await Promise.all(containerRequests);

  return [resolvedContainerRequests.flat(), newContainers];
};
