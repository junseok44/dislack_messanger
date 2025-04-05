// src/__mocks__/navigator.ts
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn(() => Promise.resolve(new MediaStream())),
  },
})

export {}
