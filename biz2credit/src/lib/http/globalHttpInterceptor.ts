import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent,
    HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger, LogLevel, SetupLogger } from '../logger';
import { HTTP_CODE } from './http.constant';
import { ConfigService } from '../configuration';

@SetupLogger('GlobalInterceptor')
@Injectable()
export class GlobalHttpInterceptor  implements HttpInterceptor {

    logger: Logger;
    constructor(private configSrv: ConfigService) {
        this.logger.setLevel(this.configSrv.getEnvironment().production ? LogLevel.OFF : LogLevel.TRACE);
    }

    /**
     * Function to fetch the logged In Username and set in the Service Headers
     */
    getLoggedInUserName() {
        const userName = localStorage.getItem('username');
        if (userName !== null && userName !== undefined && userName.match('@') !== null) {
            return userName.split('@')[0].toLowerCase();
        } else {
            return userName || 'admin';
        }
    }
    interceptRequest(request: HttpRequest<any>): HttpRequest<any> {
        const customRequest = request.clone({
            method: request.method !== null ? request.method : request.method,
            url: request.url !== null ? request.url : request.url,
            headers: request.headers.set('username', this.getLoggedInUserName())
        });
        this.logger.debug('Processing request result: ', customRequest);
        return customRequest;
    }

    private afterAllError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleBadRequestError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleForbiddenError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleUnauthorizedError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleNotFoundError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleClientError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleInternalServerError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    private handleServerError(request: HttpRequest<any>, response: HttpErrorResponse) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const customRequest = this.interceptRequest(request);
        return next.handle(customRequest).pipe(
            tap(
                (ev: HttpEvent<any>) => {
                    if (ev instanceof HttpResponse) {
                        this.logger.debug('processing response', ev);
                    }
                },
                (response: any) => {
                    if (response instanceof HttpErrorResponse) {
                        if (response.status && response.status.toString().match(/^4[0-9]{2}/)) {
                            this.logger.error('Processing client http error', response);
                            switch (response.status) {
                                case HTTP_CODE.BAD_REQUEST:
                                    this.handleBadRequestError(request, response);
                                    break;
                                case HTTP_CODE.FORBIDDEN:
                                    this.handleForbiddenError(request, response);
                                    break;
                                case HTTP_CODE.UNAUTHORIZED:
                                    this.handleUnauthorizedError(request, response);
                                    break;
                                case HTTP_CODE.NOT_FOUND:
                                    this.handleNotFoundError(request, response);
                                    break;
                                default:
                                    this.handleClientError(request, response);
                            }
                        } else if (response.status && response.status.toString().match(/^5[0-9]{2}/)) {
                            this.logger.error('Processing server http error', response);
                            switch (response.status) {
                                case HTTP_CODE.INTERNAL_SERVER_ERROR:
                                    this.handleInternalServerError(request, response);
                                    break;
                                default:
                                    this.handleServerError(request, response);
                            }
                        } else {
                            this.logger.error('Processing unknown http error', response);
                        }
                        this.afterAllError(request, response);
                    }
                }
            )
        );

    }

}

export const globalInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: GlobalHttpInterceptor,
    multi: true
};
