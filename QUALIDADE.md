# QUALIDADE.md — OS¹

Referência de qualidade: ISO/IEC 25010. Este documento é um retrato HONESTO de
onde o OS¹ está em cada dimensão — não um selo de conformidade. É o mapa do que
falta pra chegar num padrão profissional pleno. Atualização: 11/jul/2026.

Estado geral: experiência de produto completa em formato e interação (Fase 1),
base técnica sólida (arquitetura organizada, sem segredos expostos, auth real).
A camada de inteligência (coleta automática de dado) ainda não existe — é o
motor, a construir.

## 1. Adequação funcional
Temos: login, navegação, mapa, feed, área de trabalho, perfis, dark mode
funcionam; 3 perfis puxam dado real do backend.
Falta: o núcleo — transformar dado de mercado em análise automática. Insights e
os 8 botões são template fixo; dado "inteligente" é inserido à mão.
Status: parcial — a casca cumpre, o miolo (motor) falta.

## 2. Eficiência de desempenho
Temos: roda bem localmente; build funciona.
Falta: nunca medido sob carga; sem métricas; bundle grande (aviso de chunk size).
Status: não avaliado.

## 3. Compatibilidade
Temos: integração com backend (Railway), Google Maps, proxy; roda em Electron e
web.
Falta: conectores de fontes externas são só modelo, não implementados (parte do
motor).
Status: parcial.

## 4. Usabilidade
Temos: interface trabalhada, fluxos pensados, área de trabalho muito refinada;
onboarding existe.
Falta: dark mode só por gesto escondido (segurar foto 3s); sino não abre nada;
configuração salva mas não dá retorno; sem teste com usuário real.
Status: bom em forma, com pontas soltas de interação.

## 5. Confiabilidade
Temos: fallbacks (login offline, dados de reserva).
Falta: ZERO testes automatizados — maior buraco desta dimensão; sem monitoramento
de erros.
Status: fraco — sem testes.

## 6. Segurança
Temos: auth JWT real; nenhum segredo commitado; chaves em variáveis de ambiente;
proxy travado (SSRF, protocolo, origin).
Falta: sem rate limiting; proxy ainda abusável por usuário logado (risco menor);
sem revisão formal de segurança.
Status: base sólida, melhorias mapeadas.

## 7. Manutenibilidade
Temos: estrutura de pastas profissional; TypeScript estrito; commits descritivos;
ESLint + Prettier ligados.
Falta: dois monólitos (App.tsx ~2.600, ChatPanel ~2.200 linhas) a quebrar aos
poucos; 281 warnings de lint a limpar gradualmente; sem testes.
Status: base boa, dívida técnica conhecida e mapeada.

## 8. Portabilidade
Temos: roda em Electron e web; build Mac/Windows; .gitignore correto.
Falta: pouco testado em ambientes diferentes; dependência morta (@google/genai) a
remover.
Status: bom.

## Prioridades pra profissionalizar (ordem)
1. O MOTOR (adequação funcional) — o núcleo do produto.
2. Testes automatizados (confiabilidade) — maior buraco; entrar cedo.
3. Quebrar os monólitos (manutenibilidade) — gradual.
4. Limpar os 281 warnings — conforme mexe em cada arquivo.
5. Pontas de interação (usabilidade) — sino, toggle dark mode, config com retorno.
6. Medir desempenho — quando houver dado real em volume.

Nota: não afirmamos conformidade com ISO 25010 — usamos como norte. Cada item é
um passo consciente, não um defeito escondido.
