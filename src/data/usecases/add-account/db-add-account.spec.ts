import { type Encrypter } from '../../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SubTypes {
  sut: DbAddAccount
  encypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SubTypes => {
  const encypterStub = makeEncrypter()
  const sut = new DbAddAccount(encypterStub)

  return {
    sut,
    encypterStub
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
})
