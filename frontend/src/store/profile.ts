import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  VehicleFuelType,
  VehicleBodyStyle
} from '../types/vehicle';

export type DecisionStyle = 'lease' | 'finance' | 'undecided';
export type LifestyleTag = 'commuter' | 'family' | 'adventure' | 'eco' | 'tech';
export type CommuteIntensity = 'low' | 'medium' | 'high';
export type FuelPreference = VehicleFuelType | 'any';
export type BodyStylePreference = VehicleBodyStyle | 'any';

export interface UserProfile {
  budgetMonthly: number;
  preferredFuelType: FuelPreference;
  preferredBodyStyle: BodyStylePreference;
  commuteIntensity: CommuteIntensity;
  lifestyleTags: LifestyleTag[];
  decisionStyle: DecisionStyle;
  completed: boolean;
  completedAt?: Date;
}

export interface PreferenceDTO {
  budgetMin?: number;
  budgetMax?: number;
  fuelTypes?: VehicleFuelType[];
  bodyStyles?: VehicleBodyStyle[];
  seatCountMin?: number;
  primaryUseCases?: string[];
}

interface ProfileStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  completeProfile: () => void;
  toPreferencePayload: () => PreferenceDTO;
}

const defaultProfile: UserProfile = {
  budgetMonthly: 400,
  preferredFuelType: 'any',
  preferredBodyStyle: 'any',
  commuteIntensity: 'medium',
  lifestyleTags: [],
  decisionStyle: 'undecided',
  completed: false
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates }
        })),

      resetProfile: () =>
        set({
          profile: defaultProfile
        }),

      completeProfile: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            completed: true,
            completedAt: new Date()
          }
        })),

      toPreferencePayload: () => {
        const profile = get().profile;
        const budgetMonthly = profile.budgetMonthly;
        const budgetMax = budgetMonthly ? budgetMonthly * 60 : undefined;
        const budgetMin = budgetMax ? Math.max(budgetMax - 15000, 0) : undefined;

        const fuelTypes =
          profile.preferredFuelType === 'any'
            ? undefined
            : [profile.preferredFuelType];
        const bodyStyles =
          profile.preferredBodyStyle === 'any'
            ? undefined
            : [profile.preferredBodyStyle];

        const primaryUseCases =
          profile.lifestyleTags.length > 0
            ? profile.lifestyleTags.map((tag) => {
                switch (tag) {
                  case 'commuter':
                    return 'commuting';
                  case 'family':
                    return 'family';
                  case 'adventure':
                    return 'off-road';
                  case 'eco':
                    return 'eco';
                  case 'tech':
                    return 'technology';
                  default:
                    return tag;
                }
              })
            : undefined;

        return {
          budgetMin,
          budgetMax,
          fuelTypes: fuelTypes as VehicleFuelType[] | undefined,
          bodyStyles: bodyStyles as VehicleBodyStyle[] | undefined,
          seatCountMin: profile.lifestyleTags.includes('family') ? 5 : undefined,
          primaryUseCases
        };
      }
    }),
    {
      name: 'toyota-nexus-profile'
    }
  )
);
