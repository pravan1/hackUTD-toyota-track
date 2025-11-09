import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Vehicle } from '../types/vehicle';

export type PrimaryUse = 'commuter' | 'family' | 'outdoor' | 'eco_urban';
export type VehicleStyle =
  | 'sedan_lux'
  | 'crossover_suv'
  | 'truck_offroad'
  | 'ev_tech';

export interface UserVehicleProfile {
  primaryUse: PrimaryUse;
  prefFuel: string[];
  ecoPriority: number;
  parkingTight: boolean;
  needsCompact: boolean;
  needs4WD: boolean;
  needsHighwayComfort?: boolean;
  offRoadPriority: number;
  longRange: boolean;
  seatNeed: number;
  cargoNeed: number;
  style: VehicleStyle;
  budgetSensitivity: number;
  lifeStage?: string;
  vehicleNeedsTags?: string[];
  financialSentiment?: string;
  keyConcerns?: string[];
}

export interface GeminiProfileInsights {
  lifeStage: string | null;
  topGoals: string[];
  vehicleNeeds: string[];
  financialSentiment: string | null;
  keyConcerns: string[];
}

export type McqOption = 'A' | 'B' | 'C' | 'D';
export type McqQuestion = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

export type McqAnswers = Record<McqQuestion, McqOption | null>;

export interface FrqResponses {
  lifeChapter: string;
  stressNonNegotiables: string;
}

export interface QuizAnswers {
  mcq: McqAnswers;
  frq: FrqResponses;
}

export interface VehicleRecommendation {
  vehicle: Vehicle;
  score: number;
  reasons: string[];
  summary: string;
  rank: number;
  badge: 'best_match' | 'great_alternative';
}

export interface QuizResultPayload {
  profile: UserVehicleProfile;
  geminiProfile: GeminiProfileInsights | null;
  frqResponses: FrqResponses;
  recommendations: VehicleRecommendation[];
}

interface ProfileStore {
  answers: QuizAnswers;
  vehicleProfile?: UserVehicleProfile;
  geminiProfile?: GeminiProfileInsights | null;
  frqResponses?: FrqResponses;
  recommendations: VehicleRecommendation[];
  completed: boolean;
  completedAt?: string;
  setMcqAnswer: (question: McqQuestion, answer: McqOption) => void;
  setFrqResponse: (field: keyof FrqResponses, value: string) => void;
  setQuizResult: (payload: QuizResultPayload) => void;
  resetQuiz: () => void;
}

const createDefaultAnswers = (): QuizAnswers => ({
  mcq: {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null
  },
  frq: {
    lifeChapter: '',
    stressNonNegotiables: ''
  }
});

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      answers: createDefaultAnswers(),
      vehicleProfile: undefined,
      geminiProfile: undefined,
      frqResponses: undefined,
      recommendations: [],
      completed: false,

      setMcqAnswer: (question, answer) =>
        set((state) => ({
          answers: {
            ...state.answers,
            mcq: {
              ...state.answers.mcq,
              [question]: answer
            }
          }
        })),

      setFrqResponse: (field, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            frq: {
              ...state.answers.frq,
              [field]: value
            }
          }
        })),

      setQuizResult: (payload) =>
        set(() => ({
          vehicleProfile: payload.profile,
          geminiProfile: payload.geminiProfile,
          frqResponses: payload.frqResponses,
          recommendations: payload.recommendations,
          completed: true,
          completedAt: new Date().toISOString()
        })),

      resetQuiz: () =>
        set(() => ({
          answers: createDefaultAnswers(),
          vehicleProfile: undefined,
          geminiProfile: undefined,
          frqResponses: undefined,
          recommendations: [],
          completed: false,
          completedAt: undefined
        }))
    }),
    {
      name: 'toyota-nexus-vehicle-profile'
    }
  )
);

