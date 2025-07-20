"use client";
import dynamic from 'next/dynamic';
import { MapPin } from "lucide-react";
import { COLORS } from '@/app/constants';
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
interface MinimapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  className?: string;
}
export default function Minimap({ 
  latitude = 48.8566, 
  longitude = 2.3522, 
  address = "Paris, France",
  className = ""
}: MinimapProps) {
  const createCustomIcon = () => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      return L.divIcon({
        html: `
          <div style="
            background: ${COLORS.primary};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 12px;
            "><MapPin className="w-4 h-4" /></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
    }
    return null;
  };
  return (
    <div className={`relative bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3 h-full w-full ${className}`}>
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/30 min-h-[200px]">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={[latitude, longitude]}
            zoom={16}
            style={{ height: '100%', width: '100%', minHeight: '200px' }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker 
              position={[latitude, longitude]} 
              icon={createCustomIcon()}
            >
              <Popup>
                <div className="text-center">
                  <strong>{address}</strong>
                  <br />
                  <small>{latitude.toFixed(4)}, {longitude.toFixed(4)}</small>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
        {typeof window === 'undefined' && (
          <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-green-100/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white/70" />
          </div>
        )}
      </div>
      <div className="mt-2 text-center">
        <p className="text-white/90 text-xs font-medium truncate">
          {address}
        </p>
        <div className="flex items-center justify-center mt-1 text-white/70 text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}
