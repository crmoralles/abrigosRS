import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { COLLECTION_NAMES } from 'src/app/shared/constants/collections.const'
import { FirestoreService, Params } from './firebase/firestore.service'

export interface LGPDSignedTerms {
  userId: string
  signed_tratamento_dados?: Date
  signed_usuaria_controlador?: Date
  signed_voluntario?: Date
}

@Injectable({
  providedIn: 'root',
})
export class LGDPTermsService extends FirestoreService {
  public signedNotify$ = new BehaviorSubject<boolean>(false)
  constructor() {
    super()
    this.setCollectionRef(COLLECTION_NAMES.LGPDSIGNEDTERMS)
  }

  async getLGPDSigned(userId: string) {
    const params: Params = {
      where: [{ key: 'userId', condition: '==', value: userId }],
    }

    const s = await (
      await this.load(params)
    ).map((doc) => {
      const signed = doc as LGPDSignedTerms
      signed.signed_tratamento_dados = this.convertDatetime(signed.signed_tratamento_dados)
      signed.signed_usuaria_controlador = this.convertDatetime(signed.signed_usuaria_controlador)
      signed.signed_voluntario = this.convertDatetime(signed.signed_voluntario)

      return signed
    })

    if (s.length > 0) this.signedNotify$.next(true)

    return s
  }

  async signed(userId: string, term: LGPDSignedTerms) {
    const signs: LGPDSignedTerms[] = await this.getLGPDSigned(userId)
    let signed: LGPDSignedTerms
    if (signs && signs.length) signed = signs[0]

    signed = { ...signed, ...term }

    await this.addOrUpdate(signed)
    this.signedNotify$.next(true)
    return true
  }

  async clearSigned(userId: string) {
    const params: Params = {
      where: [{ key: 'userId', condition: '==', value: userId }],
    }

    const docs = await this.load(params)

    docs.forEach((docSnap) => {
      this.deleteDoc(docSnap.id)
    })
  }
}
