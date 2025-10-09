import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    const ctx = context || this.context;
    console.log(`[${new Date().toISOString()}] [LOG] ${ctx ? `[${ctx}] ` : ''}${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    const ctx = context || this.context;
    console.error(`[${new Date().toISOString()}] [ERROR] ${ctx ? `[${ctx}] ` : ''}${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    const ctx = context || this.context;
    console.warn(`[${new Date().toISOString()}] [WARN] ${ctx ? `[${ctx}] ` : ''}${message}`);
  }

  debug(message: string, context?: string) {
    const ctx = context || this.context;
    console.debug(`[${new Date().toISOString()}] [DEBUG] ${ctx ? `[${ctx}] ` : ''}${message}`);
  }

  verbose(message: string, context?: string) {
    const ctx = context || this.context;
    console.log(`[${new Date().toISOString()}] [VERBOSE] ${ctx ? `[${ctx}] ` : ''}${message}`);
  }
}
