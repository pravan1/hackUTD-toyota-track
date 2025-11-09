import type {
  VehicleBodyStyle,
  VehicleFuelType
} from '../types/vehicle';
import type { VehicleQueryParams } from './api';

export interface FilterOptions {
  fuelType: VehicleFuelType | 'any';
  bodyStyle: VehicleBodyStyle | 'any';
  priceMin: number;
  priceMax: number;
  seats: number;
  searchQuery: string;
}

export const defaultFilters: FilterOptions = {
  fuelType: 'any',
  bodyStyle: 'any',
  priceMin: 20000,
  priceMax: 60000,
  seats: 0,
  searchQuery: ''
};

export const mapFiltersToQuery = (
  filters: FilterOptions
): VehicleQueryParams => {
  const params: VehicleQueryParams = {
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    search: filters.searchQuery || undefined
  };

  if (filters.fuelType !== 'any') {
    params.fuelType = filters.fuelType;
  }

  if (filters.bodyStyle !== 'any') {
    params.bodyStyle = filters.bodyStyle;
  }

  if (filters.seats > 0) {
    params.seats = filters.seats;
  }

  return params;
};
