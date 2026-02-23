import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LeafletMouseEvent } from 'leaflet';

import { useAppLocation } from '../location/LocationContext';
import type { AppLocation } from '../location/types';
import { getTimeZoneForLocation } from '../timezone';

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function formatCoord(n: number): string {
  return Number.isFinite(n) ? n.toFixed(5) : '';
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    // React-Leaflet's `MapContainer` center prop is only used on initial mount.
    // Keep the current zoom level; just pan/animate to the new center.
    map.setView(center, map.getZoom(), { animate: true });
  }, [map, center]);

  return null;
}

const PRESET_LOCATIONS: AppLocation[] = [
  { name: 'Makkah, Saudi Arabia', latitude: 21.3891, longitude: 39.8579 },
  { name: 'Riyadh, Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
  { name: 'Cairo, Egypt', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Jerusalem (Al-Quds)', latitude: 31.7683, longitude: 35.2137 },
  { name: 'Istanbul, Türkiye', latitude: 41.0082, longitude: 28.9784 },
  { name: 'London, UK', latitude: 51.5072, longitude: -0.1276 },
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.006 },
  { name: 'Jakarta, Indonesia', latitude: -6.2088, longitude: 106.8456 }
];

export default function LocationPicker() {
  const { t } = useTranslation();
  const { location, setLocation } = useAppLocation();
  const [isLocating, setIsLocating] = useState(false);

  const center = useMemo<[number, number]>(() => [location.latitude, location.longitude], [location]);
  const timeZone = useMemo(
    () => getTimeZoneForLocation(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );

  const pick = useCallback(
    (lat: number, lng: number) => {
      const next: AppLocation = {
        name: 'Custom',
        latitude: clamp(lat, -90, 90),
        longitude: clamp(lng, -180, 180)
      };
      setLocation(next);
    },
    [setLocation]
  );

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        pick(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 }
    );
  }, [pick]);

  return (
    <section className="card">
      <div className="card-header flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="card-title">{t('location.title')}</div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="control-sm min-w-0 flex-1 sm:w-56 sm:flex-none"
            value={location.name}
            onChange={(e) => {
              const v = e.target.value;
              const preset = PRESET_LOCATIONS.find((p) => p.name === v);
              if (preset) setLocation(preset);
            }}
            aria-label="Preset location"
          >
            {PRESET_LOCATIONS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn-sm whitespace-nowrap"
            onClick={useMyLocation}
            disabled={isLocating}
          >
            {t('location.useMyLocation')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <div className="text-sm">
          <div className="text-xs text-slate-600">{t('location.locationUsed')}</div>
          <div className="mt-1 font-medium">
            {location.name} ({formatCoord(location.latitude)}, {formatCoord(location.longitude)})
          </div>

          <div className="mt-1 text-xs text-slate-600">
            {t('location.timezone')}: {timeZone}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-xs text-slate-700">
              {t('location.latitude')}
              <input
                className="control mt-1"
                inputMode="decimal"
                value={formatCoord(location.latitude)}
                onChange={(e) => pick(Number(e.target.value), location.longitude)}
              />
            </label>
            <label className="text-xs text-slate-700">
              {t('location.longitude')}
              <input
                className="control mt-1"
                inputMode="decimal"
                value={formatCoord(location.longitude)}
                onChange={(e) => pick(location.latitude, Number(e.target.value))}
              />
            </label>
          </div>

          <div className="mt-2 text-xs text-slate-600">{t('location.pickOnMap')}</div>
        </div>

        <div className="relative z-0 h-64 overflow-hidden rounded-md border border-slate-200">
          <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={center} />
            <MapClickHandler onPick={pick} />
            <Marker position={center} />
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
