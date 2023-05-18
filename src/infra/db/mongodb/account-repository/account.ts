import { type AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const inserted = await accountCollection.findOne({ _id: result.insertedId })
    console.log(inserted)
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_passord'
    }
  }
}
