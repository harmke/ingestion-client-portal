import {
  BlobServiceClient,
  ContainerClient,
  ContainerListBlobFlatSegmentResponse,
} from "@azure/storage-blob";
import { Blob, handleBlobClient } from "./blobData";

export default class PaginatedAudio {
  private _containerClient: ContainerClient;
  private _iterator: AsyncIterableIterator<ContainerListBlobFlatSegmentResponse>;
  private _hasNext: boolean;
  private _currentPage: ContainerListBlobFlatSegmentResponse | undefined;
  constructor(
    blobServiceClient: BlobServiceClient,
    containerName: string = "audio-processed",
    maxPageSize: number
  ) {
    this._containerClient = blobServiceClient.getContainerClient(containerName);
    this._iterator = this._containerClient
      .listBlobsFlat()
      .byPage({ maxPageSize });
    this._hasNext = true;
  }

  public get hasNext() {
    return this._hasNext;
  }

  public async fetchNextPage(): Promise<void> {
    if (!this._hasNext) {
      return;
    }
    const response = await this._iterator.next();

    this._hasNext = !response.done;
    if (this._hasNext) {
      this._currentPage = response.value;
    }
  }

  public async getNextAudioBlobs(): Promise<Blob[]> {
    await this.fetchNextPage();

    if (!this.hasNext || !this._currentPage) {
      return [];
    }

    const blobRequests = [];
    for await (const blob of this._currentPage.segment.blobItems) {
      if ([".wav", ".mp3"].some((suffix) => blob.name.endsWith(suffix)))
        blobRequests.push(handleBlobClient(blob, this._containerClient));
    }

    return Promise.all(blobRequests);
  }
}
