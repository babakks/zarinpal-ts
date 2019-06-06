import { AsyncMap } from "./asyncMap";

/**
 * Wraps `Map<K, V>` as an `AsyncMap<K, V>`.
 *
 * @export
 * @class DefaultAsyncMap
 * @implements {AsyncMap<K, V>}
 * @template K
 * @template V
 */
export class DefaultAsyncMap<K, V> implements AsyncMap<K, V> {
  private map = new Map<K, V>();

  /**
   * Stores given key/value pair.
   *
   * @param {K} key Key of the key/value pair to store.
   * @param {V} value Value of the key/value pair to store.
   * @returns {Promise<void>} A `Promise` that resolves if the key/value was
   *   stored successfully; otherwise, the `Promise` rejects.
   * @memberof AsyncMap
   */
  async set(key: K, value: V): Promise<void> {
    this.map.set(key, value);
  }

  /**
   * Retrieves value associated to given key.
   *
   * @param {K} key Key to retrieve value associated to.
   * @returns {Promise<V | undefined>} A `Promise` that resolves with the
   *   corresponding value; otherwise, `undefined`.
   * @memberof AsyncMap
   */
  async get(key: K): Promise<V | undefined> {
    return this.map.get(key);
  }
}
