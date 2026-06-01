# core/storage

Acesso seguro a `localStorage`.

Conteúdo previsto:
- `local-storage.ts` — `safeGetJSON`, `safeSetJSON`, `safeRemove`,
  `safeGetString`, `safeSetString`, `readArray`, `appendToArray`.

Regra: as features não chamam `localStorage` diretamente — usam os helpers
daqui. Isso facilita futuras mudanças (migração, namespacing por usuário,
quota, telemetria) sem mexer em cada call site.

Não tocar em auth tokens nem em chaves sensíveis sem necessidade.
