import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import {
  useProfileStore,
  LifestyleTag,
  CommuteIntensity,
  DecisionStyle
} from '../store/profile';
import Hero from '../components/layout/Hero';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Slider from '../components/ui/Slider';
import { formatCurrency } from '../lib/finance';
import { saveMyPreferences } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_STEPS = 6;

export default function ProfileQuiz() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { profile, updateProfile, completeProfile, toPreferencePayload } =
    useProfileStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    budgetMonthly: profile.budgetMonthly,
    preferredFuelType: profile.preferredFuelType,
    preferredBodyStyle: profile.preferredBodyStyle,
    commuteIntensity: profile.commuteIntensity,
    lifestyleTags: profile.lifestyleTags,
    decisionStyle: profile.decisionStyle
  });

  const updateFormData = <K extends keyof typeof formData>(
    key: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLifestyleTag = (tag: LifestyleTag) => {
    const tags = formData.lifestyleTags.includes(tag)
      ? formData.lifestyleTags.filter((t) => t !== tag)
      : [...formData.lifestyleTags, tag];
    updateFormData('lifestyleTags', tags);
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        setSaving(true);
        setError(null);
        updateProfile(formData);
        completeProfile();
        const token = await getAccessTokenSilently();
        const payload = toPreferencePayload();
        await saveMyPreferences(token, payload);
        navigate('/app/quiz-results');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to save preferences. Please try again.'
        );
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div>
      <Hero
        title="Find Your Perfect Match"
        subtitle="Answer a few questions to get personalized vehicle recommendations"
        compact
      />

      <section className="py-12 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-toyota-black">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-sm text-toyota-gray-dark">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 bg-toyota-gray-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-toyota-red"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <Card padding="lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      What's your target monthly payment?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      This helps us recommend vehicles within your budget
                    </p>
                    <Slider
                      min={200}
                      max={1000}
                      step={50}
                      value={formData.budgetMonthly}
                      onChange={(e) =>
                        updateFormData('budgetMonthly', Number(e.target.value))
                      }
                      formatValue={(v) => `${formatCurrency(v)}/mo`}
                      showValue
                    />
                    <div className="mt-4 text-sm text-toyota-gray-dark">
                      Selected: {formatCurrency(formData.budgetMonthly)}/month
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      Preferred fuel type?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Choose your preferred powertrain or select "Any"
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          value: 'any' as const,
                          label: 'Any',
                          desc: 'Show me all options'
                        },
                        {
                          value: 'Gasoline' as const,
                          label: 'Gasoline',
                          desc: 'Balanced efficiency and power'
                        },
                        {
                          value: 'Hybrid' as const,
                          label: 'Hybrid',
                          desc: 'Maximum mpg with Toyota Hybrid Synergy Drive'
                        },
                        {
                          value: 'EV' as const,
                          label: 'Electric',
                          desc: 'Zero emissions driving'
                        }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateFormData('preferredFuelType', option.value)
                          }
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.preferredFuelType === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover:border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-toyota-black">
                                {option.label}
                              </div>
                              <div className="text-sm text-toyota-gray-dark">
                                {option.desc}
                              </div>
                            </div>
                            {formData.preferredFuelType === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      Preferred body style?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      What type of vehicle fits your lifestyle?
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: 'any' as const,
                          label: 'Any',
                          desc: 'No preference'
                        },
                        {
                          value: 'Sedan' as const,
                          label: 'Sedan',
                          desc: 'Comfortable & efficient'
                        },
                        {
                          value: 'SUV' as const,
                          label: 'SUV',
                          desc: 'Spacious & versatile'
                        },
                        {
                          value: 'Truck' as const,
                          label: 'Truck',
                          desc: 'Powerful & capable'
                        },
                        {
                          value: 'Minivan' as const,
                          label: 'Minivan',
                          desc: 'Maximum space'
                        },
                        {
                          value: 'Hatchback' as const,
                          label: 'Hatchback',
                          desc: 'Sporty & practical'
                        }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateFormData('preferredBodyStyle', option.value)
                          }
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.preferredBodyStyle === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover-border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-semibold text-toyota-black">
                              {option.label}
                            </div>
                            {formData.preferredBodyStyle === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                          <div className="text-xs text-toyota-gray-dark">
                            {option.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      How much do you drive?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Understanding your driving habits helps us recommend the
                      right vehicle
                    </p>
                    <div className="space-y-4">
                      {[
                        {
                          value: 'low' as CommuteIntensity,
                          label: 'Light Driver',
                          desc: 'Less than 5,000 miles/year'
                        },
                        {
                          value: 'medium' as CommuteIntensity,
                          label: 'Average Driver',
                          desc: '5,000-15,000 miles/year'
                        },
                        {
                          value: 'high' as CommuteIntensity,
                          label: 'Heavy Driver',
                          desc: 'More than 15,000 miles/year'
                        }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateFormData('commuteIntensity', option.value)
                          }
                          className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                            formData.commuteIntensity === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover-border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-toyota-black">
                                {option.label}
                              </div>
                              <div className="text-sm text-toyota-gray-dark">
                                {option.desc}
                              </div>
                            </div>
                            {formData.commuteIntensity === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      What matters most to you?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Select all that apply (you can choose multiple)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: 'commuter' as LifestyleTag,
                          label: 'Daily Commuter',
                          desc: 'Reliable for work'
                        },
                        {
                          value: 'family' as LifestyleTag,
                          label: 'Family',
                          desc: 'Space & safety'
                        },
                        {
                          value: 'adventure' as LifestyleTag,
                          label: 'Adventure',
                          desc: 'Off-road ready'
                        },
                        {
                          value: 'eco' as LifestyleTag,
                          label: 'Eco-Friendly',
                          desc: 'Low emissions'
                        },
                        {
                          value: 'tech' as LifestyleTag,
                          label: 'Technology',
                          desc: 'Latest features'
                        }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleLifestyleTag(option.value)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.lifestyleTags.includes(option.value)
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover-border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-semibold text-toyota-black">
                              {option.label}
                            </div>
                            {formData.lifestyleTags.includes(option.value) && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                          <div className="text-xs text-toyota-gray-dark">
                            {option.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      How do you prefer to pay?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      This helps us show you the most relevant payment options
                    </p>
                    <div className="space-y-4">
                      {[
                        {
                          value: 'finance' as DecisionStyle,
                          label: 'Finance to Own',
                          desc: 'Build equity and own the vehicle'
                        },
                        {
                          value: 'lease' as DecisionStyle,
                          label: 'Lease',
                          desc: 'Lower payments, newer vehicle every few years'
                        },
                        {
                          value: 'undecided' as DecisionStyle,
                          label: "I'm Not Sure",
                          desc: 'Show me both options'
                        }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            updateFormData('decisionStyle', option.value)
                          }
                          className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                            formData.decisionStyle === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover-border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-toyota-black">
                                {option.label}
                              </div>
                              <div className="text-sm text-toyota-gray-dark">
                                {option.desc}
                              </div>
                            </div>
                            {formData.decisionStyle === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || saving}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={saving}>
                {currentStep === TOTAL_STEPS ? (
                  <>
                    {saving ? 'Saving...' : 'Complete Quiz'}
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

