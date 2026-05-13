import { MarkerF } from '@react-google-maps/api';

interface Props {
  position: google.maps.LatLngLiteral;
}

export function ClientMarker({ position }: Props) {
  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: '#3b82f6',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 3,
  };
  return <MarkerF position={position} icon={icon} title="Você está aqui" />;
}
