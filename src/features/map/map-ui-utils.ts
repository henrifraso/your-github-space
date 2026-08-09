// Helpers puros do Mapa Competitivo OS¹.
//
// Conteúdo movido de src/components/maps/CompetitiveMap.tsx (Fase 14).
// Sem JSX, sem hooks — só dados e funções de geometria.

// ── Coordenadas Pacheco (RJ nacional) ───────────────────────────────
// Índices mapeados para os 16 concorrentes de NUBANK_DATA.concorrentes.
// Centro: Rio de Janeiro (HQ Pacheco). Nacionais distribuídos pelas cidades reais.
export const NUBANK_COORDS: google.maps.LatLngLiteral[] = [
  { lat: -23.5637, lng: -46.7388 }, // [0]  RD Saúde — Butantã/SP
  { lat: -3.7172,  lng: -38.5434 }, // [1]  Pague Menos — Fortaleza/CE
  { lat: -30.0346, lng: -51.2300 }, // [2]  Farmácias São João — Porto Alegre/RS
  { lat: -30.0410, lng: -51.2045 }, // [3]  Panvel — Porto Alegre/RS
  { lat: -19.9247, lng: -43.9382 }, // [4]  Drogaria Araujo — BH/MG
  { lat: -23.5063, lng: -46.6282 }, // [5]  Ultrafarma — Vila Maria/SP
  { lat: -22.9035, lng: -43.1823 }, // [6]  Drogaria Venancio — Centro/RJ
  { lat: -25.4278, lng: -49.2713 }, // [7]  Farmácias Nissei — Curitiba/PR
  { lat: -21.1704, lng: -47.8103 }, // [8]  Drogal — Ribeirão Preto/SP
  { lat: -1.4558,  lng: -48.4902 }, // [9]  Big Benn — Belém/PA
  { lat: -22.8553, lng: -43.3211 }, // [10] Drogaria Tamoio — Vila da Penha/RJ
  { lat: -22.9840, lng: -43.2257 }, // [11] Drogaria Universitária — Leblon/RJ
  { lat: -23.5620, lng: -46.6548 }, // [12] Pacheco SP (DPSP) — Bela Vista/SP
  { lat: -23.3586, lng: -46.8789 }, // [13] Farmácia Permanente — Cajamar/SP
  { lat: -23.5466, lng: -46.6385 }, // [14] Onofre Online — SP
  { lat: -30.0505, lng: -51.2050 }, // [15] Eu Quero Mais Saúde — Porto Alegre/RS
  // ── Locais RJ (raio próximo) ─────────────────────────────────────────────────
  { lat: -22.9340, lng: -43.1800 }, // [16] Droga Raia — Flamengo/RJ (~3.4km)
  { lat: -22.9083, lng: -43.1932 }, // [17] Venancio — Lapa/RJ (~1.4km)
  { lat: -22.9201, lng: -43.1779 }, // [18] Venancio — Glória/RJ (~2km)
  { lat: -22.9230, lng: -43.1840 }, // [19] Santa Clara — Santa Teresa/RJ (~2.2km)
  { lat: -22.9469, lng: -43.1859 }, // [20] Drogasil — Botafogo/RJ (~4.7km)
  { lat: -22.8980, lng: -43.2780 }, // [21] Pague Menos — Méier/RJ (~8km)
  { lat: -22.9295, lng: -43.1773 }, // [22] Farmácia Carioca — Catete/RJ (~3km)
  { lat: -22.9248, lng: -43.2351 }, // [23] Mais Saúde — Tijuca/RJ (~7km)
];

// ── Coordenadas Pacheco Loja Centro (RJ local) ──────────────────────
// Índices para os 7 concorrentes de pacheco-loja-01. Centro: Centro/RJ.
export const PACHECO_LOJA_COORDS: google.maps.LatLngLiteral[] = [
  { lat: -22.9035, lng: -43.1823 }, // [0]  Venancio — Centro/RJ
  { lat: -22.8553, lng: -43.3211 }, // [1]  Tamoio — Vila da Penha/RJ
  { lat: -22.9840, lng: -43.2257 }, // [2]  Universitária — Leblon/RJ
  { lat: -22.9200, lng: -43.1620 }, // [3]  Onofre+iFood — RJ
  { lat: -22.9300, lng: -43.1900 }, // [4]  Farmácia Permanente — RJ
  { lat: -22.9469, lng: -43.1859 }, // [5]  RD Saúde — Botafogo/RJ
  { lat: -22.9676, lng: -43.1879 }, // [6]  Drogal — Copacabana/RJ
];

