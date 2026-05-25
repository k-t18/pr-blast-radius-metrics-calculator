declare module 'topojson-client' {
    export interface GeometryCollection {
        type: 'GeometryCollection';
        geometries: unknown[];
    }

    export interface Topology {
        type: 'Topology';
        objects: Record<string, GeometryCollection>;
        arcs: unknown;
        bbox?: [number, number, number, number];
        transform?: unknown;
    }

    /**
     * Convert a TopoJSON object to GeoJSON.
     * We keep this typed loosely because our usage only needs FeatureCollection shape.
     */
    export function feature(topology: Topology, object: unknown): unknown;
}
