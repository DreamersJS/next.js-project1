// __mocks__/firebase.js
export const initializeApp = jest.fn(() => ({}));

export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

export const database = {};

export const getDatabase = jest.fn(() => database);

export const ref = jest.fn((db, path) => ({
  key: 'mockKey',
  _path: path,  // optional, to prevent TypeError
  child: jest.fn((childPath) => ({
    key: 'mockChildKey',
    _path: childPath,
    get: jest.fn(() => Promise.resolve({
      exists: () => true,
      val: () => ({ someWhiteboardData: true }),
    })),
  })),
}));

export const child = jest.fn((refObj, path) => ({
  key: 'mockChildKey',
  _path: path,
  get: jest.fn(() => Promise.resolve({
    exists: () => true,
    val: () => ({ someWhiteboardData: true }),
  })),
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
