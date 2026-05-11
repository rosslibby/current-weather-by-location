export type LocationName = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

export type PostalCode = {
  zip: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
};
