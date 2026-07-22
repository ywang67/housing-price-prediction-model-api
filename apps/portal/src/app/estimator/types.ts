export type House = {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
};

export type FeatureRange = {
  minimum: number;
  maximum: number;
};

export type FeatureRanges = Record<keyof House, FeatureRange>;

export type EstimateHistoryItem = {
  id: string;
  house: House;
  prediction: number;
  createdAt: string;
};
