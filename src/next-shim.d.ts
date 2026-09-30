declare module 'next/headers' {
  export interface CookieItem {
    name: string;
    value: string;
  }
  export interface CookieStore {
    getAll(): CookieItem[];
    set(name: string, value: string, options?: Record<string, unknown>): void;
  }
  export function cookies(): Promise<CookieStore>;
}

declare module 'next/server' {
  export interface RequestCookies {
    getAll(): Array<{ name: string; value: string }>;
    set(name: string, value: string, options?: Record<string, unknown>): void;
  }
  export interface NextRequest {
    headers: Headers;
    cookies: RequestCookies;
  }
  export class NextResponse {
    cookies: RequestCookies;
    static next(init?: { request?: { headers?: Headers } | NextRequest }): NextResponse;
  }
}