// ── Coordenadas Oscar (SJC) ─────────────────────────────────────────
// Índices mapeados para os 16 concorrentes de NIKE_DATA.concorrentes.
// Centradas em São José dos Campos (matriz Oscar) — lat -23.2237, lng -45.9009.
// Locais (0-5) visíveis em raios normais; nacionais (6+) só em "Sem limite".
export const OSCAR_COORDS: google.maps.LatLngLiteral[] = [
  { lat: -23.2219, lng: -45.8979 }, // [0]  Centauro SJC — Center Vale Shopping (~300m NE)
  { lat: -23.2225, lng: -45.8985 }, // [1]  Arezzo SJC — Center Vale Shopping (~270m NE)
  { lat: -23.2290, lng: -45.8860 }, // [2]  Constance — Jd. Satélite (~1.6km E)
  { lat: -23.2380, lng: -45.9240 }, // [3]  Usaflex — Vale Sul Shopping (~1.7km S)
  { lat: -23.2215, lng: -45.8972 }, // [4]  Sapatella — Center Vale Shopping (~350m NE)
  { lat: -22.8600, lng: -46.3180 }, // [5]  Netshoes — CD Extrema/MG (~65km NW)
  { lat: -20.5386, lng: -47.4008 }, // [6]  Magalu — CD Franca/SP (~310km NW)
  { lat: -26.3037, lng: -48.8456 }, // [7]  Esposende — Joinville SC (~490km S)
  { lat: -30.0346, lng: -51.2177 }, // [8]  Lojas Pompeia — Porto Alegre (~900km S)
  { lat: -23.0320, lng: -45.5460 }, // [9]  Centauro Taubaté — Via Vale Garden (~36km NE)
  { lat: -29.6290, lng: -50.8280 }, // [10] Calçados Bibi — Parobé RS (~840km S)
  { lat: -23.5932, lng: -46.6213 }, // [11] Aramis — Vila Olímpia SP (~90km SW)
  { lat: -23.5719, lng: -46.6589 }, // [12] Zattini — online/SP (~88km SW)
  { lat: -30.0346, lng: -51.2200 }, // [13] Renner — Porto Alegre (~900km S)
  { lat: -30.0400, lng: -51.2100 }, // [14] Paquetá Sports — Porto Alegre (~900km S)
  { lat: -23.5680, lng: -46.6490 }, // [15] Shoestock — online/SP (~87km SW)
  // ── Novos locais SJC (raio 5km) ──────────────────────────────────────────
  { lat: -23.2217, lng: -45.8977 }, // [16] Studio Z — Center Vale (~400m NE)
  { lat: -23.2222, lng: -45.8983 }, // [17] Sonho dos Pés — Center Vale (~360m NE)
  { lat: -23.2285, lng: -45.8855 }, // [18] Di Gaspi — Jd. Satélite (~1.8km E)
  { lat: -23.2375, lng: -45.9235 }, // [19] World Tennis — Vale Sul (~1.6km S)
  { lat: -23.2155, lng: -45.8840 }, // [20] Riachuelo Calçados — Colinas Shopping (~2.5km NE)
  // ── Regionais (raio 50km) ────────────────────────────────────────────────
  { lat: -23.3084, lng: -45.9657 }, // [21] Centauro Jacareí — NovaShopping (~20km E)
  { lat: -23.0330, lng: -45.5480 }, // [22] Americanas Calçados — Taubaté Shopping (~35km NE)
];

