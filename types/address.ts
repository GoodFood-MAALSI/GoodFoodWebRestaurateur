export interface AddressFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    label: string;
    score: number;
    type: string;
    id: string;
  };
}
export interface AddressAPIResponse {
  features: AddressFeature[];
}