export interface GlobeCountry {
  id: string;
  name: string;
  flag: string;
  isoCode: string;
  lon: number;
  lat: number;
}

export interface SphericalTarget {
  phi: number;
  theta: number;
}