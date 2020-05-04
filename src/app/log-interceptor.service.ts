import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpEventType,
} from "@angular/common/http";
import { tap } from "rxjs/operators";

export class LogInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append("Custom_log_header", "Logging"),
    });

    return next.handle(modifiedReq).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log("Logging interceptor event body: ", event.body);
        }
      })
    );
  }

  constructor() {}
}
