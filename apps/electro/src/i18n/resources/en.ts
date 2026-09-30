/**
 * Source of truth for every other locale: __tests__/resources.test.ts asserts
 * every other resource file has exactly this key set, so a missing
 * translation fails a test instead of silently falling back to the key
 * string at runtime.
 */
export const en: Record<string, string> = {
  // Formula chips (ohms_law only right now — CalculatorDef.formulaKeys)
  'formula.ohmsLaw.dc1': 'U = I · R',
  'formula.ohmsLaw.dc2': 'P = U · I',
  'formula.ohmsLaw.dc3': 'P = I² · R',
  'formula.ohmsLaw.1ph1': 'U = I · Z',
  'formula.ohmsLaw.1ph2': 'P = U · I · cosφ',
  'formula.ohmsLaw.1ph3': 'I = P / U·cosφ',
  'formula.ohmsLaw.3ph1': 'U = I · Z',
  'formula.ohmsLaw.3ph2': 'P = √3·U·I·cosφ',
  'formula.ohmsLaw.3ph3': 'I = P / √3·U·I·cosφ',
  'formula.powerFactor.1': 'S² = P² + Q²',
  'formula.powerFactor.2': 'cosφ = P / S',
  'formula.powerFactor.3': 'Q = P · tanφ',
  'formula.pfCorrection.1': 'Qc = P · (tanφ₁ − tanφ₂)',
  'formula.pfCorrection.2': 'S = P / cosφ',
  'formula.transformer.1': 'S = P / cosφ · (1 + reserve)',
  'formula.transformer.2': 'I = S / (√3 · U)',
  'formula.shortCircuit.1': 'Ik″ = c · Un / (√3 · Zk)',
  'formula.shortCircuit.2': 'ZT = uk · Un² / Sr',
  'formula.earthLoop.1': 'Zs = Ze + ρ · L · (1/S + 1/Spe)',
  'formula.earthLoop.2': 'Zs ≤ U0 / Ia',

  // "N of 2 filled" hint banner (CalculatorDef.dynamicRoleFieldIds) — built
  // by concatenating resolved fragments, not template interpolation, so
  // @calc/ui never needs to know about string formatting (see CalculatorForm.tsx)
  'hint.enterAnyTwo': 'Enter any two values to calculate',
  'hint.oneMoreValue': 'set — enter one more value',
  'hint.solvingFrom': 'Solving from',
  'hint.and': 'and',

  // Categories (grouping on Home)
  'category.fundamentals': 'Electrical Fundamentals',
  'category.cable-wiring': 'Cable & Wiring',
  'category.motors-drives': 'Motors & Drives',
  'category.protection-coordination': 'Protection & Coordination',

  // Calculator titles + descriptions (source of truth: ElectroCalc web prototype's Home.tsx)
  'calc.ohmsLaw.title': "Ohm's Law",
  'calc.ohmsLaw.desc': 'Solve U, I, R, P for DC and AC systems',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Power to current for DC, 1-phase and 3-phase',
  'calc.cableSizing.title': 'Cable Sizing',
  'calc.cableSizing.desc': 'Cross-section selection per IEC 60364-5-52',
  'calc.voltageDrop.title': 'Voltage Drop',
  'calc.voltageDrop.desc': 'ΔU over cable run length and load',
  'calc.conduitFill.title': 'Conduit Fill',
  'calc.conduitFill.desc': 'Cable fill % for RL conduit sizes',
  'calc.motorCurrent.title': 'Motor Current',
  'calc.motorCurrent.desc': 'Nominal and startup current — IEC 60034',
  'calc.breakerSelection.title': 'Breaker Selection',
  'calc.breakerSelection.desc': 'MCB rating from Ip and Iz — EN 60898',
  'calc.peConductor.title': 'PE Conductor',
  'calc.peConductor.desc': 'Protective earth sizing — IEC 60364-5-54',

  // "Soon" — Home cards for calculators not implemented yet
  'calc.powerFactor.title': 'Power Factor',
  'calc.powerFactor.desc': 'Active, reactive and apparent power',
  'calc.shortCircuit.title': 'Short-Circuit Current',
  'calc.shortCircuit.desc': 'Prospective Isc at point of installation',
  'calc.transformerRating.title': 'Transformer Rating',
  'calc.transformerRating.desc': 'Standard kVA rating and rated currents',
  'calc.pfCorrection.title': 'PF Correction',
  'calc.pfCorrection.desc': 'Capacitor bank kvar to reach a target power factor',
  'calc.earthLoop.title': 'Earth Fault Loop',
  'calc.earthLoop.desc': 'Zs and automatic disconnection check — IEC 60364',

  // Shared fields
  'field.system': 'System',
  'field.voltage': 'Voltage',
  'field.current': 'Current',
  'field.resistance': 'Resistance',
  'field.impedance': 'Impedance',
  'field.power': 'Power',
  'field.cosPhi': 'Power factor',
  'field.length': 'Length',
  'field.crossSection': 'Cross-section',
  'field.temperature': 'Temperature',
  'field.material': 'Material',

  // kW ↔ A / motor current
  'field.nominalCurrent': 'Nominal current',
  'field.efficiency': 'Efficiency',
  'field.startupCurrentMin': 'Startup current (min)',
  'field.startupCurrentMax': 'Startup current (max)',

  // Voltage drop / cable sizing
  'field.insulation': 'Insulation',
  'field.conductorTemperature': 'Conductor temperature',
  'field.voltageDrop': 'Voltage drop',
  'field.voltageDropPercent': 'Voltage drop %',
  'field.loadType': 'Load type',
  'field.loadCurrent': 'Load current',
  'field.installMethod': 'Install method',
  'field.ambientTemperature': 'Ambient temperature',
  'field.grouping': 'Grouping',
  'field.designCurrent': 'Design current',
  'field.requiredAmpacity': 'Required ampacity',
  'field.tableAmpacity': 'Table ampacity',
  'field.ampacityMargin': 'Margin',

  // Breaker selection
  'field.breakerRating': 'Breaker rating',

  // PE conductor
  'field.method': 'Method',
  'field.faultCurrent': 'Fault current',
  'field.disconnectionTime': 'Disconnection time',
  'field.kFactor': 'Material factor (k)',
  'field.phaseSection': 'Phase conductor section',
  'field.requiredPeSection': 'Required PE section',
  'field.standardPeSection': 'Standard PE section',

  // Conduit fill
  'field.conduitDiameter': 'Conduit internal diameter',
  'field.cableCount': 'Number of cables',
  'field.totalCableArea': 'Total cable area',
  'field.conduitFillPercent': 'Fill',
  'field.conduitFillLimit': 'Fill limit',

  // Power factor / compensation / transformer / short-circuit / earth loop
  'field.reactivePower': 'Reactive power',
  'field.apparentPower': 'Apparent power',
  'field.targetCosPhi': 'Target power factor',
  'field.compensationPower': 'Compensation power',
  'field.apparentPowerBefore': 'Apparent power before',
  'field.apparentPowerAfter': 'Apparent power after',
  'field.currentReduction': 'Current reduction',
  'field.reservePercent': 'Reserve',
  'field.primaryVoltage': 'Primary voltage',
  'field.secondaryVoltage': 'Secondary voltage',
  'field.requiredApparentPower': 'Required apparent power',
  'field.ratedApparentPower': 'Standard transformer rating',
  'field.transformerLoad': 'Load at this rating',
  'field.primaryCurrent': 'Primary rated current',
  'field.secondaryCurrent': 'Secondary rated current',
  'field.transformerPower': 'Transformer rating',
  'field.ukPercent': 'Short-circuit voltage uk',
  'field.networkPower': 'Grid short-circuit power',
  'field.shortCircuitSource': 'Ik″ at transformer',
  'field.shortCircuitEnd': 'Ik″ at cable end',
  'field.totalImpedance': 'Impedance at cable end',
  'field.earthVoltage': 'Phase-to-earth voltage',
  'field.externalImpedance': 'External loop impedance Ze',
  'field.peSection': 'PE conductor section',
  'field.tripCurve': 'Trip curve',
  'field.loopResistance': 'Conductor loop resistance',
  'field.earthLoopImpedance': 'Loop impedance Zs',
  'field.maxLoopImpedance': 'Max. allowed Zs',

  // Options: system
  'system.dc': 'DC',
  'system.1ph': '1-Phase',
  'system.3ph': '3-Phase',

  // Options: material
  'material.cu': 'Cu',
  'material.al': 'Al',

  // Options: insulation
  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  // Options: install method — short code as the chip label, full IEC
  // description as the .desc (shown via SegmentedControl's "?" details sheet,
  // matches @calc/data's INSTALL_METHOD_LABEL wording)
  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Conduit in thermally insulating wall',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Conduit on wall or in trunking',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Clipped direct to masonry surface',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Cable tray or free air',

  // Options: ambient temperature
  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  // Options: conductor temperature (voltage drop)
  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  // Options: grouping
  'grouping.1': '1 circuit',
  'grouping.2': '2 circuits',
  'grouping.3': '3 circuits',
  'grouping.4': '4 circuits',
  'grouping.5': '5 circuits',
  'grouping.6plus': '6+ circuits',

  // Options: load type
  'loadType.power': 'Power',
  'loadType.current': 'Current',

  // Options: PE method
  'peMethod.adiabatic': 'Adiabatic',
  'peMethod.simplified': 'Simplified',

  // Options: PE k-factor
  'peKFactor.Cu_sep': 'Cu, separate (k=143)',
  'peKFactor.Cu_cable': 'Cu, in cable (k=115)',
  'peKFactor.Al_cable': 'Al, in cable (k=76)',

  'tripCurve.B': 'B (3–5 × In)',
  'tripCurve.C': 'C (5–10 × In)',
  'tripCurve.D': 'D (10–20 × In)',

  // chainTo
  'chainTo.breakerSelection': 'Breaker Selection',

  // Warnings/errors
  'error.needExactlyTwoValues': 'Enter exactly two known values.',
  'error.missingRequiredFields': 'Fill in all required fields.',
  'error.noBreakerFitsInRange':
    'No standard rating fits between Ip and Iz — increase cable cross-section.',
  'error.noPeSizeFitsInRange':
    'Required PE section exceeds the standard range.',
  'error.apparentPowerTooSmall': 'Apparent power cannot be smaller than active or reactive power.',
  'error.cosPhiOutOfRange': 'Power factor must be between 0.01 and 1.',
  'error.noTransformerFitsInRange': 'Load exceeds the largest standard rating (2500 kVA) — split it across several transformers.',
  'info.pfAlreadyAtTarget': 'Power factor is already at or above the target — no compensation needed.',
  'warn.earthLoopTooHigh': 'Loop impedance exceeds the maximum for this breaker — it may not trip instantly. Use a larger conductor, a shorter run or add an RCD.',
  'warn.divisionByZero':
    'Check your inputs — one of the values leads to division by zero.',
  'warn.voltageDropExceedsIec': 'Voltage drop exceeds the 5% IEC guideline.',
  'warn.cableSizingNoTableFit':
    'No standard cross-section fully covers this load — largest available section shown.',
  'info.largeSectionReactanceIgnored':
    'Cross-section above 50mm² — reactance is not accounted for in this formula.',
  'warn.conduitFillExceedsLimit':
    'Fill exceeds the recommended limit for this cable count.',

  // Paywall
  'paywall.cableChain': 'Chain cable sizing straight into breaker selection',
  'paywall.pdfExport': 'Export calculations to PDF',
  'paywall.unlimitedHistory': 'Unlimited calculation history',

  // App chrome: Home
  'ui.home.planBadge': 'FREE PLAN',
  'ui.home.searchPlaceholder': 'Search calculators...',
  'ui.home.noResults': 'No calculators found',
  'ui.home.soonSectionTitle': 'Soon',

  // App chrome: History
  'ui.history.title': 'History',
  'ui.history.clear': 'Clear',
  'ui.history.empty': 'No calculations yet',

  // App chrome: Projects (Pro) — named sets of saved calculations
  'ui.projects.title': 'Projects',
  'ui.projects.description': 'Keep related calculations together — e.g. motor current → cable → breaker. Carry results from one step to the next and export the whole project as a single PDF.',
  'ui.projects.empty': 'No projects yet',
  'ui.projects.newPlaceholder': 'New project name',
  'ui.projects.create': 'Create',
  'ui.projects.stepsLabel': 'Calculations',
  'ui.projects.emptySteps': 'No calculations in this project yet',
  'ui.projects.addCalculation': 'Add calculation',
  'ui.projects.addToProject': 'Add to project',
  'ui.projects.saveToProject': 'Save to project',
  'ui.projects.saved': 'Saved to project',
  'ui.projects.pickTitle': 'Choose a project',
  'ui.projects.saveError': "Couldn't save to the project. It may be full.",
  'ui.projects.limitReached': 'Project limit reached. Delete one first.',
  'ui.projects.deleteTitle': 'Delete project?',
  'ui.projects.deleteBody': 'This removes the project and all its calculations.',
  'ui.projects.delete': 'Delete',
  'ui.projects.cancel': 'Cancel',

  // App chrome: Menu ("More")
  'ui.menu.title': 'More',
  'ui.menu.manageSubscription': 'Manage subscription',
  'ui.menu.settingsRow': 'Settings',
  'ui.menu.feedback': 'Send feedback',

  // App chrome: Calculator screen — report-issue entry point (header, next to history)
  'ui.calculator.reportIssue': 'Report an issue',

  // App chrome: Paywall — most of the paywall content (headline, pricing,
  // CTA) is owned by RevenueCat's dashboard-configured template, not here.
  // These two only cover the "already subscribed" state this screen shows
  // instead of the purchase paywall.
  'ui.paywall.alreadyProTitle': "You're on Pro",
  'ui.paywall.alreadyProBody': 'All calculators are unlocked. Thanks for subscribing!',
  'ui.paywall.close': 'Close',

  // App chrome: subscriptions — fallback error shown only if presenting the
  // RevenueCat Paywall/Customer Center itself fails (e.g. native module
  // missing); purchase/restore outcomes are handled by those native UIs.
  'ui.subscriptions.errorTitle': 'Something went wrong',
  'ui.subscriptions.errorBody': 'Please try again.',

  // PDF report (generated from the calculator screen's header button)
  'pdf.inputsHeading': 'Inputs',
  'pdf.outputsHeading': 'Results',
  'pdf.generatedOn': 'Generated on',
  'pdf.warningsHeading': 'Warnings',
  'pdf.calculatedOn': 'Calculated on',
  'pdf.errorTitle': "Couldn't create PDF",
  'pdf.errorBody': 'Please try again.',

  // App chrome: Settings (language)
  'ui.common.soonBadge': 'SOON',

  'ui.settings.title': 'Settings',
  'ui.settings.languageTitle': 'Language',
  'ui.settings.systemDefault': 'Detected from device — change anytime',

  // Onboarding — brand content (BrandConfig.legalDisclaimerKey / onboarding.*)
  'legal.disclaimer':
    'Results are for reference only. Design responsibility rests with a qualified professional. Verify against standards in force in your country.',
  'onboarding.welcome.title': 'Built for IEC',
  'onboarding.welcome.body':
    'Every calculator follows IEC 60364 and European practice — not a US NEC app with unit conversion bolted on.',

  // Onboarding — app chrome (slide 2/3 UI, not brand-specific)
  'ui.onboarding.next': 'Next',
  'ui.onboarding.iUnderstand': 'I understand',
  'ui.onboarding.unitsTitle': 'Units',
  'ui.onboarding.unitsMetric': 'Metric',
  'ui.onboarding.unitsImperial': 'Imperial',
  'ui.onboarding.disclaimerTitle': 'Before you start',
};
