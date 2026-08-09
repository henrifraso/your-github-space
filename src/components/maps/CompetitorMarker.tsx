import { MarkerF } from '@react-google-maps/api';
import type { Competitor } from '../../types';
import { ratingColor } from '../../features/map/map-ui-utils';

interface Props {
  competitor: Competitor;
  position: google.maps.LatLngLiteral;
  onClick: (c: Competitor) => void;
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
