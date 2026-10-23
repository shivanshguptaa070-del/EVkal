# EVkal — IMPLEMENTATION PLAN
**Project:** EVkal · Smart EV Charging & P2P Sharing Decision-Support System
**Hackathon Problem:** #053
**Solo Developer · Phase-by-Phase · Verify Before Moving On**

Specs: [D02 Math](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D02_Data_API_Algorithm_Specification.md) · [D03 Architecture](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D03_Technical_Architecture_System_Design.md) · [D04 UI](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D04_UI_UX_Screen_Interaction_Specification.md) · [D05 Demo](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D05_Testing_Verification_Judge_Demo_Playbook.md)

---

## Skills Applied in This Plan

| Skill | Where Applied |
|---|---|
| `gsd-plan-phase` | Phase structure: tracer-first ordering, vertical slices, verification gates per phase |
| `vite-patterns` | Phase 1: `@vitejs/plugin-react-swc`, `vite-plugin-checker` for type-check, `vite-tsconfig-paths`, no barrel files, `tsc --noEmit` gate |
| `react-patterns` | Phase 3: Zustand for high-frequency store, derived state in render (no `useEffect` for derived values), `Suspense` + Error Boundaries |
| `incremental-implementation` | One atomic phase at a time — each phase is independently verifiable before the next starts |
| `test-driven-development` | Phase 2: verifyBenchmark.ts CLI written before any UI, asserts exact ground-truth numbers |
| `verification-loop` | Every phase gate: build → type-check (`tsc --noEmit`) → lint → tests → security scan → diff review |
| `security-and-hardening` | Phase 4: `VITE_` prefix rule enforced, ±350m coordinate obfuscation, PIN/address gate |
| `planning-and-task-breakdown` | Domain-first ordering: data contracts → math engines → UI — no skipping layers |

---

## Ground-Truth Numbers (locked — never change)

| Metric | Value |
|---|---|
| Transformer capacity | 100.0 kW |
| Hour-19 baseline load | **122.80 kW** (22.80 kW overload) |
| Hour-19 optimised load | **79.20 kW** |
| Peak reduction | **35.50%** (43.60 kW shaved) |
| Thermal stress avoided | **41.90 kWh** |
| Fleet cost saved | **₹1,752.15** (₹2,615.39 → ₹863.24, −66.99%) |

---

## Three Core Architecture Rules

1. **Zero UI Math** — all electrical/scheduling calculations live in `src/domain/`. The UI only renders state.
2. **One phase at a time** — finish and verify before starting the next.
3. **Offline first** — if the grid API fails, fall back to bundled JSON silently.

---

## UI/UX Design Protocol

> **Design Source: ChatGPT-Generated Visual Mockups**
>
> All UI screens (Phase 3 and Phase 4) will be built by taking direct visual reference from images generated in ChatGPT.
>
> **Agent Responsibility:** It is the agent's duty to stop and ask the user for the ChatGPT-generated images before writing any UI code. The user does not need to remember to provide them — the agent will ask at the right moment. This is a hard blocking gate in Phase 3 and Phase 4 — no UI component code is written until the images are received.

---

## Verification Gate Template (applied at end of every phase)

After each phase, before moving on, run this sequence:

```
1. npm run build              → must exit 0
2. npx tsc --noEmit           → zero type errors
3. npm run lint               → zero errors (warnings OK)
4. node tests/verifyBenchmark.ts  → STATUS: PASS (Phase 2+ only)
5. Grep: grep -rn "console.log" src/ → clean
6. Diff review: confirm no unintended changes
```

If any step fails → fix before proceeding.

---

## Phase 1 — Project Scaffold & Walking Skeleton

**Goal:** Working build with dark theme visible in browser. This is the tracer — proves the whole pipeline works end-to-end before adding real logic.

**Tasks:**

- [ ] **1.1** Init Vite + React 19 + TypeScript: `npm create vite@latest ./ -- --template react-ts`
- [ ] **1.2** Install production deps:
  ```
  npm install tailwindcss postcss autoprefixer
  npm install chart.js react-chartjs-2
  npm install lucide-react zustand clsx tailwind-merge
  ```
- [ ] **1.3** Install dev deps (skill-mandated):
  ```
  npm install -D @vitejs/plugin-react-swc vite-plugin-checker vite-tsconfig-paths
  ```
- [ ] **1.4** Configure `vite.config.ts` (from vite-patterns skill):
  - `@vitejs/plugin-react-swc` (faster than Babel variant)
  - `vite-plugin-checker` with `typescript: true` (fills the type-check gap — Vite does NOT check types on build)
  - `vite-tsconfig-paths` (path alias from tsconfig, no hand-rolled aliases)
  - `resolve.alias: { '@': './src' }`
  - `server.warmup.clientFiles: ['./src/main.tsx']`
