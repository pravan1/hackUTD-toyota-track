export type VehicleFuelType = 'Gasoline' | 'Hybrid' | 'EV';
export type VehicleBodyStyle =
  | 'Sedan'
  | 'SUV'
  | 'Truck'
  | 'Hatchback'
  | 'Coupe'
  | 'Minivan'
  | 'Wagon';

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  fuelType: VehicleFuelType;
  bodyStyle: VehicleBodyStyle;
  transmission: string;
  drivetrain: string;
  mpgCity: number;
  mpgHighway: number;
  seats: number;
  imageUrl: string;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleListResponse {
  data: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

