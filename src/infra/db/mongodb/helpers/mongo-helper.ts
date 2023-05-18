import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: undefined as MongoClient | undefined,

  async connect (uri: string): Promise<void> {
    try {
      this.client = await MongoClient.connect(uri)
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error // or handle the error as needed
    }
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db('clean-node').collection(name)
  }
}
