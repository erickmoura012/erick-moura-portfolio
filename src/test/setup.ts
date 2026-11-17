import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

/** jsdom não implementa IntersectionObserver; consideramos tudo visível. */
class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.callback(
      [{ isIntersecting: true, intersectionRatio: 1, target } as IntersectionObserverEntry],
      this,
    )
  }

  unobserve(): void {
    // sem estado para limpar
  }

  disconnect(): void {
    // sem estado para limpar
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', ImmediateIntersectionObserver)

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe(): void {
      // jsdom não calcula layout
    }
    unobserve(): void {
      // idem
    }
    disconnect(): void {
      // idem
    }
  },
)

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }) as MediaQueryList

Element.prototype.scrollIntoView ??= () => undefined
window.scrollTo = () => undefined
