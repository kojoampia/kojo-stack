import { Observable, shareReplay } from 'rxjs';

/**
 * A tiny read-through cache for collection endpoints.
 *
 * Portfolio content is public, read-mostly and identical for every visitor, but
 * each service issued a fresh request on every subscribe. The app shell alone
 * fetched the profile twice per navigation, once for the header and once for the
 * sidebar, and every route change refetched everything it had already seen.
 *
 * `shareReplay` with `refCount: false` keeps the last response for subscribers
 * that arrive after the request settled, which is what makes the second caller
 * free rather than merely deduplicated while in flight.
 *
 * Writes must call {@link HttpCache.invalidate} so the next read refetches.
 */
export class HttpCache<T> {
  private cached?: Observable<T>;

  /**
   * Returns the cached stream, or subscribes to `source` and caches it.
   * `source` is a factory so nothing is requested until someone actually reads.
   */
  read(source: () => Observable<T>): Observable<T> {
    if (!this.cached) {
      this.cached = source().pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.cached;
  }

  /** Drops the cached response; the next read goes back to the network. */
  invalidate(): void {
    this.cached = undefined;
  }
}
