import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from "@angular/common/http";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
  // with this we are intercepting ALL Http requests
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("HTTP request is on its way");
    const modifiedRequest = req.clone({
      // req is immutable object, so we clone and return this clone in handle
      headers: req.headers.append("AUTH_HEADER", "Authorize"),
    });
    // we can also intercept and manipulate the response of the request, since it is an Observable
    // careful with manipulation because it can break code somewhere
    return next.handle(modifiedRequest).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log("Http Response arrived safely");
        }
      })
    );
  }

  constructor() {}
}
