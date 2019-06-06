/**
 * Defines an interface for HTTP/HTTPS service invokers.
 *
 * @export
 * @interface HttpServiceInvoker
 */
export interface HttpServiceInvoker {
  /**
   * Invokes HTTP/HTTPS service method and returns the response data
   * asynchronously.
   *
   * @param {string} url Service method URL.
   * @param {string} method HTTP request method (e.g., "GET").
   * @param {*} data
   * @returns {Promise<any>}
   * @memberof HttpServiceInvoker
   */
  invoke(url: string, method: string, data: any): Promise<any>;
}
