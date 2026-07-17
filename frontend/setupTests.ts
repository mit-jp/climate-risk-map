// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest'
// to support `Legend.tsx` because it uses canvas, learn more: https://stackoverflow.com/a/55141040/382892
import 'vitest-canvas-mock'

// jsdom doesn't implement scrollIntoView, which the tour calls on each step
Element.prototype.scrollIntoView = () => {}

// node's fetch and Request reject the relative URLs the app uses because,
// unlike a browser, they have no document to resolve them against; give
// them jsdom's base URL. (jsdom deliberately doesn't implement fetch, and
// msw intercepts the native one, so this is the one browser semantic we
// must fill in ourselves.)
const resolveUrl = (input: RequestInfo | URL): RequestInfo | URL =>
    typeof input === 'string' || input instanceof URL ? new URL(input, document.baseURI) : input
const NativeRequest = globalThis.Request
globalThis.Request = class Request extends NativeRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
        super(resolveUrl(input), init)
    }
}
const nativeFetch = globalThis.fetch
globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
    nativeFetch(resolveUrl(input), init)

// node 22+ ships its own localStorage global, which is non-functional
// without a valid --localstorage-file and shadows jsdom's implementation,
// so give tests a working in-memory one
const memoryStorage = (): Storage => {
    const store = new Map<string, string>()
    return {
        get length() {
            return store.size
        },
        key: (index: number) => [...store.keys()][index] ?? null,
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, String(value)),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
    } as Storage
}
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage(), configurable: true })
Object.defineProperty(window, 'localStorage', { value: localStorage, configurable: true })
