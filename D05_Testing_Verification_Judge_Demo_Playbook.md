# CHARGESHARE — SPECIFICATION D05
# Testing, Verification & Judge Demo Playbook
**Document ID:** D05  
**Version:** 1.0 (Implementation & Demo Baseline)  
**PRD Reference:** [ChargeShare_PRD_Final_v2_1.docx](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/ChargeShare_PRD_Final_v2_1.docx)  
**Data & Math Reference:** [D02_Data_API_Algorithm_Specification.md](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D02_Data_API_Algorithm_Specification.md)  
**Technical Architecture:** [D03_Technical_Architecture_System_Design.md](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D03_Technical_Architecture_System_Design.md)  
**UI/UX Specification:** [D04_UI_UX_Screen_Interaction_Specification.md](file:///c:/Users/sysye/OneDrive/Desktop/EVkal/D04_UI_UX_Screen_Interaction_Specification.md)  
**Status:** Approved for Implementation & Hackathon Defense  
**Release Date:** 23 October 2026  

---

## 1. Objectives & Quality Standards

This playbook serves two purposes:
1. **Engineering Verification Gate**: Provides a deterministic test matrix to verify that the codebase strictly satisfies PRD requirements (FR-01 through FR-14) and mathematical formulas prior to code freeze.
2. **Judge Demonstration Script**: Outlines a click-by-click, 3-minute presentation playbook designed to maximize hackathon judging criteria (Technical Rigor, Practical Feasibility, Data Honesty, and Presentation Polish).

---

## 2. Engineering Verification Test Matrix

Every test case below must be verified against the running application before marking the build "Demo Ready".

| Test ID | Feature / Area | Verification Procedure | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Data Provenance & Fallback** | Disconnect internet or mock network failure in `gridService.ts`. | App transitions to synthetic profile in $<50\text{ ms}$; `<ProvenanceTag />` switches to `"DEMO BASELINE"`; zero console exceptions. | `NOT RUN` |
| **TC-02** | **Transformer Load Math** | In `transformerEngine.ts`, verify for each hour $t$: $\text{Total}(t) = \text{Background}(t) + \sum p_i(t)$. | Load curve matches arithmetic sum with zero rounding drift; max deviation $< 0.01\text{ kW}$. | `NOT RUN` |
| **TC-03** | **Demand Tier Boundaries** | Set capacity = $100\text{ kW}$. Test loads at $49.9\text{ kW}$, $50.0\text{ kW}$, $75.0\text{ kW}$, $100.1\text{ kW}$. | Correctly assigns `LOCAL_OFF_PEAK`, `LOCAL_NORMAL`, `LOCAL_CONGESTED`, `LOCAL_OVERLOAD`. | `NOT RUN` |
| **TC-04** | **Pre-Flight Feasibility Check** | Submit EV request: $25.0\text{ kWh}$, $3.3\text{ kW}$ charger, 3-hour window ($t^{\text{arr}} = 19, t^{\text{dep}} = 22$, $\eta = 0.92$). | `validateChargingFeasibility` returns `isFeasible: false`, flags $15.9\text{ kWh}$ deficit, recommends $+6\text{ hours}$ (to 04:00). | `NOT RUN` |
| **TC-05** | **Benchmark Overload Baseline** | Load `Evening Rush` scenario on $100\text{ kW}$ transformer. | At Hour 19: Background $72.0\text{ kW}$ + EV $50.8\text{ kW}$ = **$122.80\text{ kW}$** ($122.8\%$ overload). Red danger fill renders. | `NOT RUN` |
| **TC-06** | **Optimization Arithmetic** | Click `Optimize Schedule` on `Evening Rush` scenario. | Peak drops from $122.80\text{ kW} \to 79.20\text{ kW}$ (**$35.5\%$ reduction**); overload hours drop from $2 \to 0$ ($100\%$ eliminated). | `NOT RUN` |
| **TC-07** | **Reactive Slider Scrubbing** | Scrub capacity slider from $100\text{ kW} \to 80\text{ kW} \to 120\text{ kW}$. | Chart capacity line, utilization ring, and KPI metrics update synchronously at 60fps ($<2\text{ ms}$). | `NOT RUN` |
| **TC-08** | **P1 Proximity & Compatibility** | In P1 tab, search for `CCS-2` within $5\text{ km}$ radius. | Incompatible plugs (e.g. `CHAdeMO`) filtered or marked disabled; straight-line distance calculated via Haversine. | `NOT RUN` |
| **TC-09** | **P1 Host Privacy Obfuscation** | Inspect listing card prior to booking acceptance. | Exact street address and gate code concealed; approximate locality displayed with privacy circle. | `NOT RUN` |
| **TC-10** | **P1 Booking State Machine** | Step through simulated booking: `REQUEST` $\to$ `ACCEPT` $\to$ `IN_PROGRESS` $\to$ `COMPLETE`. | Address and PIN unveiled only after `ACCEPT`; live kWh counter increments; zero real payment claims. | `NOT RUN` |

---

## 3. Four Deterministic Demonstration Scenarios

These four scenarios must be pre-loaded into the `<ScenarioSelector />` component for instant switching during the live pitch:

### Scenario A: "Evening Commute Rush" (Baseline Overload Crisis)
- **Context**: 7 neighborhood EVs plug in uncoordinated between 18:00 and 20:00 during peak residential cooking/cooling hours.
- **Inputs**: Transformer rated at $100.0\text{ kW}$. Background load peaks at $72.0\text{ kW}$ at Hour 19.
- **Outcome**:
  - Hour 19 Uncoordinated EV Load = **$50.80\text{ kW}$**.
  - Total Transformer Load = **$122.80\text{ kW}$** (**$122.80\%$ capacity utilization**).
  - Active Overload = **$22.80\text{ kW}$** above thermal rating for 2 continuous hours (Hour 19 and Hour 20, totaling $41.90\text{ kWh}$ excess energy).
  - Red danger zone hatched area renders visibly above the capacity line.

### Scenario B: "Feasible Night Valley Shift" (Clean Smart Optimization)
- **Context**: Smart Charging algorithm engages for the 5 flexible vehicles (`EV-01`, `EV-03`, `EV-04`, `EV-05`, `EV-06`).
- **Algorithm Action**: Shifter moves flexible charging into overnight valley slots (23:00–05:00) where residential background load drops to $17.5\text{ kW} - 24.5\text{ kW}$.
- **Outcome**:
  - Hour 19 Peak collapses from $122.80\text{ kW}$ down to **$79.20\text{ kW}$** (only non-flexible `EV-02` charges at Hour 19).
  - **Peak Reduction**: **$35.50\%$** ($43.60\text{ kW}$ peak shaved).
  - **Overload Avoidance**: **$100\%$** ($0$ hours above $100.0\text{ kW}$; $41.90\text{ kWh}$ overload eliminated).
  - **Illustrative Cost Savings**: Driver fleet cost drops from $₹2,615.39 \to ₹863.24$, saving **$₹1,752.15$ ($66.99\%$)**.

### Scenario C: "Constrained Infeasible Deadline" (Honest Error Handling)
- **Context**: Driver enters unrealistic parameters: Tata Nexon EV needing $25.0\text{ kWh}$ using a standard $3.3\text{ kW}$ domestic socket with an arrival at 19:00 and departure at 22:00 (3 hours).
- **Physical Reality**: Maximum deliverable energy in 3 hours at $3.3\text{ kW} \times 0.92 = 9.1\text{ kWh}$. Energy deficit is $15.9\text{ kWh}$. Total time needed is $25.0 / (3.3 \times 0.92) = 8.23\text{ hours}$.
- **Outcome**:
  - System refuses to output an impossible schedule.
  - Red warning border triggers on the vehicle card with message:
    *"Infeasible Request: Cannot deliver 25.0 kWh in 3 hours at 3.3 kW (Deficit: 15.9 kWh). Extend deadline by 6 hours (to 04:00) or upgrade to a 7.4 kW charger."*

### Scenario D: "Transformer Capacity Stress Test" (Judge Interactive Mode)
- **Context**: The judge is invited to manually drag the transformer capacity slider from $100\text{ kW}$ down to $75\text{ kW}$.
- **Outcome**:
  - Dynamic re-optimization triggers in real time.
  - Scheduler detects that even with optimal shifting, peak load ($79.20\text{ kW}$) exceeds $75.0\text{ kW}$ by $4.20\text{ kW}$.
  - System tags output with `MITIGATED_PARTIAL_OVERLOAD`: Overload reduced from $47.80\text{ kW} \to 4.20\text{ kW}$ ($91.2\%$ reduction), transparently reporting the remaining limitation.

---

## 4. The 3-Minute Hackathon Pitch & Live Demo Script

```
┌────────────────────────────────────────────────────────────────────────┐
│                        3-MINUTE DEMO TIMELINE                          │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 0:00 - 0:45       │ 0:45 - 1:45       │ 1:45 - 3:00                    │
│ The Grid Crisis   │ The Math Solution │ The P2P Extension & Defense    │
│ (Baseline Peak)   │ (Smart Shifting)  │ (Emergency Assist & Privacy)   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Minute 0:00 – 0:45: The Problem & Baseline Crisis
- **Action**: Open ChargeShare in full-screen (`F11`). Ensure `Evening Rush` scenario is selected. Point to the top header.
- **Spoken Script**:
  > *"Judges, in residential neighborhoods across India, distribution transformers were designed for domestic lighting and ACs—not seven electric vehicles plugging in simultaneously at 7:00 PM. Look at this screen: at 19:00, when families return home, background residential demand hits 72 kW. Because these 7 EVs charge uncoordinated, total load spikes to 122.8 kW on a 100 kW transformer—a dangerous 122.8% overload shown in crimson here. If unmanaged, this blows fuses and degrades public infrastructure."*

### Minute 0:45 – 1:45: The Solution & Dimensionless Solver
- **Action**: Click the **`🌙 Valley Shift (Optimize Schedule)`** button. Watch the chart curves instantly morph.
- **Spoken Script**:
  > *"Instead of spending crores replacing transformers, ChargeShare uses demand-responsive decision support. With one click, our constraint-based algorithm evaluates each vehicle's departure deadline, battery capacity, and charging rate. Using a normalized, dimensionless solver, it shifts flexible charging into the overnight valley—between 23:00 and 5:00 AM—where grid demand drops significantly. Look at the result: peak load plummets from 122.8 kW to 79.2 kW—a 35.5% peak reduction and 100% overload elimination, while the fleet saves 67% on illustrative time-of-day tariffs."*
- **Action**: Invite the judge: *"Drag this capacity slider from 100 kW down to 80 kW—notice how the math recalculates dynamically in sub-milliseconds without page reloads."*

### Minute 1:45 – 2:30: The P1 Extension — Stranded Low-Battery Rescue
- **Action**: Click the navigation tab **`[ 📍 P2P Charger Sharing (P1) ]`**.
- **Spoken Script**:
  > *"Now, what happens if an EV driver is stranded on the road with critical 7% battery and cannot reach the nearest public fast station 15 km away? ChargeShare solves this with our P2P charger-sharing extension. Private home chargers sit idle 85% of the day. In our Low-Battery Emergency Finder, the driver enters their 7% SoC and selects their CCS-2 plug. ChargeShare identifies nearby opted-in private hosts within a 5 km radius, displaying straight-line distance, power rating, and host-set pricing."*

### Minute 2:30 – 3:00: Data Honesty, Privacy & Wrap-Up
- **Action**: Click **`[ Request Slot ]`** on the first host listing. Step through the simulated booking state machine.
- **Spoken Script**:
  > *"Notice our strict data honesty guardrails: we explicitly label straight-line distance estimates, host listings carry demo verification tags, and the host's exact address and gate code remain completely obfuscated until the booking request is accepted. ChargeShare gives grid utilities load protection today, and gives drivers peer-to-peer charging security tomorrow. Thank you."*

---

## 5. Judge Q&A Defense & Rebuttal Guide

### Q1: "Is this connected to real smart meters or live hardware?"
- **Answer**: 
  > *"No, and that is by design for this hackathon stage. Per our PRD guardrails, hardware relays and OCPP firmware control require certified utility infrastructure. ChargeShare is an algorithmic decision-support tool. It accepts real or synthetic regional grid feeds, models local distribution physics, and proves how time-shifted charging flattens the curve before utilities deploy physical hardware."*

### Q2: "Why not use a machine learning model or an LLM to schedule?"
- **Answer**: 
  > *"Machine learning and LLMs are probabilistic, non-deterministic, and prone to hallucinations—an LLM might schedule charging past a driver's departure deadline or deliver negative power. Electrical grid protection requires guaranteed constraint satisfaction. Our solver uses a deterministic, normalized valley-filling algorithm that is mathematically guaranteed to meet deadlines, respect charger kW limits, and calculate exact before/after load curves in under 2 milliseconds."*

### Q3: "What if a driver has an emergency and needs to leave at 9:00 PM?"
- **Answer**: 
  > *"In our fleet management table, every driver has an opt-in flexibility switch. If a driver needs immediate power, flipping their toggle to 'Immediate' forces the scheduler to allocate maximum power instantly, while re-optimizing the remaining flexible vehicles around them to minimize transformer strain."*

### Q4: "How do you protect host privacy in the P2P sharing model?"
- **Answer**: 
  > *"Publicly broadcasting exact residential addresses creates security risks. ChargeShare applies privacy-by-design: listings are jittered by 350 meters on public search, showing only the neighborhood locality (e.g., 'Vasant Kunj Sector C'). The exact house number, directions, and gate code are only revealed in Stage 3 after the host explicitly accepts the booking request."*

### Q5: "Is your peak reduction calculated dynamically or hardcoded in the UI?"
- **Answer**: 
  > *"It is 100% dynamically computed by our pure TypeScript domain engine (`transformerEngine.ts`). If you add an eighth vehicle or change the battery size of the Nexon EV from 40 kWh to 60 kWh, the entire 24-hour load array, utilisation percentage, and peak reduction formula recalculate live."*

---

## 6. Pre-Demo Checklist (Zero-Surprise Protocol)

Before presenting to judges, execute this 60-second operational check:

- [ ] **Clean Terminal Launch**: Run `npm run dev` in a clean shell; verify local port (e.g., `http://localhost:5173`) loads with zero console errors.
- [ ] **Full Screen Mode**: Press `F11` in Chrome to eliminate browser toolbars and maximize screen real estate.
- [ ] **Default Scenario Active**: Ensure `Evening Rush (Baseline Overload)` is selected so the chart opens with the prominent $122.8\text{ kW}$ red danger zone.
- [ ] **Network Fallback Test**: Verify that disconnecting Wi-Fi keeps the dashboard running with the amber `"DEMO BASELINE: Synthetic Indian Diurnal Curve"` tag.
- [ ] **P1 Booking Reset**: Ensure the simulated booking state is reset to `AVAILABLE` so you can demonstrate the full 5-stage request flow live.
