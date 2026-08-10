// Pontos reais de concorrentes/PDVs por perfil, via OSM/Overpass (09/ago/2026).
// Só coordenada real confirmada — nenhum ponto inventado. Metodologia e
// contagem por perfil documentadas na sessão (ver conversa/commit). Usado
// pelo LeafletFallbackMap (mapa de fundo do ChatDesktop) — único mapa visível
// hoje; CompetitiveMap/MarketMap são código morto (ver
// docs/pendencias-e-alcancabilidade.md, seção 7).

export interface MapPoint {
  nome: string;
  lat: number;
  lng: number;
}

export interface MapPointGroup {
  cidade: string;
  pontos: MapPoint[];
}

export const MAP_COMPETITOR_POINTS: Record<string, MapPointGroup> = {
  'mcdonalds': {
    cidade: 'São Paulo',
    pontos: [
      { nome: 'Burger King', lat: -23.6275979, lng: -46.6745107 },
      { nome: 'Subway', lat: -23.6075795, lng: -46.6931384 },
      { nome: 'Habib\'s', lat: -23.4536444, lng: -46.5340347 },
      { nome: 'Bob\'s', lat: -23.4305576, lng: -46.4897955 },
      { nome: 'Madero', lat: -23.6937064, lng: -46.5503596 },
      { nome: 'KFC', lat: -23.5422072, lng: -46.6323475 },
      { nome: 'Giraffas', lat: -23.516467, lng: -46.6234903 },
      { nome: 'Popeyes', lat: -23.7043667, lng: -46.6174071 },
      { nome: 'Burger King', lat: -23.6465143, lng: -46.5769755 },
      { nome: 'Subway', lat: -23.6150532, lng: -46.5725782 },
      { nome: 'Habib\'s', lat: -23.5526102, lng: -46.634712 },
      { nome: 'Bob\'s', lat: -23.5228363, lng: -46.5244216 },
      { nome: 'Madero', lat: -23.580216, lng: -46.5937908 },
      { nome: 'KFC', lat: -23.7234315, lng: -46.543449 },
      { nome: 'Giraffas', lat: -23.538746, lng: -46.6057937 },
      { nome: 'Popeyes', lat: -23.6490272, lng: -46.5319849 },
      { nome: 'Burger King', lat: -23.5400121, lng: -46.4500874 },
      { nome: 'Subway', lat: -23.5725112, lng: -46.5873406 },
      { nome: 'Habib\'s', lat: -23.6670526, lng: -46.521314 },
      { nome: 'Bob\'s', lat: -23.5155673, lng: -46.6239024 },
    ],
  },
  'nike': {
    cidade: 'São José dos Campos',
    pontos: [
      { nome: 'Raissa', lat: -22.8231049, lng: -45.6664362 },
      { nome: 'JTF Moda', lat: -23.1885173, lng: -45.8757802 },
      { nome: 'Casa Libano', lat: -23.1886308, lng: -45.8756115 },
      { nome: 'Sagê Modas', lat: -23.1901642, lng: -45.8763572 },
      { nome: 'Outlet São José', lat: -23.1854302, lng: -45.8849858 },
      { nome: 'Calcevale', lat: -23.1816278, lng: -45.8859118 },
      { nome: 'HLN', lat: -23.1850427, lng: -45.8852769 },
      { nome: 'Lancelot', lat: -23.2041021, lng: -45.9020989 },
      { nome: 'Gonga Zona', lat: -23.1887759, lng: -45.8746529 },
      { nome: 'Sugol Moda Intima', lat: -23.1887367, lng: -45.8747877 },
      { nome: 'Alice Modas', lat: -23.1888463, lng: -45.8755485 },
      { nome: 'Loja Planalto', lat: -23.1884451, lng: -45.8746272 },
      { nome: 'Ella Bella', lat: -23.1885962, lng: -45.8748116 },
      { nome: 'Malibu Sufwear', lat: -23.1885988, lng: -45.874959 },
      { nome: 'Loja Universal', lat: -23.1886309, lng: -45.8752156 },
      { nome: 'Efeitto', lat: -23.2017448, lng: -45.894707 },
      { nome: 'Atrezzi Confort', lat: -23.2039533, lng: -45.8978392 },
      { nome: 'Mont Verney', lat: -23.2041083, lng: -45.8979835 },
      { nome: 'Attrezzi', lat: -23.204056, lng: -45.8979368 },
      { nome: 'Tom sobre Tom', lat: -23.2042251, lng: -45.8971765 },
    ],
  },
  'nubank': {
    cidade: 'Rio de Janeiro',
    pontos: [
      { nome: 'RD Saúde (Droga Raia)', lat: -22.9335801, lng: -43.1857341 },
      { nome: 'RD Saúde (Drogasil)', lat: -22.9235904, lng: -43.3752829 },
      { nome: 'Pague Menos', lat: -22.9510624, lng: -43.182912 },
      { nome: 'Venancio', lat: -22.9311959, lng: -43.1783233 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.9020736, lng: -43.1032543 },
      { nome: 'Pague Menos', lat: -22.931505, lng: -43.2394298 },
      { nome: 'Venancio', lat: -22.9334589, lng: -43.1852616 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.8058819, lng: -43.2093661 },
      { nome: 'Pague Menos', lat: -22.8981031, lng: -43.3517288 },
      { nome: 'Venancio', lat: -22.9242167, lng: -43.2340216 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.9045438, lng: -43.2886381 },
      { nome: 'Pague Menos', lat: -22.8059631, lng: -43.2101384 },
      { nome: 'Venancio', lat: -22.9336, lng: -43.1764 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.967434, lng: -43.1823143 },
      { nome: 'Pague Menos', lat: -22.9593536, lng: -43.3888245 },
      { nome: 'Venancio', lat: -22.9115679, lng: -43.1750385 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.9355818, lng: -43.1749277 },
      { nome: 'Pague Menos', lat: -22.9640703, lng: -43.1750362 },
      { nome: 'Venancio', lat: -22.9025936, lng: -43.1112012 },
      { nome: 'RD Saúde (Droga Raia)', lat: -22.9834359, lng: -43.2175435 },
    ],
  },
  'combrasil': {
    cidade: 'São José dos Campos',
    pontos: [
      { nome: 'Pão de Açúcar', lat: -23.2050744, lng: -45.9077394 },
      { nome: 'Céu Azul', lat: -23.171828, lng: -45.839593 },
      { nome: 'Supermercados Nagumo', lat: -23.2818076, lng: -45.8949615 },
      { nome: 'Marata Conveniência', lat: -23.1856811, lng: -45.8735159 },
      { nome: 'Minuto Pão de Açúcar', lat: -23.1942388, lng: -45.8922446 },
      { nome: 'Supermercado Sítio Verde', lat: -23.2374367, lng: -45.8847481 },
      { nome: 'RT Horti Fruti', lat: -23.2413739, lng: -45.8884174 },
      { nome: 'Supermercado Máximo', lat: -23.2478308, lng: -45.8857128 },
      { nome: 'Shibata', lat: -23.3059328, lng: -45.9649164 },
      { nome: 'Mercadinho', lat: -23.250901, lng: -45.8026605 },
      { nome: 'Mandarim', lat: -23.1705087, lng: -45.83792 },
      { nome: 'Kako Atacado', lat: -23.1892158, lng: -45.8756859 },
      { nome: 'Brasil Coco', lat: -23.1894256, lng: -45.8751349 },
      { nome: 'Mercadinho Vitória', lat: -23.228567, lng: -45.921994 },
      { nome: 'Supermercado JJ Loja 2', lat: -23.2716017, lng: -45.887262 },
      { nome: 'Villarreal Supermercado', lat: -23.1893773, lng: -45.933465 },
      { nome: 'Mercadinho Ana Maria', lat: -23.1826553, lng: -45.8088947 },
      { nome: 'Atacadão', lat: -23.1802493, lng: -45.8661616 },
      { nome: 'Max Atacadista', lat: -23.1854791, lng: -45.8559128 },
      { nome: 'MK Atacadista', lat: -23.2146202, lng: -45.895861 },
    ],
  },
  'cerveja-imperio': {
    cidade: 'Petrópolis',
    pontos: [
      { nome: 'Bar do Mesquita', lat: -22.5106744, lng: -43.2334392 },
      { nome: 'Bar Amigos do Barata', lat: -22.5009898, lng: -43.2017203 },
      { nome: 'Quarteirão do Sabor', lat: -22.5065771, lng: -43.1984937 },
      { nome: 'Benfica', lat: -22.3968379, lng: -43.1214409 },
      { nome: 'Paulamelia', lat: -22.5079947, lng: -43.1860876 },
      { nome: 'Bar do Caveira', lat: -22.5147671, lng: -43.1316027 },
      { nome: 'Trilha\'s Bar', lat: -22.5055616, lng: -43.2055032 },
      { nome: 'Majórica Churrascaria', lat: -22.5104573, lng: -43.1766986 },
      { nome: 'Mercearia Naranjito', lat: -22.5224216, lng: -43.1833388 },
      { nome: 'Nadez', lat: -22.5080351, lng: -43.1877505 },
      { nome: 'Conservatório do Chopp', lat: -22.5105235, lng: -43.1816881 },
      { nome: 'Bar do Negão', lat: -22.5114315, lng: -43.2011988 },
      { nome: 'Pizzaria Liberatta', lat: -22.5102871, lng: -43.1812423 },
      { nome: 'Mercadinho Valparaíso', lat: -22.5188208, lng: -43.1908264 },
      { nome: 'Point Beer', lat: -22.5321243, lng: -43.1999028 },
      { nome: 'Rink Marowill', lat: -22.5089446, lng: -43.1828557 },
      { nome: 'Casa Pellegrini', lat: -22.5047564, lng: -43.1814523 },
      { nome: 'Steakhouse', lat: -22.4104784, lng: -43.1384916 },
      { nome: 'Ta No Gosto', lat: -22.529522, lng: -43.1723252 },
      { nome: 'AM/PM', lat: -22.5104654, lng: -43.2118567 },
    ],
  },
};
