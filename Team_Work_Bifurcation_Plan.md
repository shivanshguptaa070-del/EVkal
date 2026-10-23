# CHARGESHARE — 2-PERSON TEAM WORK BIFURCATION PLAN
**Project:** ChargeShare (Hackathon Problem #053)  
**Reference Docs:** [D01 PRD](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/ChargeShare_PRD_Final_v2_1.docx) | [D02 Math Spec](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D02_Data_API_Algorithm_Specification.md) | [D03 Architecture](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D03_Technical_Architecture_System_Design.md) | [D04 UI Spec](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D04_UI_UX_Screen_Interaction_Specification.md) | [D05 Demo Playbook](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D05_Testing_Verification_Judge_Demo_Playbook.md)  
**Date:** 23 October 2026  

---

## 1. Golden Rules for Zero-Conflict Collaboration

1. **Strict File Isolation**: Member 1 never edits `src/domain/` or `src/services/`. Member 2 never edits `src/components/` or `src/index.css`.
2. **Contract-First Independence**: Both members code against the shared interfaces in `src/types/`. Neither member waits for the other to finish.
3. **Deterministic Math Verification**: Member 2 verifies their algorithms via CLI/unit tests against D02 Section 8 benchmarks before handoff.
4. **15-Minute Plug-and-Play Integration**: Member 1 imports Member 2's pure functions into the Zustand store. Zero UI refactoring required.

---

## 2. Team Member Assignments

### 👤 Member 1 (Lead: Shivansh Gupta)
**Role**: Frontend Architect, Visual Design & State Integration  
**Git Branch**: `shiwansh-gupta`  
**Primary Responsibilities**:
- Scaffolding the React 19 + Vite + TypeScript + Tailwind CSS application.
- Building the global responsive dark-mode shell, headers, and mode tabs (`App.tsx`, `Header.tsx`, `ModeTabs.tsx`).
- Configuring the Chart.js `<DualCurveLoadChart />` with dynamic baseline curve, capacity dashed line, and crimson overload fill.
- Implementing `<TransformerControlPanel />` (capacity slider), `<ScenarioSelector />` (preset buttons), and `<EVFleetManagerTable />`.
- Building the P1 Emergency Assist interface (`LowBatteryHeroInput.tsx`, `NearbyChargerCard.tsx`, and the 5-stage `BookingSimModal.tsx`).
- Managing the reactive Zustand store (`useSimulationStore.ts`) with temporary mock stubs during parallel development.

### 👤 Member 2 (Friend / Collaborator)
**Role**: Data Engineer & Domain Algorithm Specialist  
**Git Branch**: `feat/algo-data`  
**Primary Responsibilities**:
- Creating deterministic JSON datasets in `src/data/` (`syntheticGridProfile.json`, `residentialBackgroundLoad.json`, `sampleChargerListings.json`, `benchmarkScenarios.json`).
- Implementing `src/services/gridService.ts` with a 1,500ms network timeout and graceful fallback to synthetic Indian regional data.
- Implementing `src/domain/transformerEngine.ts` to compute hourly background + EV load summation, capacity utilization %, and overload energy.
- Implementing `src/domain/pricingEngine.ts` to classify local demand tiers (`LOCAL_OFF_PEAK` to `LOCAL_OVERLOAD`) and compute illustrative INR tariffs ($₹3.35$ to $₹16.80$).
- Implementing `src/domain/feasibilityValidator.ts` to catch impossible vehicle energy/deadline requests (with accurate whole-hour extension recommendations).
- Implementing `src/domain/schedulerEngine.ts` with the normalized dimensionless valley-filling solver ($S(t) = 0.65 \cdot U_{\text{norm}} + 0.35 \cdot R_{\text{norm}}$).
- Implementing `src/domain/p2pMarketplaceEngine.ts` with Haversine distance calculations and booking status state transitions.

---

## 3. Directory & File Allocation Matrix

```
c:\Users\sysye\OneDrive\Desktop\EVkal\
├── src/
│   ├── types/                     <-- [SHARED CONTRACT] Locked in advance from D02/D03
│   │   ├── grid.ts
│   │   ├── transformer.ts
│   │   ├── evSession.ts
│   │   └── p2p.ts
│   │
│   ├── data/                      <-- [MEMBER 2 ONLY]
│   │   ├── syntheticGridProfile.json
│   │   ├── residentialBackgroundLoad.json
│   │   ├── benchmarkScenarios.json
│   │   └── sampleChargerListings.json
│   │
│   ├── services/                  <-- [MEMBER 2 ONLY]
│   │   └── gridService.ts
│   │
│   ├── domain/                    <-- [MEMBER 2 ONLY]
│   │   ├── transformerEngine.ts
│   │   ├── pricingEngine.ts
│   │   ├── feasibilityValidator.ts
│   │   ├── schedulerEngine.ts
│   │   └── p2pMarketplaceEngine.ts
│   │
│   ├── store/                     <-- [MEMBER 1 ONLY]
│   │   └── useSimulationStore.ts
│   │
│   ├── components/                <-- [MEMBER 1 ONLY]
│   │   ├── common/
│   │   ├── layout/
│   │   ├── p0-smart-charging/
│   │   └── p1-charger-sharing/
│   │
│   ├── App.tsx                    <-- [MEMBER 1 ONLY]
│   └── index.css                  <-- [MEMBER 1 ONLY]
```

---

## 4. Member 2 Standalone Verification Target

Before submitting the pull request, Member 2 runs a simple standalone verification test to prove their code works mathematically against the ground-truth benchmark:

```bash
# Run standalone domain test
npx tsx src/domain/schedulerEngine.ts
```

**Required Output to Pass Gate**:
```
=== VERIFICATION GATE: SCENARIO A (EVENING RUSH) ===
Hour 19 Background Load:       72.00 kW
Hour 19 Active EV Fleet Load:  50.80 kW
Hour 19 Total Baseline Load:  122.80 kW (122.8% - OVERLOAD: 22.80 kW)
Optimised Peak Load:           79.20 kW (Hour 19)
Peak Load Reduction:           35.50% (43.60 kW saved)
Overload Avoided:              100.0% (0 hours above 100 kW; 41.90 kWh avoided)
Fleet Cost Savings:            ₹1,752.15 (66.99% savings)
STATUS: PASS - READY FOR INTEGRATION
```

---

## 5. Integration Protocol (15 Minutes)

1. **Member 2** opens Pull Request: `feat/algo-data` $\to$ `main`.
2. **Member 1** reviews and merges the PR into `main`.
3. **Member 1** pulls `main` into `shiwansh-gupta`.
4. In `src/store/useSimulationStore.ts`, Member 1 wires the real domain imports:
   ```typescript
   import { computeTransformerLoadProfile } from '../domain/transformerEngine';
   import { runSmartChargingOptimization } from '../domain/schedulerEngine';
   import { fetchRegionalGridReading } from '../services/gridService';
   import { searchNearbyChargers } from '../domain/p2pMarketplaceEngine';
   ```
5. Run `npm run dev` and execute the 3-minute presentation script from **D05**.
