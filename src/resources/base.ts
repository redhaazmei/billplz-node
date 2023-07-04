import fetch, { Response, RequestInit } from 'node-fetch';
import { FormData } from 'formdata-node';
import { fileFromPathSync } from 'formdata-node/file-from-path';

export interface APIConfig {
  /**
   * The API key for your Billplz account.
   */
  apiKey: string;

  /**
   * Specify environment to be used.
   * Options either `sandbox` or `production` environment.
   */
  environment: 'sandbox' | 'production';
}

export class BaseAPI {
  protected apiKey: string;
  protected apiUrl: string;

  constructor(config: APIConfig) {
    this.apiKey = Buffer.from(config.apiKey).toString('base64');
    this.apiUrl =
      config.environment === 'sandbox'
        ? 'https://www.billplz-sandbox.com/api/v3/'
        : 'https://www.billplz.com/api/v3/';
  }

  protected createURLSearchParams(body: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    function traverseObject(body: Record<string, any>, prefix = ''): void {
      for (const [key, value] of Object.entries(body)) {
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
          traverseObject(value, paramKey);
        } else {
          params.append(paramKey, String(value));
        }
      }
    }
    traverseObject(body);
    return params;
  }

  protected createFormData(body: Record<string, any>): FormData {
    const form = new FormData();
    function traverseObject(body: Record<string, any>, prefix = ''): void {
      for (const [key, value] of Object.entries(body)) {
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        if (paramKey === 'photo' || paramKey === 'logo') {
          form.append(
            paramKey,
            fileFromPathSync(value, value, { type: `image/${value.split('.').pop()}` }),
          );
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          traverseObject(value, paramKey);
        } else {
          form.append(paramKey, String(value));
        }
      }
    }
    traverseObject(body);
    return form;
  }

  protected async requestURLEncoded(method: string, path: string, body: object): Promise<Response> {
    const url = `${this.apiUrl}${path}`;
    const headers = {
      Authorization: `Basic ${this.apiKey}`,
    };
    const options: RequestInit = {
      method,
      headers,
      body: this.createURLSearchParams(body),
    };
    const response: Response = await fetch(url, options);
    return response;
  }

  protected async requestMultipart(method: string, path: string, body: object): Promise<Response> {
    const url = `${this.apiUrl}${path}`;
    const headers = {
      Authorization: `Basic ${this.apiKey}`,
    };
    const options: RequestInit = {
      method,
      headers,
      body: this.createFormData(body),
    };
    const response: Response = await fetch(url, options);
    return response;
  }
}