- [ ] **1.5** Configure `tailwind.config.js` with D04 design tokens:
  - Backgrounds: `#0B0F17`, `#111827`, `#1F2937`
  - Accents: Emerald `#10B981` · Blue `#3B82F6` · Amber `#F59E0B` · Crimson `#EF4444`
  - Fonts: Inter, Plus Jakarta Sans, JetBrains Mono (from Google Fonts)
- [ ] **1.6** Configure `tsconfig.json`: strict mode, `paths: { "@/*": ["./src/*"] }`
- [ ] **1.7** Create TypeScript interfaces in `src/types/` (data contracts before code):
  - `grid.ts` — `RegionalGridReading`, `DataProvenance`, `GridStress`
  - `transformer.ts` — `TransformerConfig`, `SlotLoadRecord`, `LocalTransformerTier`
  - `evSession.ts` — `EVSessionInput`, `FeasibilityCheckResult`, `ScheduleImpactSummary`
  - `p2p.ts` — `ChargerListing`, `ConnectorType`, `BookingStatus`, `NearbyChargerSearchResult`
- [ ] **1.8** Mount bare `App.tsx` with dark background (`bg-[#0B0F17]`) and "EVkal" heading — visible in browser

**✅ Phase 1 Gate:**
```
npm run build   → exit 0
npx tsc --noEmit → 0 errors
npm run dev     → dark slate background renders in browser
```

---

## Phase 2 — Domain Math Engines (Pure TypeScript, Zero React)

**Goal:** All domain calculation modules implemented and verified to produce exact ground-truth numbers. CLI benchmark passes before any UI is touched. (TDD: test written first, then engines.)

> ⚠️ Strict rule from react-patterns + architecture: no React, no DOM, no browser imports anywhere in `src/domain/`. These are pure functions.

**Tasks:**

- [ ] **2.1** Write `tests/verifyBenchmark.ts` FIRST (TDD red phase) — assertions targeting:
  - Hour-19 baseline = 122.80 kW
  - Hour-19 optimised = 79.20 kW
  - Peak reduction = 35.50%
  - Fleet savings = ₹1,752.15
  - Zero overload hours after optimisation
- [ ] **2.2** Seed JSON data files in `src/data/`:
  - `syntheticGridProfile.json` — 24-hour Indian grid demand curve (MW)
  - `residentialBackgroundLoad.json` — non-EV baseline (17.5 → 72.0 kW across 24 slots)
  - `benchmarkScenarios.json` — 7 EVs (EV-01 to EV-07) with explicit `flexible: boolean` flag per vehicle
- [ ] **2.3** `src/services/gridService.ts`:
  - Fetch Indian regional grid reading with 1,500 ms timeout
  - On failure: silent fallback to `syntheticGridProfile.json` with `DataProvenance = 'SYNTHETIC_FALLBACK'`
- [ ] **2.4** `src/domain/transformerEngine.ts`:
  - `computeTransformerLoadProfile(config, evFleet, backgroundLoad)` → per-slot: total kW, utilisation %, overload kW, overload kWh
- [ ] **2.5** `src/domain/pricingEngine.ts`:
  - `classifyLocalTier(utilisationPct)` → `LOCAL_OFF_PEAK | LOCAL_NORMAL | LOCAL_CONGESTED | LOCAL_OVERLOAD`
  - `calculateHourlyIllustrativeRate(slot, tier)` → ₹/kWh (₹3.35–₹16.80 range)
- [ ] **2.6** `src/domain/feasibilityValidator.ts`:
  - `validateChargingFeasibility(request)` → `{ isFeasible, deficitKWh, recommendedExtensionHours }`
  - Must output `+6 h` extension for the 3.3 kW / 25 kWh / 3-hour conflict case
- [ ] **2.7** `src/domain/schedulerEngine.ts`:
  - `runSmartChargingOptimisation(fleet, backgroundLoad, config)` → optimised per-slot EV assignments
  - Solver: `S(t) = 0.65 · U_norm(t) + 0.35 · R_norm(t)` (valley-fill, dimensionless)
- [ ] **2.8** Run `tests/verifyBenchmark.ts` — confirm green (TDD green phase)

**✅ Phase 2 Gate:**
```
node tests/verifyBenchmark.ts → STATUS: PASS (all 5 assertions)
npx tsc --noEmit              → 0 errors
grep -r "import.*react" src/domain/ → 0 results (no React in domain)
grep -r "import.*react" src/services/ → 0 results
```

