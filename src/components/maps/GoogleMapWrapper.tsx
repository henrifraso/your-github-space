import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MAP_STYLES, GOOGLE_MAPS_LIBRARIES } from '../../config/googleMaps';

const containerStyle = { width: '100%', height: '100%' };

interface Props {
  center: google.maps.LatLngLiteral;
  zoom: number;
  onMapLoad?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

// ─── Loader manual via <script> tag ───────────────────────────────────────
// Substituiu o `useJsApiLoader` da @react-google-maps/api porque em React 18
// StrictMode (dev) o efeito roda 2x e o loader fica preso em loading.
// Esta versão injeta o script UMA vez com callback global e expõe estado via
// listeners. Idempotente — múltiplas chamadas reusam a mesma promise.

interface LoaderState { isLoaded: boolean; loadError: Error | null; }
const SCRIPT_ID = 'os1-gmaps-script';
const CALLBACK_NAME = '__os1GmapsCallback';
let loaderPromise: Promise<void> | null = null;
const listeners = new Set<(s: LoaderState) => void>();
let currentState: LoaderState = { isLoaded: false, loadError: null };

function notify() {
  listeners.forEach(fn => { try { fn(currentState); } catch { /* ignore */ } });
}

function ensureGoogleMapsLoaded(): Promise<void> {
  if (currentState.isLoaded) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise<void>((resolve, reject) => {
    // Já existe script (HMR re-mount): só espera callback.
    if (document.getElementById(SCRIPT_ID)) {
      if ((window as any).google?.maps) { resolve(); return; }
      // Script existe mas ainda não terminou — fica em loop curto esperando.
      const iv = window.setInterval(() => {
        if ((window as any).google?.maps) { window.clearInterval(iv); resolve(); }
      }, 50);
      window.setTimeout(() => { window.clearInterval(iv); reject(new Error('Google Maps timeout (script existente)')); }, 15000);
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) { reject(new Error('VITE_GOOGLE_MAPS_KEY não configurada')); return; }
    (window as any)[CALLBACK_NAME] = () => { resolve(); };
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.async = true;
    s.defer = true;
    const libs = GOOGLE_MAPS_LIBRARIES.length ? `&libraries=${GOOGLE_MAPS_LIBRARIES.join(',')}` : '';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}${libs}&callback=${CALLBACK_NAME}`;
    s.onerror = (e) => { reject(new Error(`Script onerror: ${(e as any)?.message || 'request bloqueada'}`)); };
    s.onload = () => {
      // Script carregou mas window.google pode ainda não estar populado se foi um stub vazio (típico de adblock).
      window.setTimeout(() => {
        if (!(window as any).google?.maps) {
          reject(new Error('Script carregou mas window.google.maps não foi populado — provavelmente bloqueado por extensão do navegador (AdBlock/uBlock/Brave Shields) ou filtro de rede (PiHole)'));
        }
      }, 1500);
    };
    // Timeout absoluto: 8s sem callback = falha
    window.setTimeout(() => {
      if (!(window as any).google?.maps) {
        reject(new Error('Timeout 8s — script não executou. Causa típica: extensão do navegador bloqueando maps.googleapis.com. Teste em janela anônima.'));
      }
    }, 8000);
    document.head.appendChild(s);
  });
  loaderPromise.then(
    () => { currentState = { isLoaded: true, loadError: null }; notify(); },
    (err) => { currentState = { isLoaded: false, loadError: err instanceof Error ? err : new Error(String(err)) }; notify(); }
  );
  return loaderPromise;
}

export function useGoogleMaps(): LoaderState {
  const [state, setState] = useState<LoaderState>(currentState);
  useEffect(() => {
    listeners.add(setState);
    ensureGoogleMapsLoaded().catch(() => { /* erro já está em currentState */ });
    // Sync inicial caso loader já tenha terminado antes da subscription
    setState(currentState);
    return () => { listeners.delete(setState); };
  }, []);
  return state;
}

// Painel de diagnóstico visível depois de 4s travado.
function LoadingMaps() {
  const [showDiag, setShowDiag] = useState(false);
  const [diag, setDiag] = useState({ keyLen: 0, hasGoogle: false, hasMaps: false, scriptCount: 0, scriptSrc: '', scriptReadyState: '' });
  useEffect(() => {
    const t = window.setTimeout(() => {
      const scripts = Array.from(document.scripts).filter(s => s.src.includes('maps.googleapis.com'));
      setDiag({
        keyLen: (GOOGLE_MAPS_API_KEY || '').length,
        hasGoogle: typeof (window as any).google !== 'undefined',
        hasMaps: typeof (window as any).google?.maps !== 'undefined',
        scriptCount: scripts.length,
        scriptSrc: scripts[0]?.src.slice(0, 110) || '(nenhum)',
        scriptReadyState: (document as any).readyState || '',
      });
      setShowDiag(true);
    }, 4000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-[#1a1a1a] flex flex-col items-center justify-center px-6 gap-4">
      <div className="text-white/40 text-xs">Carregando Google Maps…</div>
      {showDiag && (
        <div className="text-[11px] text-white/55 leading-relaxed max-w-lg bg-white/5 border border-white/10 rounded-lg p-3 font-mono">
          <div className="font-sans text-white/85 mb-2 text-xs not-italic">⚠ Demorando demais — diagnóstico:</div>
          <div>key length: <b>{diag.keyLen}</b> {diag.keyLen === 0 && <span className="text-red-400">(VAZIA — env não lida)</span>}</div>
          <div>window.google: <b>{String(diag.hasGoogle)}</b></div>
          <div>window.google.maps: <b>{String(diag.hasMaps)}</b></div>
          <div>scripts maps.googleapis: <b>{diag.scriptCount}</b></div>
          <div className="break-all mt-1">script[0]: {diag.scriptSrc}</div>
          <div>document.readyState: {diag.scriptReadyState}</div>
        </div>
      )}
    </div>
  );
}

export function GoogleMapWrapper({ center, zoom, onMapLoad, children }: Props) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    // eslint-disable-next-line no-console
    console.error('[GoogleMapWrapper] loadError:', loadError);
    return (
      <div style={containerStyle} className="bg-[#1a1a1a] flex items-center justify-center px-6">
        <div className="text-center max-w-md text-white/70 text-xs leading-relaxed">
          <p className="font-semibold text-white/90 mb-2">Google Maps não carregou</p>
          <p className="mb-3">{String((loadError as Error)?.message ?? loadError)}</p>
          <p className="text-white/40">Causas comuns: API key restrita a outro domínio (verifique no Cloud Console), billing não habilitado, ou bloqueio de rede. Veja detalhes no console (Cmd+Opt+I).</p>
          <code className="block mt-3 text-[10px] text-white/40 break-all">key: {GOOGLE_MAPS_API_KEY ? GOOGLE_MAPS_API_KEY.slice(0, 10) + '…' : '(vazia)'}</code>
        </div>
      </div>
    );
  }
  if (!isLoaded) {
    return <LoadingMaps />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onMapLoad}
      options={{
        styles: MAP_STYLES,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy',
      }}
    >
      {children}
    </GoogleMap>
  );
}
