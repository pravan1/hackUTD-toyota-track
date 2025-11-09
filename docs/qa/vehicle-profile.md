# Vehicle Profile Quiz QA Checklist

Use this guide to validate the psychographic quiz, profile storage, and recommendation experience end-to-end.

## Prerequisites
- Backend running with MongoDB connection (`npm run dev` in `backend/`).
- Frontend running (`npm start` in `frontend/`).
- Auth0 test user available.
- `GEMINI_API_KEY` configured in `backend/.env`. When absent, FRQ insights are skipped but flow still works.
- Vehicle collection seeded with `npm run seed:vehicles` so showcase trims exist.

## Scenario 1 – Fresh User Completes Quiz
1. Authenticate with a user that has no existing preferences.
2. Navigate to `My Profile → Quiz`.
3. Answer every MCQ; ensure Next button is disabled until an option is selected.
4. Enter ≥ 20 characters in both FRQs. Verify inline validation message appears for shorter answers.
5. Submit on the final step.
   - Expect loading state text “Scoring your matches…”.
   - Expect navigation to results view upon success.
6. Confirm “Best Match” card is the RAV4 Hybrid XSE (if profile favors family/eco) or a logical alternative when answers vary.
7. Confirm two “Great Alternative” cards render.
8. Expand a recommendation and verify the reason bullets align with quiz answers (e.g., AWD callout when selecting outdoor/off-road).

## Scenario 2 – Returning User Revisits Quiz Results
1. Refresh the browser or sign out/in.
2. Navigate directly to `/app/quiz-results`.
   - Expect API fetch to rehydrate profile without re-running quiz.
   - Verify profile snapshot and story signals display previously entered data.
3. Open vehicle detail for the top match and confirm the reason panel reflects new profile structure (no runtime errors).

## Scenario 3 – Gemini Insight Handling
1. Temporarily remove or comment out `GEMINI_API_KEY` in `backend/.env`.
2. Repeat Scenario 1.
   - Confirm submission still succeeds.
   - Validate “Story Signals” section shows `—` for Gemini-derived fields while FRQ text is still visible.
3. Restore `GEMINI_API_KEY`, restart backend, and confirm insights populate again.

## Scenario 4 – Data Integrity
1. In MongoDB, inspect the `preferences` collection:
   - `vehicleProfile` contains normalized quiz data.
   - `frqResponses` holds raw text.
   - `geminiProfile` holds LLM-parsed structure when key present.
   - `lastRecommendations` stores the scored lineup (ids populated when seeded vehicles exist).
2. Ensure `Vehicle` collection contains the five showcase trims (`Camry XLE`, `Corolla Cross XLE AWD`, `RAV4 Hybrid XSE`, `Tacoma TRD Off-Road`, `bZ4X Limited AWD`).

## Regression Checks
- Explore page filters still function (no console errors).
- Chatbot renders quick suggestions tailored to new profile fields.
- Manual API test: `GET /api/preferences/vehicle-profile` returns stored profile without requiring quiz resubmission.

Document any deviations, capture screenshots, and raise issues for unexpected behavior.


