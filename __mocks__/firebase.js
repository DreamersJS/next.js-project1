// __mocks__/firebase.js
export const initializeApp = jest.fn(() => ({}));

export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Firebase Realtime Database functions used in whiteboardService.js
export const getDatabase = jest.fn(() => ({
  ref: jest.fn(() => ({
    child: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: () => true, val: () => ({}) })),
    })),
  })),
}));
export const database = { /* you can leave empty or add mock props if needed */ };

export const ref = jest.fn((db, path) => ({
  key: 'mockKey',   // could be empty or a mock object if needed
  _path: path,
}));

export const push = jest.fn((refObj) => ({
  key: 'newWhiteboardId',
}));

export const set = jest.fn(() => Promise.resolve());

export const get = jest.fn(() =>
  Promise.resolve({
    val: () => ({ newWhiteboardId: true }),
    exists: () => true,
  })
);

export const update = jest.fn(() => Promise.resolve());

export const remove = jest.fn(() => Promise.resolve());
