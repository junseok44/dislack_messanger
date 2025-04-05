import '@testing-library/jest-dom'

import { configure } from '@testing-library/react'

import './__mocks__/navigator'
import './__mocks__/socket.io-client'

configure({ testIdAttribute: 'data-testid' })

globalThis.IS_REACT_ACT_ENVIRONMENT = true

global.MediaStream = function () {
  // Implement the minimal interface needed for your tests
  this.addTrack = jest.fn()
  this.removeTrack = jest.fn()
  this.getTracks = jest.fn().mockReturnValue([])
}

// Override act method
