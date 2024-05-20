import { ApiRequestError } from '../errors';
import { AnyObject } from '../types';

export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestBody = string | AnyObject | FormData;
export type ContentType = 'application/json' | 'text/html' | null;

interface FetchResponse<T = AnyObject> extends Response {
  json<P = T>(): Promise<P>;
}

export interface FetchOptions {
  headers: Headers;
  contentType: ContentType;
}

interface MakeFetchOptions {
  method: string;
  headers: Headers;
  body: BodyInit;
}

export interface ApiClient {
  makeCall<ResBody, ReqBody extends RequestBody = RequestBody>(
    path: string,
    method?: HTTP_METHOD,
    body?: ReqBody,
    options?: Partial<FetchOptions>,
  ): Promise<ResBody>;
}

export default class RestApiClient implements ApiClient {
  protected defaultContentType: ContentType = 'application/json';

  constructor(
    private baseUrl: string,
    private apiKey: string,
  ) {
    this.checkStatus = this.checkStatus.bind(this);
  }

  public async makeCall<ResBody, ReqBody extends RequestBody = RequestBody>(
    path: string,
    method: HTTP_METHOD = 'GET',
    body?: ReqBody,
    options: Partial<FetchOptions> = {},
  ): Promise<ResBody> {
    const { headers: customHeaders, contentType = this.defaultContentType } = options;

    const headers = this.getBasicHeaders(contentType);

    customHeaders?.forEach((value: string, header: string) => {
      headers.set(header, value);
    });

    return this.makeFetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: this.stringifyBody(body) as BodyInit,
    } as MakeFetchOptions);
  }

  protected async makeFetch(url: string, options: MakeFetchOptions) {
    const response = await fetch(url, {
      headers: options.headers,
      body: options.body,
      method: options.method,
    });

    await this.checkStatus(response as FetchResponse);

    if (options.headers.get('responseType') === 'arraybuffer') {
      return response;
    }

    return response.json();
  }

  protected async checkStatus(response: FetchResponse) {
    if (response.ok) {
      return;
    }

    const body = await this.getErrorResponseBody(response);
    const errorMessage = body.message || body.data?.error || body.error?.message || response.statusText;

    throw new ApiRequestError(errorMessage, response.status);
  }

  protected getBasicHeaders(contentType?: ContentType) {
    const headers = new Headers();

    if (contentType) {
      headers.set('Accept', contentType);
      headers.set('Content-Type', contentType);
    }

    headers.set('Authorization', `Bearer ${this.apiKey}`);

    return headers;
  }

  protected stringifyBody(body?: RequestBody) {
    if (typeof body === 'string' || body instanceof FormData || typeof body === 'undefined') {
      return body;
    }

    return JSON.stringify(body);
  }

  private async getErrorResponseBody(response: FetchResponse) {
    try {
      return await response.json();
    } catch (err) {
      throw new ApiRequestError(response.statusText, response.status);
    }
  }
}
