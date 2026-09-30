/**
 * TODO(i18n-review): AI-drafted Italian translation. Needs review by a native
 * or professional translator (especially electrical terminology) before
 * this locale ships to real users — see resources.test.ts for the key-parity
 * check against en.ts that keeps this file structurally in sync.
 */
export const it: Record<string, string> = {
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

  'hint.enterAnyTwo': 'Inserisci due valori qualsiasi per calcolare',
  'hint.oneMoreValue': 'impostato — inserisci un altro valore',
  'hint.solvingFrom': 'Calcolo basato su',
  'hint.and': 'e',

  'category.fundamentals': 'Fondamenti elettrici',
  'category.cable-wiring': 'Cavi e cablaggio',
  'category.motors-drives': 'Motori e azionamenti',
  'category.protection-coordination': 'Protezione e coordinamento',

  'calc.ohmsLaw.title': 'Legge di Ohm',
  'calc.ohmsLaw.desc': 'Calcola U, I, R, P per sistemi CC e CA',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Potenza in corrente per DC, monofase e trifase',
  'calc.cableSizing.title': 'Dimensionamento cavi',
  'calc.cableSizing.desc': 'Scelta della sezione secondo IEC 60364-5-52',
  'calc.voltageDrop.title': 'Caduta di tensione',
  'calc.voltageDrop.desc': 'ΔU sulla lunghezza del cavo e sul carico',
  'calc.conduitFill.title': 'Riempimento tubo',
  'calc.conduitFill.desc': '% di riempimento per tubi RL',
  'calc.motorCurrent.title': 'Corrente motore',
  'calc.motorCurrent.desc': 'Corrente nominale e di avviamento — IEC 60034',
  'calc.breakerSelection.title': 'Scelta interruttore',
  'calc.breakerSelection.desc': 'Taglia MCB da Ip e Iz — EN 60898',
  'calc.peConductor.title': 'Conduttore PE',
  'calc.peConductor.desc':
    'Dimensionamento del conduttore di protezione — IEC 60364-5-54',

  'calc.powerFactor.title': 'Fattore di potenza',
  'calc.powerFactor.desc': 'Potenza attiva, reattiva e apparente',
  'calc.shortCircuit.title': 'Corrente di cortocircuito',
  'calc.shortCircuit.desc': 'Icc prevista nel punto di installazione',
  'calc.transformerRating.title': 'Dimensionamento trasformatore',
  'calc.transformerRating.desc': 'Potenza kVA standard e correnti nominali',
  'calc.pfCorrection.title': 'Rifasamento',
  'calc.pfCorrection.desc': 'Potenza dei condensatori per un cos φ obiettivo',
  'calc.earthLoop.title': 'Anello di guasto',
  'calc.earthLoop.desc': "Zs e verifica dell'interruzione automatica — IEC 60364",

  'field.system': 'Sistema',
  'field.voltage': 'Tensione',
  'field.current': 'Corrente',
  'field.resistance': 'Resistenza',
  'field.impedance': 'Impedenza',
  'field.power': 'Potenza',
  'field.cosPhi': 'Fattore di potenza',
  'field.length': 'Lunghezza',
  'field.crossSection': 'Sezione',
  'field.temperature': 'Temperatura',
  'field.material': 'Materiale',

  'field.nominalCurrent': 'Corrente nominale',
  'field.efficiency': 'Efficienza',
  'field.startupCurrentMin': 'Corrente di avviamento (min)',
  'field.startupCurrentMax': 'Corrente di avviamento (max)',

  'field.insulation': 'Isolamento',
  'field.conductorTemperature': 'Temperatura del conduttore',
  'field.voltageDrop': 'Caduta di tensione',
  'field.voltageDropPercent': 'Caduta di tensione %',
  'field.loadType': 'Tipo di carico',
  'field.loadCurrent': 'Corrente di carico',
  'field.installMethod': 'Metodo di posa',
  'field.ambientTemperature': 'Temperatura ambiente',
  'field.grouping': 'Raggruppamento',
  'field.designCurrent': 'Corrente di impiego',
  'field.requiredAmpacity': 'Portata richiesta',
  'field.tableAmpacity': 'Portata da tabella',
  'field.ampacityMargin': 'Margine',

  'field.breakerRating': 'Taglia interruttore',

  'field.method': 'Metodo',
  'field.faultCurrent': 'Corrente di guasto',
  'field.disconnectionTime': 'Tempo di interruzione',
  'field.kFactor': 'Fattore materiale (k)',
  'field.phaseSection': 'Sezione conduttore di fase',
  'field.requiredPeSection': 'Sezione PE richiesta',
  'field.standardPeSection': 'Sezione PE normalizzata',

  'field.conduitDiameter': 'Diametro interno del tubo',
  'field.cableCount': 'Numero di cavi',
  'field.totalCableArea': 'Area totale dei cavi',
  'field.conduitFillPercent': 'Riempimento',
  'field.conduitFillLimit': 'Limite di riempimento',

  // Power factor / compensation / transformer / short-circuit / earth loop
  'field.reactivePower': 'Potenza reattiva',
  'field.apparentPower': 'Potenza apparente',
  'field.targetCosPhi': 'Fattore di potenza obiettivo',
  'field.compensationPower': 'Potenza di rifasamento',
  'field.apparentPowerBefore': 'Potenza apparente prima',
  'field.apparentPowerAfter': 'Potenza apparente dopo',
  'field.currentReduction': 'Riduzione della corrente',
  'field.reservePercent': 'Riserva',
  'field.primaryVoltage': 'Tensione primaria',
  'field.secondaryVoltage': 'Tensione secondaria',
  'field.requiredApparentPower': 'Potenza apparente richiesta',
  'field.ratedApparentPower': 'Potenza standard del trasformatore',
  'field.transformerLoad': 'Carico a questa potenza',
  'field.primaryCurrent': 'Corrente nominale primaria',
  'field.secondaryCurrent': 'Corrente nominale secondaria',
  'field.transformerPower': 'Potenza del trasformatore',
  'field.ukPercent': 'Tensione di cortocircuito uk',
  'field.networkPower': 'Potenza di cortocircuito della rete',
  'field.shortCircuitSource': 'Ik″ al trasformatore',
  'field.shortCircuitEnd': 'Ik″ a fine cavo',
  'field.totalImpedance': 'Impedenza a fine cavo',
  'field.earthVoltage': 'Tensione fase–terra',
  'field.externalImpedance': "Impedenza esterna dell'anello Ze",
  'field.peSection': 'Sezione del conduttore PE',
  'field.tripCurve': 'Curva di sgancio',
  'field.loopResistance': "Resistenza dei conduttori dell'anello",
  'field.earthLoopImpedance': "Impedenza dell'anello Zs",
  'field.maxLoopImpedance': 'Zs massima ammessa',

  'system.dc': 'CC',
  'system.1ph': 'Monofase',
  'system.3ph': 'Trifase',

  'material.cu': 'Cu',
  'material.al': 'Al',

  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Tubo in parete termicamente isolante',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Tubo a parete o in canalina',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Fissato direttamente su muratura',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Passerella portacavi o aria libera',

  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  'grouping.1': '1 circuito',
  'grouping.2': '2 circuiti',
  'grouping.3': '3 circuiti',
  'grouping.4': '4 circuiti',
  'grouping.5': '5 circuiti',
  'grouping.6plus': '6+ circuiti',

  'loadType.power': 'Potenza',
  'loadType.current': 'Corrente',

  'peMethod.adiabatic': 'Adiabatico',
  'peMethod.simplified': 'Semplificato',

  'peKFactor.Cu_sep': 'Cu, separato (k=143)',
  'peKFactor.Cu_cable': 'Cu, nel cavo (k=115)',
  'peKFactor.Al_cable': 'Al, nel cavo (k=76)',

  'tripCurve.B': 'B (3–5 × In)',
  'tripCurve.C': 'C (5–10 × In)',
  'tripCurve.D': 'D (10–20 × In)',

  'chainTo.breakerSelection': 'Scelta interruttore',

  'error.needExactlyTwoValues': 'Inserisci esattamente due valori noti.',
  'error.missingRequiredFields': 'Compila tutti i campi richiesti.',
  'error.noBreakerFitsInRange':
    'Nessuna taglia standard rientra tra Ip e Iz — aumenta la sezione del cavo.',
  'error.noPeSizeFitsInRange':
    "La sezione PE richiesta supera l'intervallo normalizzato.",
  'error.apparentPowerTooSmall': 'La potenza apparente non può essere inferiore alla potenza attiva o reattiva.',
  'error.cosPhiOutOfRange': 'Il fattore di potenza deve essere compreso tra 0,01 e 1.',
  'error.noTransformerFitsInRange': 'Il carico supera la potenza standard massima (2500 kVA) — suddividilo su più trasformatori.',
  'info.pfAlreadyAtTarget': "Il fattore di potenza è già pari o superiore all'obiettivo — nessun rifasamento necessario.",
  'warn.earthLoopTooHigh': "L'impedenza dell'anello supera il massimo per questo interruttore — potrebbe non sganciare istantaneamente. Aumenta la sezione, accorcia la linea o aggiungi un differenziale.",
  'warn.divisionByZero':
    'Controlla i tuoi valori — uno di essi porta a una divisione per zero.',
  'warn.voltageDropExceedsIec':
    'La caduta di tensione supera la linea guida IEC del 5%.',
  'warn.cableSizingNoTableFit':
    'Nessuna sezione standard copre completamente questo carico — mostrata la sezione disponibile più grande.',
  'info.largeSectionReactanceIgnored':
    'Sezione superiore a 50mm² — la reattanza non è considerata in questa formula.',
  'warn.conduitFillExceedsLimit':
    'Il riempimento supera il limite raccomandato per questo numero di cavi.',

  'paywall.cableChain':
    "Collega il dimensionamento cavi direttamente alla scelta dell'interruttore",
  'paywall.pdfExport': 'Esporta i calcoli in PDF',
  'paywall.unlimitedHistory': 'Cronologia calcoli illimitata',

  'ui.home.planBadge': 'PIANO GRATUITO',
  'ui.home.searchPlaceholder': 'Cerca calcolatori...',
  'ui.home.noResults': 'Nessun calcolatore trovato',
  'ui.home.soonSectionTitle': 'Presto',

  'ui.history.title': 'Cronologia',
  'ui.history.clear': 'Cancella',
  'ui.history.empty': 'Ancora nessun calcolo',

  // App chrome: Projects (Pro) — named sets of saved calculations
  'ui.projects.title': 'Progetti',
  'ui.projects.description': "Tieni insieme i calcoli collegati — ad es. corrente del motore → cavo → interruttore. Porta i risultati da un passaggio al successivo ed esporta l'intero progetto in un unico PDF.",
  'ui.projects.empty': 'Nessun progetto',
  'ui.projects.newPlaceholder': 'Nome del nuovo progetto',
  'ui.projects.create': 'Crea',
  'ui.projects.stepsLabel': 'Calcoli',
  'ui.projects.emptySteps': 'Questo progetto non contiene ancora calcoli',
  'ui.projects.addCalculation': 'Aggiungi calcolo',
  'ui.projects.addToProject': 'Aggiungi al progetto',
  'ui.projects.saveToProject': 'Salva nel progetto',
  'ui.projects.saved': 'Salvato nel progetto',
  'ui.projects.pickTitle': 'Scegli un progetto',
  'ui.projects.saveError': 'Impossibile salvare nel progetto. Potrebbe essere pieno.',
  'ui.projects.limitReached': 'Limite di progetti raggiunto. Eliminane uno prima.',
  'ui.projects.deleteTitle': 'Eliminare il progetto?',
  'ui.projects.deleteBody': 'Il progetto e tutti i suoi calcoli verranno rimossi.',
  'ui.projects.delete': 'Elimina',
  'ui.projects.cancel': 'Annulla',

  'ui.menu.title': 'Altro',
  'ui.menu.manageSubscription': 'Gestisci abbonamento',
  'ui.menu.settingsRow': 'Impostazioni',
  'ui.menu.feedback': 'Invia feedback',
  'ui.calculator.reportIssue': 'Segnala un problema',

  'ui.paywall.alreadyProTitle': 'Hai Pro',
  'ui.paywall.alreadyProBody': "Tutti i calcolatori sono sbloccati. Grazie per l'abbonamento!",
  'ui.paywall.close': 'Chiudi',

  'ui.subscriptions.errorTitle': 'Qualcosa è andato storto',
  'ui.subscriptions.errorBody': 'Riprova.',

  // PDF report (generated from the calculator screen's header button)
  'pdf.inputsHeading': 'Dati inseriti',
  'pdf.outputsHeading': 'Risultati',
  'pdf.generatedOn': 'Generato il',
  'pdf.warningsHeading': 'Avvisi',
  'pdf.calculatedOn': 'Calcolato il',
  'pdf.errorTitle': 'Impossibile creare il PDF',
  'pdf.errorBody': 'Riprova.',

  'ui.common.soonBadge': 'PRESTO',

  'ui.settings.title': 'Impostazioni',
  'ui.settings.languageTitle': 'Lingua',
  'ui.settings.systemDefault':
    'Rilevata dal dispositivo — modificabile in qualsiasi momento',

  'legal.disclaimer':
    'I risultati sono solo a titolo indicativo. La responsabilità progettuale spetta a un professionista qualificato. Verifica le norme in vigore nel tuo paese.',
  'onboarding.welcome.title': 'Progettato per la IEC',
  'onboarding.welcome.body':
    "Ogni calcolatore segue la IEC 60364 e la prassi europea — non un'app NEC americana con la conversione delle unità aggiunta in un secondo momento.",

  'ui.onboarding.next': 'Avanti',
  'ui.onboarding.iUnderstand': 'Ho capito',
  'ui.onboarding.unitsTitle': 'Unità',
  'ui.onboarding.unitsMetric': 'Metrico',
  'ui.onboarding.unitsImperial': 'Imperiale',
  'ui.onboarding.disclaimerTitle': 'Prima di iniziare',
};
