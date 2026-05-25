import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import { feature as topojsonFeature } from 'topojson-client';
import type { Topology } from 'topojson-client';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';
import nigeriaStatesTopoJson from '../../assets/nigeria_state_boundaries_xsmall.topo.json';
import { useNigeriaMap } from '../../hooks/map/useNigeriaMap';
import '../../styles/map/NigeriaMap.css';

export interface RegionReachData {
    state: string;
    value: number;
    reach?: number; // Keep for backward compatibility
}

export interface NigeriaMapProperties {
    data: RegionReachData[];
    title?: string;
    height?: number;
    isLoading?: boolean;
    error?: unknown;
}

interface StateFeatureProperties {
    admin1Name?: string;
    admin1RefN?: string;
    state?: string;
    NAME?: string;
    name?: string;
}

// Component to fit map bounds to Nigeria only
function FitBounds({ geojsonData }: { geojsonData: FeatureCollection<Geometry, StateFeatureProperties> }) {
    const map = useMap();

    useEffect(() => {
        if (geojsonData && geojsonData.features.length > 0) {
            // Calculate bounds from actual GeoJSON data
            const bounds = L.geoJSON(geojsonData).getBounds();

            // Fit bounds to Nigeria with padding
            map.fitBounds(bounds, { padding: [50, 50] });

            // Set max bounds to prevent panning outside Nigeria
            map.setMaxBounds(bounds.pad(0.1));
        }
    }, [map, geojsonData]);

    return null;
}

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message?: string }).message || 'Something went wrong');
    }
    if (typeof error === 'string') return error;
    return 'Something went wrong';
};

export default function NigeriaMap({ data, title = 'Reach by Region', height = 500, isLoading = false, error }: NigeriaMapProperties) {
    const geojsonData = useMemo(() => {
        const topo = nigeriaStatesTopoJson as unknown as Topology;
        const statesObject = topo.objects.states;
        const fc = topojsonFeature(topo, statesObject) as unknown as FeatureCollection<Geometry, StateFeatureProperties>;
        return fc;
    }, []);

    const legendItems = useMemo(
        () => [
            { label: '>15 K', color: Colors.brand[700] },
            { label: '11-15 K', color: Colors.brand[600] },
            { label: '5-10 K', color: Colors.brand[400] },
            { label: '<5 K', color: Colors.brand[200] },
        ],
        []
    );

    const geoJsonLayerReference = useRef<L.GeoJSON | null>(null);
    const { geoJsonKey, stateStyle, onEachFeature } = useNigeriaMap({
        data,
        isLoading,
        error,
        geoJsonLayerRef: geoJsonLayerReference,
    });

    return (
        <div className="nigeria-map rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg">
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            <div className="chart-container flex-1 relative" style={{ height: `${height}px` }}>
                <MapContainer
                    center={[9, 8]}
                    zoom={6}
                    minZoom={5}
                    maxZoom={8}
                    style={{ height: '100%', width: '100%', background: Colors.text.white }}
                    zoomControl
                    scrollWheelZoom
                    dragging
                    doubleClickZoom
                    boxZoom
                    keyboard
                    worldCopyJump={false}
                >
                    <GeoJSON key={geoJsonKey} data={geojsonData} ref={geoJsonLayerReference} style={stateStyle} onEachFeature={onEachFeature} />
                    <FitBounds geojsonData={geojsonData} />
                </MapContainer>

                {/* Loading/Error Message Overlay */}
                {(isLoading || !!error) && (
                    <div className="text-center">
                        {isLoading && <div className="text-gray-900 font-ubuntu text-lg">Loading map data...</div>}
                        {!!error && !isLoading && <div className="text-red-600 font-ubuntu text-lg">Error: {getErrorMessage(error)}</div>}
                    </div>
                )}
                {data.length === 0 && (
                    <div className="text-center">
                        <div className="text-gray-900 font-ubuntu text-lg">No data available</div>
                    </div>
                )}

                {/* Legend - Hide when loading or error */}
                {!isLoading && !error && (
                    <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-start gap-4 pb-2">
                        {legendItems.map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
