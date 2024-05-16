import { Injectable } from '@angular/core'
import { COLLECTION_NAMES } from 'src/app/shared/constants/collections.const'
import { FirestoreService, Params } from './firebase/firestore.service'

export interface User {
  id?: string
  role: number
  userId?: string
  name: string
  email: string
  mobile: string
  cpf: string
  cep: string
  address: string
  addressNumber: string
  addressComplement: string
  city: string
  district: string
  state: string
  abrigos?: { abrigoId: string; abrigoNome: string }[]
  abrigoId?: string
  abrigoNome?: string
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends FirestoreService {
  constructor() {
    super()
    this.setCollectionRef(COLLECTION_NAMES.USERS)
  }

  async getUserRole(userId: string) {
    const param: Params = {
      where: [
        {
          key: 'userId',
          condition: '==',
          value: userId,
        },
      ],
    }

    const userDocs = await this.load(param)
    if (userDocs && userDocs.length > 0) {
      return userDocs[0]
    }
  }

  public override async addOrUpdate(user: User) {
    if (!user.id) {
      user.id = this.generateId()
      user.userId = user.id
    }

    return await super.addOrUpdate(user)
  }
}
