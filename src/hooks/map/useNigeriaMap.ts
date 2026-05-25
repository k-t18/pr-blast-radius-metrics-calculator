import { useEffect, useMemo, useRef } from 'react';
import type { PathOptions } from 'leaflet';
import type * as L from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import { Colors } from '../../styles/tokens/colors';
import type { RegionReachData } from '../../components/charts/NigeriaMap';

interface StateFeatureProperties {
    admin1Name?: string;
    admin1RefN?: string;
    state?: string;
    NAME?: string;
    name?: string;
}

export interface StateFeature extends Feature<Geometry, StateFeatureProperties> {}

// Normalize state names for consistent matching
const normalizeStateName = (name: string): string => {
    if (!name) return '';
    return name.toLowerCase().trim().replaceAll(/\s+/g, '');
};

// Color scale based on values
const getColorByValue = (value: number): string => {
    if (value > 15_000) return Colors.brand[700]; // Darkest purple
    if (value >= 11_000 && value <= 15_000) return Colors.brand[600]; // Medium-dark purple
    if (value >= 5_000 && value < 11_000) return Colors.brand[400]; // Medium-light purple
    if (value > 0 && value < 5_000) return Colors.brand[200]; // Lightest purple
    return Colors.gray[600]; // Grey for no data
};

const getStateName = (feature: StateFeature): string => {
    return (
        feature.properties?.admin1Name ||
        feature.properties?.admin1RefN ||
        feature.properties?.state ||
        feature.properties?.NAME ||
        feature.properties?.name ||
        ''
    );
};

interface UseNigeriaMapParameters {
    data: RegionReachData[];
    isLoading: boolean;
    error: unknown;
    geoJsonLayerRef: React.RefObject<L.GeoJSON | null>;
}

export function useNigeriaMap({ data, isLoading, error, geoJsonLayerRef }: UseNigeriaMapParameters) {
    // Create a map of state names to values
    const valueMap = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach(item => {
            if (!item.state) return;
            const key = normalizeStateName(item.state);
            const value = item.value ?? 0;
            if (key) map.set(key, value);
        });
        return map;
    }, [data]);

    // Create a unique key for GeoJSON that changes when data changes
    const geoJsonKey = useMemo(() => {
        if (data.length === 0) return 'geojson-empty';
        const sorted = [...data].sort((a, b) => a.state.localeCompare(b.state));
        const hash = sorted.map(d => `${normalizeStateName(d.state)}:${d.value ?? 0}`).join('|');
        return `geojson-${data.length}-${hash}`;
    }, [data]);

    // Use a ref to always access the latest valueMap in event handlers
    const valueMapReference = useRef(valueMap);
    useEffect(() => {
        valueMapReference.current = valueMap;
    }, [valueMap]);

    const getValueForState = (stateName: string): number => {
        if (!stateName) return 0;
        const normalized = normalizeStateName(stateName);
        return valueMapReference.current.get(normalized) ?? 0;
    };

    // Style function for GeoJSON features
    const stateStyle = useMemo(() => {
        return (feature?: StateFeature): PathOptions => {
            if (!feature) {
                return {
                    fillColor: Colors.gray[600],
                    fillOpacity: 1,
                    color: Colors.text.white,
                    weight: 1,
                    opacity: 1,
                };
            }

            const stateName = getStateName(feature);

            // When loading or error, show all states as grey without highlights
            if (isLoading || error) {
                return {
                    fillColor: Colors.gray[600],
                    fillOpacity: 1,
                    color: Colors.text.white,
                    weight: 1,
                    opacity: 1,
                };
            }

            const normalized = normalizeStateName(stateName);
            const value = valueMapReference.current.get(normalized) ?? 0;
            const fillColor = getColorByValue(value);
            const isMarked = value > 0;

            return {
                fillColor,
                fillOpacity: 1,
                color: isMarked ? Colors.brand[500] : Colors.text.white,
                weight: isMarked ? 3 : 1,
                opacity: 1,
            };
        };
    }, [valueMap, isLoading, error]);

    // Manually refresh all layer styles when data changes
    useEffect(() => {
        if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.eachLayer((layer: L.Layer) => {
                const pathLayer = layer as L.Path & { feature?: StateFeature };
                if (!pathLayer.feature) return;

                const newStyle = stateStyle(pathLayer.feature);
                pathLayer.setStyle(newStyle);

                // Update popup if it's open
                if (pathLayer.getPopup()?.isOpen()) {
                    const stateName = getStateName(pathLayer.feature);
                    const value = getValueForState(stateName);
                    const popupContent = `
                        <div style="text-align: center; padding: 8px; font-family: sans-serif;">
                            <div style="font-weight: 600; font-size: 14px; color: #333;">${stateName}</div>
                            <div style="font-size: 12px; color: #666;">${value.toLocaleString()}</div>
                        </div>
                    `;
                    pathLayer.getPopup()?.setContent(popupContent);
                }
            });
        }
    }, [data, stateStyle, geoJsonLayerRef]);

    // Event handlers for GeoJSON
    const onEachFeature = (feature: StateFeature, layer: L.Layer) => {
        const stateName = getStateName(feature);

        layer.on({
            mouseover: (mouseEvent: L.LeafletMouseEvent) => {
                const targetLayer = mouseEvent.target;
                const currentValue = getValueForState(stateName);

                const popupContent = `
                    <div style="text-align: center; padding: 8px;">
                        <div style="font-weight: 600; font-size: 14px; color: ${Colors.text.charcoal}; margin-bottom: 4px;">${stateName}</div>
                        <div style="font-size: 12px; color: ${Colors.gray[700]};">${currentValue.toLocaleString()}</div>
                    </div>
                `;
                targetLayer.bindPopup(popupContent).openPopup();
            },
            mouseout: (mouseEvent: L.LeafletMouseEvent) => {
                const targetLayer = mouseEvent.target;
                targetLayer.closePopup();
            },
        });
    };

    return {
        geoJsonKey,
        stateStyle,
        onEachFeature,
    };
}
