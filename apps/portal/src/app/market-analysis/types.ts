export type MarketProperty = {
  id: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  distanceToCityCenter: number;
  schoolRating: number;
  price: number;
};

export type SortKey =
| "id"
| "squareFootage"
| "bedrooms"
| "yearBuilt"
| "schoolRating"
| "price";
