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
  'calc.transformerRating.desc': 'kVA, impedenza e calcoli di carico',

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

  'chainTo.breakerSelection': 'Scelta interruttore',

  'error.needExactlyTwoValues': 'Inserisci esattamente due valori noti.',
  'error.missingRequiredFields': 'Compila tutti i campi richiesti.',
  'error.noBreakerFitsInRange':
    'Nessuna taglia standard rientra tra Ip e Iz — aumenta la sezione del cavo.',
  'error.noPeSizeFitsInRange':
    "La sezione PE richiesta supera l'intervallo normalizzato.",
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

  'ui.menu.title': 'Altro',
  'ui.menu.exportPdf': 'Esporta in PDF',
  'ui.menu.restorePurchases': 'Ripristina acquisti',
  'ui.menu.settingsRow': 'Lingua',

  'ui.paywall.title': 'AmpCore Pro',
  'ui.paywall.unlockHeadline': 'Sblocca tutti i calcolatori',
  'ui.paywall.proCalculatorsSummary':
    '{{count}} calcolatori pro e cronologia illimitata',
  'ui.paywall.includesTitle': 'Include',
  'ui.paywall.ctaPlaceholder': 'Aggiorna — presto disponibile',
  'ui.paywall.noPaymentNotice':
    "Nessuna integrazione di pagamento — qui non c'è nulla da acquistare.",

  'ui.common.soonBadge': 'PRESTO',

  'ui.settings.title': 'Lingua',
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
  'ui.onboarding.unitsHint':
    'Puoi modificarlo in qualsiasi momento nelle Impostazioni',
  'ui.onboarding.unitsMetric': 'Metrico',
  'ui.onboarding.unitsImperial': 'Imperiale',
  'ui.onboarding.disclaimerTitle': 'Prima di iniziare',
};