// ── Coordenadas fixas dos concorrentes ──────────────────────────────
// Cada índice corresponde à posição na lista `competitors` recebida
// pelo componente. Mantém EXATAMENTE as 28 coordenadas originais
// (18 dentro da Grande SP, 10 nacionais visíveis apenas em "Sem limite").
export const COORDS: google.maps.LatLngLiteral[] = [
  // ── Grande SP (raio até 50km) ──────────────────────────────────────────────
  { lat: -23.5590, lng: -46.6564 }, // [0]  ~270m N
  { lat: -23.5612, lng: -46.6519 }, // [1]  ~400m E
  { lat: -23.5571, lng: -46.6509 }, // [2]  ~830m NE
  { lat: -23.5514, lng: -46.6609 }, // [3]  ~1.2km NW
  { lat: -23.5491, lng: -46.6571 }, // [4]  ~1.4km N
  { lat: -23.5672, lng: -46.6451 }, // [5]  ~1.5km SE
  { lat: -23.5739, lng: -46.6421 }, // [6]  ~2.3km SE
  { lat: -23.5467, lng: -46.6336 }, // [7]  ~3.5km NE
  { lat: -23.5614, lng: -46.7051 }, // [8]  ~5km W
  { lat: -23.5974, lng: -46.6560 }, // [9]  ~4km S
  { lat: -23.5932, lng: -46.6213 }, // [10] ~5km SE
  { lat: -23.5614, lng: -46.7346 }, // [11] ~8km W
  { lat: -23.5614, lng: -46.5578 }, // [12] ~10km E
  { lat: -23.4533, lng: -46.6560 }, // [13] ~11km N
  { lat: -23.6569, lng: -46.7600 }, // [14] ~15km SW
  { lat: -23.6888, lng: -46.5172 }, // [15] ~20km SE
  { lat: -23.3832, lng: -46.4617 }, // [16] ~28km NE
  { lat: -23.5614, lng: -47.0684 }, // [17] ~42km W
  // ── Brasil nacional (só visíveis no Sem limite) ───────────────────────────
  { lat: -22.9068, lng: -43.1729 }, // [18] Rio de Janeiro — ~360km
  { lat: -19.9191, lng: -43.9386 }, // [19] Belo Horizonte — ~590km
  { lat: -25.4284, lng: -49.2733 }, // [20] Curitiba — ~400km S
  { lat: -30.0346, lng: -51.2177 }, // [21] Porto Alegre — ~900km S
  { lat: -15.7801, lng: -47.9292 }, // [22] Brasília — ~1000km N
  { lat: -12.9714, lng: -38.5014 }, // [23] Salvador — ~1900km NE
  { lat: -8.0476,  lng: -34.8770 }, // [24] Recife — ~2600km NE
  { lat: -3.7172,  lng: -38.5434 }, // [25] Fortaleza — ~2800km NE
  { lat: -3.1190,  lng: -60.0217 }, // [26] Manaus — ~2700km NW
  { lat: -27.5954, lng: -48.5480 }, // [27] Florianópolis — ~700km S
];

// ── Nota do concorrente: número real ou '—' (sem avaliação verificada) ──
// Fonte única de conversão — evita "NaN" na tela quando nota_google não é
// um número confirmado (ver docs/MODELO_MOTOR_OS1.md, limpeza ago/2026).
export function parseNota(nota: number | string | undefined | null): number | null {
  const n = Number(nota);
  return Number.isFinite(n) ? n : null;
}

export function formatNota(nota: number | string | undefined | null): string {
  const n = parseNota(nota);
  return n === null ? '—' : n.toFixed(1);
}

export function ratingColor(nota: number | string | undefined | null): string {
  const n = parseNota(nota);
  if (n === null) return '#9ca3af'; // sem avaliação — cinza neutro, não vermelho
  if (n >= 4.3) return '#22c55e';
  if (n >= 4.0) return '#f59e0b';
  return '#ef4444';
}

// ── Geometria: distância em metros entre dois pontos ────────────────
// Mesma fórmula de Haversine que o componente original usava.
export function haversineMeters(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

// ── Tabela de zoom recomendado por raio ─────────────────────────────
// Usada pelo `mapRef.current?.setZoom(...)` quando o usuário troca de raio.
export const RADIUS_ZOOM: Record<number, number> = {
  500: 17, 1000: 16, 2000: 15, 3000: 15, 5000: 14, 10000: 13, 25000: 12, 50000: 11, [Infinity]: 4,
};
