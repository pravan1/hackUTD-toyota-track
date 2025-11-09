import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

import Hero from '../components/layout/Hero';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  useProfileStore,
  McqOption,
  McqQuestion,
  FrqResponses
} from '../store/profile';
import { submitVehicleProfile } from '../lib/api';

type McqOptionConfig = {
  value: McqOption;
  title: string;
  description: string;
};

type McqQuestionConfig = {
  id: McqQuestion;
  title: string;
  subtitle?: string;
  options: McqOptionConfig[];
};

type FrqField = keyof FrqResponses;

type FrqPromptConfig = {
  field: FrqField;
  title: string;
  prompt: string;
  helper?: string;
  placeholder?: string;
};

const MCQ_QUESTIONS: McqQuestionConfig[] = [
  {
    id: 'q1',
    title: "What does your typical week look like?",
    subtitle: '(Primary use case)',
    options: [
      {
        value: 'A',
        title: 'Mostly solo city commuting with occasional highway trips',
        description: 'You need something easy to live with in tight urban spaces.'
      },
      {
        value: 'B',
        title: 'Hauling kids, friends, and cargo around constantly',
        description: 'Space and family flexibility matter every single day.'
      },
      {
        value: 'C',
        title: 'Trail runs, camping, and weekend adventures off pavement',
        description: 'Capability and durability come first for your lifestyle.'
      },
      {
        value: 'D',
        title: 'Urban lifestyle with short trips, you care about emissions & future tech',
        description: 'You want cutting-edge tech that keeps your footprint low.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'How do you feel about fuel & the environment?',
    options: [
      {
        value: 'A',
        title: 'I just want lower fuel costs, gas is fine',
        description: 'Efficiency matters but you are comfortable with gasoline.'
      },
      {
        value: 'B',
        title: 'I’d strongly prefer a hybrid if possible',
        description: 'You’re focused on higher MPG and fewer gas station stops.'
      },
      {
        value: 'C',
        title: 'I really want full EV if it fits my life',
        description: 'Zero-emission driving and charging at home excite you.'
      },
      {
        value: 'D',
        title: 'I don’t care much, performance & capability matter more',
        description: 'You’re prioritizing strength and confidence over fuel type.'
      }
    ]
  },
  {
    id: 'q3',
    title: 'What kind of roads do you see most often?',
    options: [
      {
        value: 'A',
        title: 'Dense city / stop-and-go, tight parking',
        description: 'Maneuverability and compact size matter most.'
      },
      {
        value: 'B',
        title: 'Suburbs & highway mix, some road trips',
        description: 'You need comfort and stability at speed for longer drives.'
      },
      {
        value: 'C',
        title: 'Dirt, gravel, trails, and maybe a bit of rock crawling',
        description: 'Traction and toughness are non-negotiable.'
      },
      {
        value: 'D',
        title: 'Mostly highway, long distances at once',
        description: 'Range and cruising comfort are top of mind.'
      }
    ]
  },
  {
    id: 'q4',
    title: 'Who usually rides with you?',
    options: [
      {
        value: 'A',
        title: 'Just me most days',
        description: 'Two seats are plenty and you pack light.'
      },
      {
        value: 'B',
        title: 'Me + one passenger usually',
        description: 'Room for three with modest cargo gets it done.'
      },
      {
        value: 'C',
        title: 'A full family/friend group most weekends',
        description: 'Three rows or roomy second rows keep everyone happy.'
      },
      {
        value: 'D',
        title: 'Varies, but I often fold seats for cargo',
        description: 'Flexible seating matters for your gear-heavy runs.'
      }
    ]
  },
  {
    id: 'q5',
    title: 'What’s more “you”?',
    options: [
      {
        value: 'A',
        title: 'Sleek, comfortable, and refined',
        description: 'Premium touches and serenity make the drive.'
      },
      {
        value: 'B',
        title: 'Versatile and practical — does a bit of everything',
        description: 'Balanced utility for family, errands, and adventures.'
      },
      {
        value: 'C',
        title: 'Rugged, bold, and ready for mud',
        description: 'Off-road credibility and presence are key.'
      },
      {
        value: 'D',
        title: 'Futuristic and tech-forward',
        description: 'You want the latest screens, sensors, and EV swagger.'
      }
    ]
  },
  {
    id: 'q6',
    title: 'How sensitive are you to your monthly payment?',
    options: [
      {
        value: 'A',
        title: 'Very sensitive – I need to keep it low',
        description: 'Affordability drives every choice you make.'
      },
      {
        value: 'B',
        title: 'I’m cost-conscious but flexible if it really fits my life',
        description: 'Value matters, but the right fit can justify a bit more.'
      },
      {
        value: 'C',
        title: 'I care more about getting exactly what I want than saving every dollar',
        description: 'You’re ready to invest in the perfect match.'
      }
    ]
  }
];

const FRQ_PROMPTS: FrqPromptConfig[] = [
  {
    field: 'lifeChapter',
    title: 'Life chapter',
    prompt:
      'In your own words, describe the “next chapter” of your life. What are you preparing for in the next 3–5 years, and what role does a vehicle play in that story?',
    helper: 'Share the milestones ahead and how this Toyota fits alongside them.',
    placeholder: 'Example: “We’re about to have our second child and need space for car seats...”'
  },
  {
    field: 'stressNonNegotiables',
    title: 'Stress & non-negotiables',
    prompt:
      'What stresses you out the most about car ownership, and what are 1–2 non-negotiables for your next car?',
    helper: 'Think about payments, reliability, parking, charging, long trips, or anything else that keeps you up at night.',
    placeholder: 'Example: “Parking in the city is brutal, so compact size is a must...”'
  }
];

const TOTAL_STEPS = MCQ_QUESTIONS.length + FRQ_PROMPTS.length;
const MIN_FRQ_LENGTH = 20;

const buildMcqResponsePayload = (
  answers: Record<McqQuestion, McqOption | null>
) => {
  return (Object.keys(answers) as McqQuestion[]).reduce(
    (acc, key) => {
      const response = answers[key];
      if (!response) {
        throw new Error(`Missing response for ${key}`);
      }
      acc[key] = response;
      return acc;
    },
    {} as Record<McqQuestion, McqOption>
  );
};

export default function ProfileQuiz() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const {
    answers,
    setMcqAnswer,
    setFrqResponse,
    setQuizResult
  } = useProfileStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const onLastStep = currentStep === TOTAL_STEPS - 1;
  const isMcqStep = currentStep < MCQ_QUESTIONS.length;
  const frqIndex = currentStep - MCQ_QUESTIONS.length;

  const validateStep = () => {
    if (isMcqStep) {
      const question = MCQ_QUESTIONS[currentStep];
      const response = answers.mcq[question.id];
      if (!response) {
        setError('Please choose the option that fits you best before continuing.');
        return false;
      }
      return true;
    }

    const prompt = FRQ_PROMPTS[frqIndex];
    const value = answers.frq[prompt.field];
    if (!value || value.trim().length < MIN_FRQ_LENGTH) {
      setError('Share a bit more detail so we can tailor the match (aim for at least 20 characters).');
      return false;
    }

    return true;
  };

  const handleBack = () => {
    if (currentStep === 0 || submitting) return;
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = await getAccessTokenSilently();
      const payload = {
        mcqResponses: buildMcqResponsePayload(answers.mcq),
        frqResponses: answers.frq
      };
      const result = await submitVehicleProfile(token, payload);
      setQuizResult(result);
      navigate('/app/quiz-results');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'We could not save your quiz right now. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (onLastStep) {
      await handleSubmit();
      return;
    }

    setError(null);
    setCurrentStep((prev) => prev + 1);
  };

  const renderCurrentStep = () => {
    if (isMcqStep) {
      const question = MCQ_QUESTIONS[currentStep];
      const selected = answers.mcq[question.id];

      return (
        <div>
          <h2 className="text-2xl font-semibold text-toyota-black mb-2">
            {question.title}
          </h2>
          {question.subtitle && (
            <p className="text-sm text-toyota-gray-dark mb-6">
              {question.subtitle}
            </p>
          )}
          <div className="space-y-4">
            {question.options.map((option) => {
              const active = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (error) setError(null);
                    setMcqAnswer(question.id, option.value);
                  }}
                  className={`w-full text-left p-5 border-2 rounded-xl transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-toyota-red/40 ${
                    active
                      ? 'border-toyota-red bg-toyota-red/5'
                      : 'border-gray-200 hover:border-toyota-red/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold ${
                        active
                          ? 'border-toyota-red text-toyota-red'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {option.value}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-toyota-black">
                          {option.title}
                        </h3>
                        {active && <Check className="h-5 w-5 text-toyota-red" />}
                      </div>
                      <p className="mt-1 text-sm text-toyota-gray-dark leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    const prompt = FRQ_PROMPTS[frqIndex];
    const value = answers.frq[prompt.field];

    return (
      <div>
        <h2 className="text-2xl font-semibold text-toyota-black mb-3">
          {prompt.title}
        </h2>
        <p className="text-toyota-gray-dark mb-4 leading-relaxed">
          {prompt.prompt}
        </p>
        {prompt.helper && (
          <p className="text-sm text-toyota-gray-dark/80 mb-6">
            {prompt.helper}
          </p>
        )}
        <textarea
          value={value}
          onChange={(event) => {
            if (error) setError(null);
            setFrqResponse(prompt.field, event.target.value);
          }}
          rows={8}
          placeholder={prompt.placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base leading-relaxed text-toyota-black shadow-sm transition focus:border-toyota-red focus:outline-none focus:ring-2 focus:ring-toyota-red/40"
        />
        <div className="mt-2 text-right text-xs text-toyota-gray-dark">
          {value.length} characters
        </div>
      </div>
    );
  };

  return (
    <div>
      <Hero
        title="Design Your Toyota Match"
        subtitle="Answer six quick choices plus two story questions. We’ll stitch it all together into your personal vehicle profile."
        compact
      />

      <section className="py-12 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-toyota-black">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </span>
              <span className="text-sm text-toyota-gray-dark">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-toyota-gray-light">
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
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || submitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={submitting}>
                {onLastStep ? (
                  <>
                    {submitting ? 'Scoring your matches...' : 'See my matches'}
                    <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
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

