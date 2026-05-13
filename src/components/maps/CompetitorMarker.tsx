import { MarkerF } from '@react-google-maps/api';
import type { Competitor } from '../../types';

interface Props {
  competitor: Competitor;
  position: google.maps.LatLngLiteral;
  onClick: (c: Competitor) => void;
}

function ratingColor(nota: number | string): string {
  const n = Number(nota);
  if (n >= 4.3) return '#22c55e';
  if (n >= 4.0) return '#f59e0b';
  return '#ef4444';
}

export function CompetitorMarker({ competitor, position, onClick }: Props) {
  const color = ratingColor(competitor.nota_google);
  const direto = (competitor.categoria ?? 'direto') === 'direto';

  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 7,
    fillColor: direto ? color : 'transparent',
    fillOpacity: direto ? 1 : 0,
    strokeColor: color,
    strokeWeight: 2.5,
  };

  return (
    <MarkerF
      position={position}
      icon={icon}
      title={competitor.nome}
      onClick={() => onClick(competitor)}
    />
  );
}