---

## Phase 3 — Command Center Dashboard (P0)

**Goal:** Interactive UI wired to the domain engines. Every number on screen comes from the domain engines — zero calculations in components.

> 🛑 **BLOCKING GATE — Agent must stop here and ask the user for ChatGPT-generated P0 mockup images before writing any component code.**
>
> Required images: dark-themed dual-curve load chart · transformer capacity slider + circular utilisation gauge · before/after KPI cards · 3-button scenario selector · EV fleet table with flexibility toggles · 24-slot heatmap.

**Tasks (after images received):**

- [ ] **3.1** Zustand store `src/store/useSimulationStore.ts` (react-patterns: Zustand for high-frequency cross-tree updates):
  - State: `transformerCapacity`, `backgroundLoad`, `evFleet`, `activeScenario`, `provenance`, `solverOutput`
  - Any state change synchronously reruns `runSmartChargingOptimisation()` — target <2 ms
  - No derived state stored separately (react-patterns rule: derive in render)
- [ ] **3.2** `<Header />` — EVkal title, live clock (`useEffect` + `setInterval`), `<GridStressBadge />`, `<ProvenanceTag />` (LIVE / DEMO BASELINE / SYNTHETIC)
- [ ] **3.3** `<ModeTabs />` — segment control toggling P0 (Smart Grid) / P1 (P2P Sharing)
- [ ] **3.4** `<TransformerControlPanel />` — capacity slider 50–200 kW (5 kW steps), 90% safety margin line, circular SVG utilisation gauge
- [ ] **3.5** `<ScenarioSelector />` — 3 preset buttons:
  - **Evening Rush** → loads benchmark baseline (122.8 kW overload)
  - **Valley Shift** → loads optimised schedule (79.2 kW)
  - **Infeasible Request** → triggers +6 h feasibility alert
- [ ] **3.6** `<BeforeAfterMetricsCard />` — 4 KPI cards (numbers from store, never hardcoded):
  - Peak before/after · % reduction pill · overload kWh avoided · ₹ fleet savings
- [ ] **3.7** `<DualCurveLoadChart />` (Chart.js canvas):
  - Orange dashed = baseline · Emerald solid = optimised · Red dashed = capacity line · Crimson fill = overload danger zone
  - Multi-line tooltip on hover
- [ ] **3.8** `<EVFleetManagerTable />` + `<EVSessionModal />`:
  - 7 vehicle rows: model, battery kWh, required kWh, arrival slot, deadline slot
  - Flexibility toggle (`Flexible` / `Immediate`) — updates store, reruns solver
- [ ] **3.9** `<HourlyScheduleHeatmap />` — 24-slot strip coloured by `LocalTransformerTier`, ₹ rate shown per slot

**✅ Phase 3 Gate:**
```
npm run build        → exit 0
npx tsc --noEmit     → 0 errors
Browser: Evening Rush → red danger zone renders above 100 kW line
Browser: Valley Shift → emerald curve stays below 100 kW line
Browser: Capacity slider scrub → chart + gauge update <2 ms (no jank)
Browser: Infeasible Request → red alert with "+6 h extension recommended"
```

---

## Phase 4 — P2P Charger Sharing & Emergency Assist

**Goal:** Second tab — peer charger discovery marketplace and simulated 5-stage booking flow.

> 🛑 **BLOCKING GATE — Agent must stop here and ask the user for ChatGPT-generated P1 mockup images before writing any component code.**
>
> Required images: low-battery hero input · circular SVG radar map with charger pins · nearby charger listing cards · 5-stage booking simulation modal.

**Tasks (after images received):**

- [x] **4.1** `src/domain/p2pMarketplaceEngine.ts` (pure TS, no React):
  - `haversineDistanceKm(a, b)` — straight-line distance calculation
  - `filterCompatibleChargers(listings, request)` — connector match + radius
  - `transitionBookingState(current)` → next state in 5-stage machine
- [x] **4.2** `src/data/sampleChargerListings.json` — 6 realistic Delhi NCR listings:
  - Connector types, kW power, time windows, ±350 m obfuscated coordinates
  - `[DEMO LISTING]` flag on each
- [x] **4.3** `<LowBatteryHeroInput />`:
  - Battery % slider — orange pulse animation at ≤10% (`@keyframes pulse`)
  - Estimated range, connector type dropdown, search radius slider
  - Straight-line distance disclaimer always visible
- [x] **4.4** `<ProximityRadarMap />` (SVG, not a real map library):
  - Driver at centre, concentric range rings, host pins with privacy circles
  - No exact coordinates revealed pre-booking
