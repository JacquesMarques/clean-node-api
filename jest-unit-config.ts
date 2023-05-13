import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  ...require('./jest.config.ts'),
  testMatch: ['**/*.spec.ts']
}

export default config
