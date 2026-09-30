/**
 * TODO(i18n-review): AI-drafted German translation. Needs review by a native
 * or professional translator (especially electrical terminology) before
 * this locale ships to real users — see resources.test.ts for the key-parity
 * check against en.ts that keeps this file structurally in sync.
 */
export const de: Record<string, string> = {
  'formula.ohmsLaw.dc1': 'U = I · R',
  'formula.ohmsLaw.dc2': 'P = U · I',
  'formula.ohmsLaw.dc3': 'P = I² · R',
  'formula.ohmsLaw.1ph1': 'U = I · Z',
  'formula.ohmsLaw.1ph2': 'P = U · I · cosφ',
  'formula.ohmsLaw.1ph3': 'I = P / U·cosφ',
  'formula.ohmsLaw.3ph1': 'U = I · Z',
  'formula.ohmsLaw.3ph2': 'P = √3·U·I·cosφ',
  'formula.ohmsLaw.3ph3': 'I = P / √3·U·I·cosφ',

  'hint.enterAnyTwo': 'Geben Sie zwei beliebige Werte zur Berechnung ein',
  'hint.oneMoreValue': 'gesetzt — geben Sie einen weiteren Wert ein',
  'hint.solvingFrom': 'Berechnung basierend auf',
  'hint.and': 'und',

  'category.fundamentals': 'Elektrotechnische Grundlagen',
  'category.cable-wiring': 'Kabel & Verkabelung',
  'category.motors-drives': 'Motoren & Antriebe',
  'category.protection-coordination': 'Schutz & Koordination',

  'calc.ohmsLaw.title': 'Ohmsches Gesetz',
  'calc.ohmsLaw.desc':
    'U, I, R, P für Gleich- und Wechselstromsysteme berechnen',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Leistung zu Strom für DC, 1-phasig und 3-phasig',
  'calc.cableSizing.title': 'Kabeldimensionierung',
  'calc.cableSizing.desc': 'Querschnittswahl nach IEC 60364-5-52',
  'calc.voltageDrop.title': 'Spannungsfall',
  'calc.voltageDrop.desc': 'ΔU über Kabellänge und Last',
  'calc.conduitFill.title': 'Rohrfüllung',
  'calc.conduitFill.desc': 'Kabelfüllgrad % für RL-Rohrgrößen',
  'calc.motorCurrent.title': 'Motorstrom',
  'calc.motorCurrent.desc': 'Nenn- und Anlaufstrom — IEC 60034',
  'calc.breakerSelection.title': 'Sicherungsauswahl',
  'calc.breakerSelection.desc':
    'LS-Schalter-Nennstrom aus Ip und Iz — EN 60898',
  'calc.peConductor.title': 'PE-Leiter',
  'calc.peConductor.desc': 'Schutzleiterdimensionierung — IEC 60364-5-54',

  'calc.powerFactor.title': 'Leistungsfaktor',
  'calc.powerFactor.desc': 'Wirk-, Blind- und Scheinleistung',
  'calc.shortCircuit.title': 'Kurzschlussstrom',
  'calc.shortCircuit.desc': 'Voraussichtlicher Isc am Installationsort',
  'calc.transformerRating.title': 'Transformatorauslegung',
  'calc.transformerRating.desc': 'kVA, Impedanz und Lastberechnungen',

  'field.system': 'System',
  'field.voltage': 'Spannung',
  'field.current': 'Strom',
  'field.resistance': 'Widerstand',
  'field.impedance': 'Impedanz',
  'field.power': 'Leistung',
  'field.cosPhi': 'Leistungsfaktor',
  'field.length': 'Länge',
  'field.crossSection': 'Querschnitt',
  'field.temperature': 'Temperatur',
  'field.material': 'Material',

  'field.nominalCurrent': 'Nennstrom',
  'field.efficiency': 'Wirkungsgrad',
  'field.startupCurrentMin': 'Anlaufstrom (min)',
  'field.startupCurrentMax': 'Anlaufstrom (max)',

  'field.insulation': 'Isolierung',
  'field.conductorTemperature': 'Leitertemperatur',
  'field.voltageDrop': 'Spannungsfall',
  'field.voltageDropPercent': 'Spannungsfall %',
  'field.loadType': 'Lastart',
  'field.loadCurrent': 'Laststrom',
  'field.installMethod': 'Verlegeart',
  'field.ambientTemperature': 'Umgebungstemperatur',
  'field.grouping': 'Gruppierung',
  'field.designCurrent': 'Bemessungsstrom',
  'field.requiredAmpacity': 'Erforderliche Strombelastbarkeit',
  'field.tableAmpacity': 'Tabellenstrombelastbarkeit',
  'field.ampacityMargin': 'Reserve',

  'field.breakerRating': 'Sicherungsnennstrom',

  'field.method': 'Methode',
  'field.faultCurrent': 'Fehlerstrom',
  'field.disconnectionTime': 'Abschaltzeit',
  'field.kFactor': 'Materialfaktor (k)',
  'field.phaseSection': 'Querschnitt Außenleiter',
  'field.requiredPeSection': 'Erforderlicher PE-Querschnitt',
  'field.standardPeSection': 'Genormter PE-Querschnitt',

  'field.conduitDiameter': 'Rohrinnendurchmesser',
  'field.cableCount': 'Anzahl Kabel',
  'field.totalCableArea': 'Gesamtkabelfläche',
  'field.conduitFillPercent': 'Füllgrad',
  'field.conduitFillLimit': 'Füllgrenze',

  'system.dc': 'DC',
  'system.1ph': '1-phasig',
  'system.3ph': '3-phasig',

  'material.cu': 'Cu',
  'material.al': 'Al',

  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Rohr in wärmedämmender Wand',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Rohr auf Wand oder im Kabelkanal',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Direkt auf Mauerwerk geklemmt',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Kabelrinne oder freie Luft',

  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  'grouping.1': '1 Stromkreis',
  'grouping.2': '2 Stromkreise',
  'grouping.3': '3 Stromkreise',
  'grouping.4': '4 Stromkreise',
  'grouping.5': '5 Stromkreise',
  'grouping.6plus': '6+ Stromkreise',

  'loadType.power': 'Leistung',
  'loadType.current': 'Strom',

  'peMethod.adiabatic': 'Adiabatisch',
  'peMethod.simplified': 'Vereinfacht',

  'peKFactor.Cu_sep': 'Cu, getrennt (k=143)',
  'peKFactor.Cu_cable': 'Cu, im Kabel (k=115)',
  'peKFactor.Al_cable': 'Al, im Kabel (k=76)',

  'chainTo.breakerSelection': 'Sicherungsauswahl',

  'error.needExactlyTwoValues': 'Geben Sie genau zwei bekannte Werte ein.',
  'error.missingRequiredFields': 'Füllen Sie alle Pflichtfelder aus.',
  'error.noBreakerFitsInRange':
    'Kein Normnennstrom passt zwischen Ip und Iz — Kabelquerschnitt vergrößern.',
  'error.noPeSizeFitsInRange':
    'Erforderlicher PE-Querschnitt überschreitet den Normbereich.',
  'warn.divisionByZero':
    'Prüfen Sie Ihre Eingaben — einer der Werte führt zu einer Division durch null.',
  'warn.voltageDropExceedsIec':
    'Spannungsfall überschreitet die 5%-IEC-Empfehlung.',
  'warn.cableSizingNoTableFit':
    'Kein Normquerschnitt deckt diese Last vollständig ab — größter verfügbarer Querschnitt angezeigt.',
  'info.largeSectionReactanceIgnored':
    'Querschnitt über 50mm² — Reaktanz wird in dieser Formel nicht berücksichtigt.',
  'warn.conduitFillExceedsLimit':
    'Füllgrad überschreitet die empfohlene Grenze für diese Kabelanzahl.',

  'paywall.cableChain':
    'Kabeldimensionierung direkt mit der Sicherungsauswahl verketten',
  'paywall.pdfExport': 'Berechnungen als PDF exportieren',
  'paywall.unlimitedHistory': 'Unbegrenzter Berechnungsverlauf',

  'ui.home.planBadge': 'KOSTENLOSER PLAN',
  'ui.home.searchPlaceholder': 'Rechner suchen...',
  'ui.home.noResults': 'Keine Rechner gefunden',
  'ui.home.soonSectionTitle': 'Demnächst',

  'ui.history.title': 'Verlauf',
  'ui.history.clear': 'Löschen',
  'ui.history.empty': 'Noch keine Berechnungen',

  // App chrome: Projects (Pro) — named sets of saved calculations
  'ui.projects.title': 'Projekte',
  'ui.projects.description': 'Fasse zusammengehörige Berechnungen zusammen — z. B. Motorstrom → Kabel → Sicherung. Übernimm Ergebnisse von Schritt zu Schritt und exportiere das ganze Projekt als ein PDF.',
  'ui.projects.empty': 'Noch keine Projekte',
  'ui.projects.newPlaceholder': 'Name des neuen Projekts',
  'ui.projects.create': 'Erstellen',
  'ui.projects.stepsLabel': 'Berechnungen',
  'ui.projects.emptySteps': 'Dieses Projekt enthält noch keine Berechnungen',
  'ui.projects.addCalculation': 'Berechnung hinzufügen',
  'ui.projects.addToProject': 'Zum Projekt hinzufügen',
  'ui.projects.saveToProject': 'Im Projekt speichern',
  'ui.projects.saved': 'Im Projekt gespeichert',
  'ui.projects.pickTitle': 'Projekt auswählen',
  'ui.projects.saveError': 'Speichern im Projekt fehlgeschlagen. Es ist möglicherweise voll.',
  'ui.projects.limitReached': 'Projektlimit erreicht. Lösche zuerst eines.',
  'ui.projects.deleteTitle': 'Projekt löschen?',
  'ui.projects.deleteBody': 'Das Projekt und alle seine Berechnungen werden entfernt.',
  'ui.projects.delete': 'Löschen',
  'ui.projects.cancel': 'Abbrechen',

  'ui.menu.title': 'Mehr',
  'ui.menu.manageSubscription': 'Abo verwalten',
  'ui.menu.settingsRow': 'Einstellungen',
  'ui.menu.feedback': 'Feedback senden',
  'ui.calculator.reportIssue': 'Problem melden',

  'ui.paywall.alreadyProTitle': 'Du hast Pro',
  'ui.paywall.alreadyProBody': 'Alle Rechner sind freigeschaltet. Danke für dein Abo!',
  'ui.paywall.close': 'Schließen',

  'ui.subscriptions.errorTitle': 'Etwas ist schiefgelaufen',
  'ui.subscriptions.errorBody': 'Bitte versuche es erneut.',

  // PDF report (generated from the calculator screen's header button)
  'pdf.inputsHeading': 'Eingaben',
  'pdf.outputsHeading': 'Ergebnisse',
  'pdf.generatedOn': 'Erstellt am',
  'pdf.warningsHeading': 'Hinweise',
  'pdf.calculatedOn': 'Berechnet am',
  'pdf.errorTitle': 'PDF konnte nicht erstellt werden',
  'pdf.errorBody': 'Bitte versuche es erneut.',

  'ui.common.soonBadge': 'DEMNÄCHST',

  'ui.settings.title': 'Einstellungen',
  'ui.settings.languageTitle': 'Sprache',
  'ui.settings.systemDefault': 'Vom Gerät erkannt — jederzeit änderbar',

  'legal.disclaimer':
    'Ergebnisse dienen nur als Referenz. Die Planungsverantwortung liegt bei einer qualifizierten Fachkraft. Prüfen Sie die in Ihrem Land geltenden Normen.',
  'onboarding.welcome.title': 'Für IEC entwickelt',
  'onboarding.welcome.body':
    'Jeder Rechner folgt IEC 60364 und europäischer Praxis — keine US-NEC-App mit angeflanschter Einheitenumrechnung.',

  'ui.onboarding.next': 'Weiter',
  'ui.onboarding.iUnderstand': 'Verstanden',
  'ui.onboarding.unitsTitle': 'Einheiten',
  'ui.onboarding.unitsMetric': 'Metrisch',
  'ui.onboarding.unitsImperial': 'Imperial',
  'ui.onboarding.disclaimerTitle': 'Bevor Sie beginnen',
};
