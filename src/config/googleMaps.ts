export const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string ?? '').trim();

export const DEFAULT_CENTER = { lat: -23.5614, lng: -46.6560 }; // Av. Paulista

export const DEFAULT_ZOOM = 15;

export const GOOGLE_MAPS_LIBRARIES: ('places' | 'geometry')[] = [];

export const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a3a3a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a3a1a' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#555555' }] },
];
