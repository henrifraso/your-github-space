declare module 'libcurl.js' {
  export const libcurl: {
    load_wasm(url: string): Promise<void>;
    set_websocket(url: string): void;
    fetch(url: string, options?: RequestInit): Promise<Response>;
  };
}
