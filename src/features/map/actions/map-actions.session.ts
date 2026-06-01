// Canal de saída de eventos das ações do mapa OS¹.
//
// Conteúdo movido de src/lib/map-actions.ts (Fase 15):
//   - `dispatchMapAction`    canal de saída para `App.tsx` ponte com
//                            workspace/feed via OS1_EVENTS.MAP_ACTION
//
// Os tipos vêm de core/types/map.ts e os eventos de core/events/os1-events.ts.

import { dispatchOS1Event, OS1_EVENTS } from '../../../core/events/os1-events';
import type { MapActionEventDetail } from '../../../core/types/map';

export function dispatchMapAction(detail: MapActionEventDetail): void {
  dispatchOS1Event<MapActionEventDetail>(OS1_EVENTS.MAP_ACTION, detail);
}
