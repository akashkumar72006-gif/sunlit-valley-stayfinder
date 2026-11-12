import { useEffect, useRef } from "react";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

type LocationHighlight = {
  id: string;
  name: string;
  coordinates: readonly [number, number];
};

type InteractiveLocationMapProps = {
  highlights: readonly LocationHighlight[];
  activeHighlightId: string;
  onSelect: (id: string) => void;
};

const markerStyle = {
  radius: 7,
  color: "#f8f4e9",
  weight: 2,
  fillColor: "#3f6556",
  fillOpacity: 1,
};

const activeMarkerStyle = {
  radius: 10,
  color: "#f8f4e9",
  weight: 3,
  fillColor: "#b68745",
  fillOpacity: 1,
};

export function InteractiveLocationMap({ highlights, activeHighlightId, onSelect }: InteractiveLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, CircleMarker>>({});
  const onSelectRef = useRef(onSelect);
  const activeHighlightIdRef = useRef(activeHighlightId);
  onSelectRef.current = onSelect;
  activeHighlightIdRef.current = activeHighlightId;

  useEffect(() => {
    let disposed = false;

    const initializeMap = async () => {
      const leaflet = await import("leaflet");
      if (disposed || !containerRef.current) return;

      const L = leaflet.default;
      const map = L.map(containerRef.current, {
        center: highlights[0].coordinates,
        zoom: 12,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const markers: Record<string, CircleMarker> = {};
      highlights.forEach((highlight) => {
        const marker = L.circleMarker(highlight.coordinates, highlight.id === activeHighlightIdRef.current ? activeMarkerStyle : markerStyle)
          .addTo(map)
          .bindTooltip(highlight.name, { direction: "top", offset: [0, -8] });
        marker.on("click", () => onSelectRef.current(highlight.id));
        markers[highlight.id] = marker;
      });

      mapRef.current = map;
      markersRef.current = markers;
      window.setTimeout(() => map.invalidateSize(), 0);
    };

    void initializeMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [highlights]);

  useEffect(() => {
    const map = mapRef.current;
    const activeHighlight = highlights.find((highlight) => highlight.id === activeHighlightId);
    if (!map || !activeHighlight) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setStyle(id === activeHighlightId ? activeMarkerStyle : markerStyle);
    });
    map.flyTo(activeHighlight.coordinates, 14, { duration: 0.8 });
  }, [activeHighlightId, highlights]);

  return <div ref={containerRef} className="location-map h-full w-full" aria-label="Interactive map of Saree Village and nearby attractions" />;
}
