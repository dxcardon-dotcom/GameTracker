import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';

// Configure React Testing Library
configure({ testIdAttribute: 'data-testid' });

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1,
}));

// Mock Notification API
global.Notification = jest.fn().mockImplementation(() => ({
  requestPermission: jest.fn().mockResolvedValue('granted'),
  close: jest.fn(),
}));

// Mock Service Worker
global.navigator.serviceWorker = {
  register: jest.fn().mockResolvedValue({
    installing: null,
    waiting: null,
    active: null,
  }),
  ready: Promise.resolve({
    pushManager: {
      subscribe: jest.fn().mockResolvedValue({
        endpoint: 'https://fcm.googleapis.com/fcm/send/test-token',
        keys: {
          p256dh: 'test-p256dh-key',
          auth: 'test-auth-key',
        },
      }),
      getSubscription: jest.fn().mockResolvedValue(null),
    },
  }),
};

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
          set: jest.fn(() => Promise.resolve()),
          update: jest.fn(() => Promise.resolve()),
          delete: jest.fn(() => Promise.resolve()),
        })),
        add: jest.fn(() => Promise.resolve()),
        where: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ docs: [] })),
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ docs: [] })),
        })),
        onSnapshot: jest.fn(),
      })),
    })),
    auth: jest.fn(() => ({
      signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test' } })),
      createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test' } })),
      signOut: jest.fn(() => Promise.resolve()),
      onAuthStateChanged: jest.fn(),
      currentUser: { uid: 'test', email: 'test@example.com' },
    })),
  })),
}));

// Mock environment variables
const originalEnv = import.meta.env;
beforeEach(() => {
  import.meta.env = {
    ...originalEnv,
    VITE_API_BASE_URL: 'http://localhost:4000',
    VITE_DEFAULT_TEAM_ID: 'test-team-id',
    VITE_DEFAULT_LIVE_GAME_ID: 'test-game-id',
  };
});

afterEach(() => {
  import.meta.env = originalEnv;
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

// Mock window.alert
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
});

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
});

// Mock window.prompt
Object.defineProperty(window, 'prompt', {
  value: jest.fn(() => 'test input'),
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
});

// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
});

// Mock File constructor
global.File = jest.fn().mockImplementation((content, name, options) => ({
  content,
  name,
  size: content.length,
  type: options?.type || 'text/plain',
  lastModified: Date.now(),
}));

// Mock Blob constructor
global.Blob = jest.fn().mockImplementation((content, options) => ({
  content,
  size: content.length,
  type: options?.type || 'text/plain',
}));

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  result: null,
  onload: null,
  onerror: null,
}));

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mock-uuid'),
    getRandomValues: jest.fn(() => new Uint32Array(1)),
  },
});

// Suppress console warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
