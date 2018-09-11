import { HttpServiceInvoker } from "./http-service-invoker";
import { ClientRequest } from "http";
import * as https from "https";
import * as qs from "querystring";
import { parse as parseURL } from "url";
import { HttpReader } from "./http-reader";

/**
 * Provides a default HTTP service invoker implementation.
 *
 * @export
 * @class DefaultHttpServiceInvoker
 */
export class DefaultHttpServiceInvoker implements HttpServiceInvoker {
  async invoke(url: string, method: string, data: any): Promise<any> {
    return this.isHttps(url)
      ? this.invokeHttps(url, method, data)
      : this.invokeHttp(url, method, data);
  }

  private isHttps(url: string) {
    return url.startsWith("https://");
  }

  private invokeHttp(url: string, method: string, data: any): Promise<any> {
    return new Promise<any>(resolve => {
      const appendedURL =
        method === "GET" ? url.concat("?", qs.stringify(data)) : url;
      const request = new ClientRequest(appendedURL, async res => {
        resolve(await new HttpReader(res).readJSON());
      });

      request.setHeader("Content-Type", "application/json");
      if (method !== "GET") {
        request.write(data);
      }

      request.end();
    });
  }

  private invokeHttps(url: string, method: string, data: any): Promise<any> {
    return new Promise<any>(resolve => {
      const appendedURL =
        method === "GET" ? url.concat("?", qs.stringify(data)) : url;
      const urlParts = parseURL(appendedURL);

      const options = {
        host: urlParts.host,
        path: urlParts.path,
        method: method
      };
      const request = https.request(options, async res => {
        resolve(await new HttpReader(res).readJSON());
      });

      request.setHeader("Content-Type", "application/json");

      if (method !== "GET") {
        const dataString = JSON.stringify(data);
        request.setHeader("Content-Length", dataString.length);
        request.write(dataString);
      }

      request.end();
    });
  }
}
