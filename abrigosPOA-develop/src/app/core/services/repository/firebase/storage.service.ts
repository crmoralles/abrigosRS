import { Injectable, inject } from '@angular/core'
import {
  Storage,
  StringFormat,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from '@angular/fire/storage'

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage = inject(Storage)

  constructor() {}

  async uploadString(fileName: string, fileData: string, format: StringFormat = StringFormat.DATA_URL) {
    const storageRef = ref(this.storage, fileName)

    const uploadResult = await uploadString(storageRef, fileData, format)
    return getDownloadURL(uploadResult.ref)
  }

  async uploadBytes(fileName: string, filedata: Blob | Uint8Array | ArrayBuffer) {
    const storageRef = ref(this.storage, fileName)

    const uploadResult = await uploadBytes(storageRef, filedata)
    return getDownloadURL(uploadResult.ref)
  }

  async uploadByUri(fileName: string, filePath: string) {
    const blobfile = await (await fetch(filePath)).blob()

    return this.uploadBytes(fileName, blobfile)
  }

  async deteteFile(url) {
    const storageRef = ref(this.storage, url)

    return deleteObject(storageRef)
  }
}