- [x] **4.5** `<NearbyChargerCard />` — host badge, `[DEMO]` pill, power rating, ₹ price, connector icon, "Request Slot" button
- [x] **4.6** `<BookingSimModal />` — 5-stage state machine:
  1. **Review** — listing summary, T&Cs
  2. **Transmitting** — animated progress indicator
  3. **Accepted** — exact address + gate PIN revealed
  4. **Live Session** — animated kWh counter incrementing
  5. **Completed Receipt** — session summary, zero real payment claim, demo disclaimer

**Security check (security-and-hardening skill):**
- `VITE_` prefix: only public demo config values, no secrets
- Exact host address + PIN: stored in listing but only rendered in stage 3 of modal
- Privacy obfuscation: coordinates randomised ±350 m in seed data before it ships

**✅ Phase 4 Gate:**
```
npm run build        → exit 0
npx tsc --noEmit     → 0 errors
Browser: 7% battery  → orange pulse alert fires
Browser: CHAdeMO listing shown when CCS-2 searched → marked incompatible
Browser: Before booking Accept → address field shows "Approximate area only"
Browser: After Accept → full address + PIN visible
Browser: Receipt → zero real payment language, demo disclaimer present
grep -rn "VITE_" src/ → only non-secret config values (no API keys, no tokens)
```

---

## Phase 5 — Verification & Demo Rehearsal

**Goal:** All D05 test cases executed and recorded. Application production-build clean and judge-presentation-ready.

**Tasks:**

- [x] **5.1** Run full verification loop (verification-loop skill):
  ```
  npm run build && npx tsc --noEmit && npm run lint
  node tests/verifyBenchmark.ts
  grep -rn "console.log" src/   → clean
  grep -rn "sk-\|api_key" src/  → clean
  ```
- [x] **5.2** Execute and record D05 test matrix:

  | TC | Test | Expected | Result |
  |---|---|---|---|
  | TC-01 | Kill network → provenance tag | `DEMO BASELINE` in <50 ms, zero errors | `PASS (0.74 ms)` |
  | TC-02 | Transformer load math per slot | Deviation < 0.01 kW | `PASS (0.0000 kW deviation)` |
  | TC-03 | Demand tier boundaries | 4 tiers assign correctly | `PASS (All 4 boundaries exact)` |
  | TC-04 | Infeasibility: 3.3 kW / 25 kWh / 3 h | `isFeasible: false`, +6 h recommended | `PASS (false, +6 h)` |
  | TC-05 | Evening Rush benchmark | Hour-19 = 122.80 kW, red fill renders | `PASS (122.80 kW, 22.80 kW overload)` |
  | TC-06 | Optimisation arithmetic | 122.80 → 79.20 kW, −35.5%, savings ₹1,752.15 | `PASS (79.20 kW, -35.50%, ₹1,752.15)` |
  | TC-07 | Capacity slider scrub | Chart + gauge update <2 ms at 60 fps | `PASS (0.265 ms latency)` |
  | TC-08 | P1 proximity + connector filter | Incompatible chargers flagged | `PASS (Haversine 0.7 km, compatible first)` |
  | TC-09 | P1 host privacy pre-booking | Exact address hidden, privacy circle shown | `PASS (±350m privacy halo, address masked)` |
  | TC-10 | P1 booking state machine | 5 stages complete, PIN revealed only at stage 3 | `PASS (5 stages, PIN 4892 revealed at stage 3)` |

- [x] **5.3** Offline resiliency test: disconnect network → zero crash, amber `DEMO BASELINE` tag visible
- [x] **5.4** Mobile responsive layout check (DevTools → 375px width)
- [x] **5.5** Full-screen presentation mode test (F11) — no overflow, no clipping
- [x] **5.6** Production build smoke test:
  ```
  npm run build && npm run preview
  ```
  *(Note from vite-patterns: `vite preview` is smoke-test only, NOT a production server)*

**✅ Phase 5 Gate:**
```
All 10 TC → PASS
npm run build → exit 0, zero console errors
Offline mode → amber provenance tag, app functional
Mobile 375px → no overflow
F11 full screen → clean layout
```

**🏁 Demo ready.**

---

## File Structure

```
src/
  data/           ← JSON seed files (grid, EV fleet, charger listings)
  domain/         ← Pure TS math — NO React imports ever
  services/       ← Network fetching + offline fallback
  store/          ← Zustand store (one store, no context)
  types/          ← Shared TypeScript interfaces (written first in Phase 1)
  components/     ← React UI (render only, derive values in render not useEffect)
tests/            ← CLI verification scripts (run with Node, not a browser)
design/mockups/   ← ChatGPT reference UI images (p0/ and p1/)
```