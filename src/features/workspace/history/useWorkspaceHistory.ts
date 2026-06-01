// useWorkspaceHistory — hook React que encapsula histórico da Área de Trabalho.
//
// IMPORTANTE: este hook ainda NÃO é consumido em produção. Foi criado
// na Fase 11 como preparação para uma fase posterior (provavelmente 17,
// quando o App.tsx ganhar bridges/hooks dedicados). Hoje o App.tsx
// segue gerenciando `archivedSessionsBySector` direto via `useState`.
//
// Quando aplicado, basta substituir em App.tsx:
//   - const [archivedSessionsBySector, setArchivedSessionsBySector] = useState(...)
// por:
//   - const { archived, archive, restore, sessionsFor, open, setOpen } =
//     useWorkspaceHistory();
//
// E os handlers `onArchive`/`archivedSessions={...}` consomem o hook em
// vez do state local. Comportamento idêntico ao atual.

import { useCallback, useState } from 'react';
import {
  appendSession,
  createArchivedSession,
  getSessionsForSector,
  type ArchivedSession,
  type HistoryBucket,
  type WorkspaceSessionSnapshot,
} from './workspace-history';

export interface UseWorkspaceHistoryReturn<Msg> {
  /** Dicionário completo por setor. */
  archived: HistoryBucket<Msg>;
  /** Flag de UI: histórico aberto/fechado (substitui `chatHistoryOpen`). */
  open: boolean;
  setOpen: (v: boolean) => void;
  toggleOpen: () => void;
  /** Arquiva uma sessão (mesma semântica do callback `onArchive` atual). */
  archive: (cardTitle: string, sector: string, snapshot?: WorkspaceSessionSnapshot<Msg>) => ArchivedSession<Msg>;
  /** Sessões do setor solicitado (já com fallback `[]`). */
  sessionsFor: (sector: string) => ArchivedSession<Msg>[];
}

export function useWorkspaceHistory<Msg = unknown>(): UseWorkspaceHistoryReturn<Msg> {
  const [archived, setArchived] = useState<HistoryBucket<Msg>>({});
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => setOpen(v => !v), []);

  const archive = useCallback(
    (cardTitle: string, sector: string, snapshot?: WorkspaceSessionSnapshot<Msg>) => {
      const session = createArchivedSession<Msg>(cardTitle, sector, snapshot);
      setArchived(prev => appendSession(prev, session));
      return session;
    },
    [],
  );

  const sessionsFor = useCallback(
    (sector: string) => getSessionsForSector(archived, sector),
    [archived],
  );

  return { archived, open, setOpen, toggleOpen, archive, sessionsFor };
}
