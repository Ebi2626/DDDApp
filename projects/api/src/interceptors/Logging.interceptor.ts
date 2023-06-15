import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.group("REQUEST");
    console.log("Before reaching the request handler:");
    console.groupEnd();

    const methodName = context.getHandler().name;
    const className = context.getClass().name;

    const startTime = Date.now();
    return next
      .handle()
      .pipe(
        tap((value: any) => {
          console.group('RESPONSE');
          console.log(`Response Lag for ${methodName} in class ${className}: ${Date.now() - startTime}ms`);
          console.log('Response: ', value);
          console.groupEnd();
        }
        )
      )
  }
}