import type { Vehicle, VehicleListResponse } from '../types/vehicle';

const getEnv = (key: string) =>
  import.meta.env[key as keyof ImportMetaEnv] ??
  (window as unknown as Record<string, string | undefined>)[key];

const baseUrl =
  (getEnv('VITE_API_BASE_URL') as string | undefined) ||
  (getEnv('REACT_APP_API_BASE_URL') as string | undefined) ||
  'http://localhost:4000/api';

const buildQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(
      errorBody.message || `Request failed with status ${response.status}`
    );
    throw error;
  }

  return response.json();
};

export interface VehicleQueryParams {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  bodyStyle?: string;
  seats?: number;
  drivetrain?: string;
  search?: string;
}

export const fetchVehicles = (params: VehicleQueryParams = {}) => {
  return request<VehicleListResponse>(`/vehicles${buildQueryString(params)}`);
};

export const fetchVehicleById = (id: string) => {
  return request<Vehicle>(`/vehicles/${id}`);
};

export interface PreferencePayload {
  budgetMin?: number;
  budgetMax?: number;
  fuelTypes?: string[];
  bodyStyles?: string[];
  seatCountMin?: number;
  primaryUseCases?: string[];
}

export const fetchMyPreferences = (token: string) => {
  return request<PreferencePayload | null>('/preferences/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const saveMyPreferences = (token: string, payload: PreferencePayload) => {
  return request<PreferencePayload>('/preferences', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteMyPreferences = (token: string) => {
  return request<void>('/preferences', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export interface GeminiSummaryResponse {
  summary: string;
  vehicle: Vehicle;
}

export const getVehicleSummary = (token: string, vehicleId: string) => {
  return request<GeminiSummaryResponse>('/gemini/vehicle-summary', {
    method: 'POST',
    body: JSON.stringify({ vehicleId }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export interface GeminiRecommendationsResponse {
  recommendations: string;
  vehicles: Vehicle[];
}

export const getGeminiRecommendations = (
  token: string,
  preferenceOverrides?: PreferencePayload
) => {
  return request<GeminiRecommendationsResponse>('/gemini/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      preferenceOverrides: preferenceOverrides || {}
    }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export interface SavedVehiclePayload {
  vehicleId: string;
}

export const saveVehicleForUser = (token: string, vehicleId: string) => {
  return request<string[]>('/users/me/saved-vehicles', {
    method: 'POST',
    body: JSON.stringify({ vehicleId }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const removeSavedVehicleForUser = (token: string, vehicleId: string) => {
  return request<string[]>(`/users/me/saved-vehicles/${vehicleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const fetchCurrentUser = (token: string) => {
  return request('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

