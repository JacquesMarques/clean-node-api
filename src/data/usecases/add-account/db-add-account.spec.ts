import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecas', () => {
  test('Should call Encrypter with correct passowrd', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }
    const encypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encypterStub)
    const encryptSpy = jest.spyOn(encypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
