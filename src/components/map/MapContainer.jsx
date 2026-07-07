import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMap } from "../../hooks/useMapContext";
import { getCatImagePreview } from "../../services/storage";
import styles from "./MapContainer.module.css";

const DEFAULT_CENTER = [20, 35];
const DEFAULT_ZOOM = 2;

const getCoordinateKey = (cat) => {
  const lat = Number(cat.lat);
  const lng = Number(cat.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
};

const getMarkerOffset = (index, total) => {
  if (total <= 1) return [0, 0];

  const radius = total <= 4 ? 20 : 28;
  const angle = (2 * Math.PI * index) / total;

  return [
    Math.round(Math.cos(angle) * radius),
    Math.round(Math.sin(angle) * radius),
  ];
};

const MapContainer = ({ cats = [], onSelectCat }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const resizeObserverRef = useRef(null);

  const { setMapInstance } = useMap();


  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "bottom-right"
    );

    map.once("load", () => {
      map.resize();
    });

    resizeObserverRef.current = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserverRef.current.observe(mapContainerRef.current);

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      resizeObserverRef.current?.disconnect();

      markersRef.current.forEach((marker) => marker.remove());

      map.remove();

      mapRef.current = null;
    };
  }, [setMapInstance]);


  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();

    const grouped = cats.reduce((acc, cat) => {
      const key = getCoordinateKey(cat);

      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(cat);

      return acc;
    }, {});

    Object.values(grouped).forEach((group) => {
      group.forEach((cat, index) => {
        const lat = Number(cat.lat);
        const lng = Number(cat.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        bounds.extend([lng, lat]);

        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = styles.catMarker;

        markerElement.title = cat.name || "Cat";
        markerElement.setAttribute(
          "aria-label",
          cat.name || "Cat"
        );

        const img = document.createElement("img");

        img.loading = "lazy";
        img.alt = cat.name || "Cat";

        img.src = cat.profileImageId
          ? getCatImagePreview(cat.profileImageId)
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              cat.name || "Cat"
            )}&background=FEE4B8&color=000000`;

        img.onerror = () => {
          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            cat.name || "Cat"
          )}&background=FEE4B8&color=000000`;
        };

        markerElement.appendChild(img);

        markerElement.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (onSelectCat) {
            onSelectCat(cat);
          }
        };

        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markersRef.current.push(marker);
      });
    });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, {
        padding: 120,
        maxZoom: 8,
        duration: 1000,
      });
    }
  }, [cats, onSelectCat]);

  return (
    <div
      ref={mapContainerRef}
      className={styles.mapWrapper}
    />
  );
};

export default MapContainer;