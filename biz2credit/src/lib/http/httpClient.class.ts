import { HttpClient, HttpHandler } from '@angular/common/http';
import { StaticProvider } from '@angular/core';

export class CustomHttpClient extends HttpClient {
    constructor(httpHandler: HttpHandler) {
        super(httpHandler);
    }
}


/**
 * Provider for overwriting the default HttpClient of Angular. For instance:
 *
 * @Injectable()
 * export class AsimpleExampleOfService {
 *    constructor(private http: HttpClient)
 * }
 */
export const HttpClientAsDefaultHttpProvider: StaticProvider = {
    provide: HttpClient,
    useClass: CustomHttpClient,
    deps: [HttpHandler]
};

