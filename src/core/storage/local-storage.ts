// Acesso seguro a `localStorage`.
//
// Princípios:
//   1. Nunca lançar erro pro usuário. Qualquer falha (quota, SSR,
//      modo privado, JSON inválido) cai num fallback silencioso.
//   2. Nunca quebrar se o JSON estiver corrompido — retorna fallback.
//   3. Funciona em ambiente sem `window` (SSR/build estático).
//   4. Não introduz logging em produção; só dispara `console.warn`
//      quando o build é dev (`import.meta.env.DEV`).
//   5. Não inspeciona conteúdo nem se vincula a auth — é puramente
//      um adaptador de I/O.
//
// O módulo NÃO mexe em chaves existentes; apenas troca como o código
// lê/escreve. Compatibilidade com nomes (`os1_*`) preservada.

// Detecta se `localStorage` está acessível sem disparar exception.
function hasLS(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

// `import.meta.env.DEV` é true em `vite dev`, false em `vite build`.
function devWarn(msg: string, err?: unknown): void {
  try {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[storage] ${msg}`, err);
    }
  } catch {
    /* ignore */
  }
}

// ─── string ────────────────────────────────────────────────────────
export function safeGetString(key: string, fallback = ''): string {
  if (!hasLS()) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch (e) {
    devWarn(`safeGetString(${key}) falhou`, e);
    return fallback;
  }
}

export function safeSetString(key: string, value: string): boolean {
  if (!hasLS()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    devWarn(`safeSetString(${key}) falhou`, e);
    return false;
  }
}

// ─── JSON ──────────────────────────────────────────────────────────
export function safeGetJSON<T>(key: string, fallback: T): T {
  if (!hasLS()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    devWarn(`safeGetJSON(${key}) falhou (json inválido ou inacessível)`, e);
    return fallback;
  }
}

export function safeSetJSON<T>(key: string, value: T): boolean {
  if (!hasLS()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    devWarn(`safeSetJSON(${key}) falhou (quota ou serialização)`, e);
    return false;
  }
}

// ─── remoção ───────────────────────────────────────────────────────
export function safeRemove(key: string): void {
  if (!hasLS()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    devWarn(`safeRemove(${key}) falhou`, e);
  }
}

// ─── arrays ────────────────────────────────────────────────────────
// Leitura tipada que SEMPRE devolve array — útil pra evitar `as T[]`
// repetitivo em call sites de browser-actions / map-actions.
export function readArray<T>(key: string): T[] {
  const v = safeGetJSON<unknown>(key, []);
  return Array.isArray(v) ? (v as T[]) : [];
}

// Prepende `item` à frente do array em `key`, opcionalmente truncando
// pelo `maxItems`. Devolve o array final (já gravado).
export function appendToArray<T>(key: string, item: T, maxItems?: number): T[] {
  const current = readArray<T>(key);
  const next = [item, ...current];
  const trimmed = typeof maxItems === 'number' && maxItems >= 0 ? next.slice(0, maxItems) : next;
  safeSetJSON(key, trimmed);
  return trimmed;
}
