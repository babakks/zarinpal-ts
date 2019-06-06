/**
 * Defines a generally asynchronous key/value map (e.g., a
 * persistence-enabled map).
 *
 * @export
 * @interface AsyncMap
 * @template K Type of keys.
 * @template V Type of values.
 */
export interface AsyncMap<K, V> {
  /**
   * Stores given key/value pair.
   *
   * @param {K} key Key of the key/value pair to store.
   * @param {V} value Value of the key/value pair to store.
   * @returns {Promise<void>} A `Promise` that resolves if the key/value was
   *   stored successfully; otherwise, the `Promise` rejects.
   * @memberof AsyncMap
   */
  set(key: K, value: V): Promise<void>;

  /**
   * Retrieves value associated to given key.
   *
   * @param {K} key Key to retrieve value associated to.
   * @returns {Promise<V | undefined>} A `Promise` that resolves with the
   *   corresponding value; otherwise, `undefined`.
   * @memberof AsyncMap
   */
  get(key: K): Promise<V | undefined>;
}
