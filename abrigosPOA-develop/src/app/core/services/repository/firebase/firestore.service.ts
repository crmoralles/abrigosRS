import { Injectable, inject } from '@angular/core'
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore'

export interface Params {
  where?: {
    key: string
    condition: '<' | '<=' | '==' | '>' | '>=' | '!=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'
    value: any
  }[]
  orders?: {
    fieldPath: string
    direction: 'asc' | 'desc'
  }[]
  limit?: number
}

@Injectable({
  providedIn: 'root',
})
export abstract class FirestoreService {
  protected firestore: Firestore = inject(Firestore)
  protected collectionRef: CollectionReference

  constructor() {}

  public setCollectionRef(collectionName) {
    this.collectionRef = collection(this.firestore, collectionName)
  }

  public setCollectionRefByRef(collectionRef: CollectionReference) {
    this.collectionRef = collectionRef
  }

  public setSubCollectionRefByRef(documentRef: DocumentReference, collectionName: string) {
    this.collectionRef = collection(documentRef, collectionName)
  }

  public async load(params: Params = {}) {
    let q = this.getQuery(params)

    let data: any[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((docSnap) => {
      const docData = docSnap.data()
      if (!docData['id']) docData['id'] = docSnap['id']
      data.push(docData)
    })

    return data
  }

  getQuery(params: Params = {}) {
    let q = query(this.collectionRef)

    if (params.where) {
      params.where.forEach((doc: any) => {
        q = query(q, where(doc.key, doc.condition, doc.value))
      })
    }

    if (params.orders) {
      params.orders.forEach((doc: any) => {
        q = query(q, orderBy(doc.fieldPath, doc.direction))
      })
    }

    if (params.limit) {
      q = query(q, limit(params.limit))
    }

    return q
  }

  async count(params: Params = {}) {
    let q = this.getQuery(params)

    const snap = await getCountFromServer(q)

    return snap.data().count
  }

  onSnapshot(path: any, callback: Function) {
    return onSnapshot(path, (doc) => {
      callback(doc)
    })
  }

  doOnSnapshot(path: DocumentReference): Promise<any> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        path,
        { includeMetadataChanges: true },
        (snapshot) => {
          const data = snapshot.data()
          if (data && snapshot.id) {
            data['id'] = snapshot.id
          }

          unsubscribe()
          resolve(data)
        },
        (err) => {
          unsubscribe()
          reject(err)
        }
      )
    })
  }

  async add(item): Promise<any> {
    item.id = this.generateId()

    return this.set(item)
  }

  async set(item, id?: string): Promise<any> {
    if (!id) id = item.id

    const path = this.getDocRef(id)

    setDoc(path, item, { merge: true })
    return this.doOnSnapshot(path)
  }

  public async addOrUpdate(document) {
    const now = new Date()
    document.update_in = now
    if (!document.id) {
      const idDocument = this.generateId()
      document.id = idDocument
    }

    if (!document.create_in) {
      document.create_in = now
    }

    return this.set(document)
  }

  async update(item: any, id?: string): Promise<any> {
    if (!id) id = item.id

    const path = this.getDocRef(id)

    updateDoc(path, item)
    return this.doOnSnapshot(path)
  }

  async deleteDoc(itemId: string): Promise<void> {
    const path = this.getDocRef(itemId)
    deleteDoc(path)
    await this.doOnSnapshot(path)
    return
  }

  public async get(docId): Promise<any> {
    const docSnap = await this.getDocSnap(docId)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return false
    }
  }

  public getDocRef(docId) {
    return doc(this.collectionRef, docId)
  }

  public async getDocByRef(docRef) {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return false
    }
  }

  public getDocSnap(docId) {
    const docRef = this.getDocRef(docId)
    return getDoc(docRef)
  }

  public generateId() {
    return doc(this.collectionRef).id
  }

  public convertDatetime(timestamp) {
    if (timestamp) return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate().toLocaleString()
    return timestamp
  }
}
