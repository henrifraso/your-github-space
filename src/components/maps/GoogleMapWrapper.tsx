import React from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MAP_STYLES, GOOGLE_MAPS_LIBRARIES } from '../../config/googleMaps';

const containerStyle = { width: '100%', height: '100%' };

interface Props {
  center: google.maps.LatLngLiteral;
  zoom: number;
  onMapLoad?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

export function GoogleMapWrapper({ center, zoom, onMapLoad, children }: Props) {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
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
    </LoadScript>
  );
}
