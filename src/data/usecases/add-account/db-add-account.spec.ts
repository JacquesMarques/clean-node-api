import { DbAddAccount } from './db-add-account'
import { type Encrypter, type AddAccountModel, type AccountModel, type AddAccountRepository } from './db-add-account-protocols'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }

      return await new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new AccountRepositoryStub()
}

interface SubTypes {
  sut: DbAddAccount
  encypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SubTypes => {
  const encypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encypterStub, addAccountRepositoryStub)

  return {
    sut,
    encypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecas', () => {
  test('Should call Encrypter with correct passowrd', async () => {
    const { sut, encypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrpyter throws', async () => {
    const { sut, encypterStub } = makeSut()
    jest.spyOn(encypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
