import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("HTTP request is on its way");
    const modifiedRequest = req.clone({
      headers: req.headers.append("AUTH_HEADER", "Authorize"),
    });
    return next.handle(modifiedRequest);
  }

  constructor() {}
}
