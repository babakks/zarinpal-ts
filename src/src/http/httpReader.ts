import { IncomingMessage } from "http";

/**
 * Encapsulates asynchronous read of HTTP request/response content.
 *
 * @export
 * @class HttpReader
 */
export class HttpReader {
  /**
   * Creates an instance of `HttpReader`.
   *
   * @param {IncomingMessage} dataContainer Request/response object to read its
   *    content.
   * @memberof HttpReader
   */
  constructor(private dataContainer: IncomingMessage) {}

  /**
   * Asynchronously reads given HTTP request/response object and returns the
   * result as a @see {Buffer} object.
   *
   * @returns {Promise<Buffer>}
   * @memberof HttpReader
   */
  read(): Promise<Buffer> {
    const body: any[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      this.dataContainer.on("error", err => reject(err));
      this.dataContainer.on("data", chunk => {
        body.push(chunk);
      });

      this.dataContainer.on("end", () => {
        resolve(Buffer.concat(body));
      });
    });
  }

  /**
   * Asynchronously reads given HTTP request/response object and returns the
   * result as a string.
   *
   * @returns {Promise<string>}
   * @memberof HttpReader
   */
  async readString(): Promise<string> {
    return (await this.read()).toString();
  }

  /**
   * Asynchronously reads given HTTP request/response object, with JSON content,
   * and parses the result into a new object.
   *
   * @returns {Promise<any>}
   * @memberof HttpReader
   */
  async readJSON(): Promise<any> {
    return JSON.parse(await this.readString());
  }
}
