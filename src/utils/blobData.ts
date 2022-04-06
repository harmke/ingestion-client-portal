import { BlobClient, BlobItem, ContainerClient } from "@azure/storage-blob";
import getBlobDuration from "get-blob-duration";
import { convertMilliseconds } from "./transcription";

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

export const handleBlobClient = async (
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
