# Como voltar neste projeto (frontend OS¹)

Guia simples, sem termos técnicos, pra você reabrir este projeto do zero.

## 1. Abra o Terminal

No Mac: aperte `Cmd + Espaço`, digite "Terminal" e dê Enter.

## 2. Entre na pasta do projeto

Cole este comando e aperte Enter:

```
cd ~/codify/your-github-space
```

## 3. Abra o Claude Code

Cole este comando e aperte Enter:

```
claude
```

## 4. O que dizer pra retomar de onde parou

Cole exatamente esta frase:

> "voltei no projeto your-github-space (frontend do OS¹). Me dá um resumo do estado atual — o que está commitado, o que não está, e se sobrou algo pendente de uma sessão anterior."

O Claude Code vai checar o estado real do código (não confiar só na memória) e te contar o que encontrar.

## 5. Coisas que ficaram pendentes nesta sessão (22-25/jul/2026)

- **Mudanças no código ainda não salvas no histórico (git):** `src/App.tsx`, `src/components/ChatPanel.tsx`, `src/components/maps/LeafletFallbackMap.tsx` foram alterados mas ainda não foram "commitados". Isso é normal e intencional — você pediu pra testar com o olho antes.
- **Um "atalho de teste" ainda está ativo no código:** uma trava que bloqueia o app no navegador comum (fora do Electron) foi temporariamente desligada pra você testar no Safari. Ela está marcada no código com o comentário `TEMP` e precisa ser revertida quando você não precisar mais dela — só pedir "reverte o bypass do Safari" que o Claude Code volta.
- Há 12 commits salvos localmente que ainda não foram enviados pro GitHub (isso é normal, só envie quando quiser publicar).

## 6. Se quiser só ver o app rodando (sem mexer em nada)

Peça: *"sobe o sistema no Electron e no navegador, igual da última vez"* — o Claude Code sabe subir o backend, o frontend e o Electron juntos.
