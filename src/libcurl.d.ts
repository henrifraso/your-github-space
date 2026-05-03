declare module 'libcurl.js' {
  const libcurl: {
    load_wasm(url: string): Promise<void>;
    set_websocket(url: string): void;
    fetch(url: string, options?: RequestInit): Promise<Response>;
  };
  export default libcurl;
}
