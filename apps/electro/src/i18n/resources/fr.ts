/**
 * TODO(i18n-review): AI-drafted French translation. Needs review by a native
 * or professional translator (especially electrical terminology) before
 * this locale ships to real users — see resources.test.ts for the key-parity
 * check against en.ts that keeps this file structurally in sync.
 */
export const fr: Record<string, string> = {
  'formula.ohmsLaw.dc1': 'U = I · R',
  'formula.ohmsLaw.dc2': 'P = U · I',
  'formula.ohmsLaw.dc3': 'P = I² · R',
  'formula.ohmsLaw.1ph1': 'U = I · Z',
  'formula.ohmsLaw.1ph2': 'P = U · I · cosφ',
  'formula.ohmsLaw.1ph3': 'I = P / U·cosφ',
  'formula.ohmsLaw.3ph1': 'U = I · Z',
  'formula.ohmsLaw.3ph2': 'P = √3·U·I·cosφ',
  'formula.ohmsLaw.3ph3': 'I = P / √3·U·I·cosφ',

  'hint.enterAnyTwo': 'Entrez deux valeurs quelconques pour calculer',
  'hint.oneMoreValue': 'défini — entrez une valeur de plus',
  'hint.solvingFrom': 'Calcul à partir de',
  'hint.and': 'et',

  'category.fundamentals': 'Fondamentaux électriques',
  'category.cable-wiring': 'Câbles & câblage',
  'category.motors-drives': 'Moteurs & entraînements',
  'category.protection-coordination': 'Protection & coordination',

  'calc.ohmsLaw.title': "Loi d'Ohm",
  'calc.ohmsLaw.desc': 'Calculez U, I, R, P pour les systèmes CC et CA',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Puissance vers courant pour DC, monophasé et triphasé',
  'calc.cableSizing.title': 'Dimensionnement de câble',
  'calc.cableSizing.desc': 'Choix de section selon CEI 60364-5-52',
  'calc.voltageDrop.title': 'Chute de tension',
  'calc.voltageDrop.desc': 'ΔU sur la longueur du câble et la charge',
  'calc.conduitFill.title': 'Remplissage de conduit',
  'calc.conduitFill.desc': '% de remplissage pour conduits RL',
  'calc.motorCurrent.title': 'Courant moteur',
  'calc.motorCurrent.desc': 'Courant nominal et de démarrage — CEI 60034',
  'calc.breakerSelection.title': 'Choix du disjoncteur',
  'calc.breakerSelection.desc':
    "Calibre du disjoncteur d'après Ip et Iz — EN 60898",
  'calc.peConductor.title': 'Conducteur PE',
  'calc.peConductor.desc':
    'Dimensionnement du conducteur de protection — CEI 60364-5-54',

  'calc.powerFactor.title': 'Facteur de puissance',
  'calc.powerFactor.desc': 'Puissance active, réactive et apparente',
  'calc.shortCircuit.title': 'Courant de court-circuit',
  'calc.shortCircuit.desc': "Isc prévisionnel au point d'installation",
  'calc.transformerRating.title': 'Dimensionnement de transformateur',
  'calc.transformerRating.desc': 'kVA, impédance et calculs de charge',

  'field.system': 'Système',
  'field.voltage': 'Tension',
  'field.current': 'Courant',
  'field.resistance': 'Résistance',
  'field.impedance': 'Impédance',
  'field.power': 'Puissance',
  'field.cosPhi': 'Facteur de puissance',
  'field.length': 'Longueur',
  'field.crossSection': 'Section',
  'field.material': 'Matériau',

  'field.nominalCurrent': 'Courant nominal',
  'field.efficiency': 'Rendement',
  'field.startupCurrentMin': 'Courant de démarrage (min)',
  'field.startupCurrentMax': 'Courant de démarrage (max)',

  'field.insulation': 'Isolation',
  'field.conductorTemperature': 'Température du conducteur',
  'field.voltageDrop': 'Chute de tension',
  'field.voltageDropPercent': 'Chute de tension %',
  'field.loadType': 'Type de charge',
  'field.loadCurrent': 'Courant de charge',
  'field.installMethod': 'Mode de pose',
  'field.ambientTemperature': 'Température ambiante',
  'field.grouping': 'Groupement',
  'field.designCurrent': "Courant d'emploi",
  'field.requiredAmpacity': 'Ampacité requise',
  'field.tableAmpacity': 'Ampacité tabulée',
  'field.ampacityMargin': 'Marge',

  'field.breakerRating': 'Calibre du disjoncteur',

  'field.method': 'Méthode',
  'field.faultCurrent': 'Courant de défaut',
  'field.disconnectionTime': 'Temps de coupure',
  'field.kFactor': 'Facteur matériau (k)',
  'field.phaseSection': 'Section du conducteur de phase',
  'field.requiredPeSection': 'Section PE requise',
  'field.standardPeSection': 'Section PE normalisée',

  'field.conduitDiameter': 'Diamètre intérieur du conduit',
  'field.cableCount': 'Nombre de câbles',
  'field.totalCableArea': 'Surface totale des câbles',
  'field.conduitFillPercent': 'Remplissage',
  'field.conduitFillLimit': 'Limite de remplissage',

  'system.dc': 'CC',
  'system.1ph': 'Monophasé',
  'system.3ph': 'Triphasé',

  'material.cu': 'Cu',
  'material.al': 'Al',

  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Conduit dans une paroi thermiquement isolante',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Conduit sur mur ou en goulotte',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Fixé directement sur maçonnerie',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Chemin de câbles ou air libre',

  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  'grouping.1': '1 circuit',
  'grouping.2': '2 circuits',
  'grouping.3': '3 circuits',
  'grouping.4': '4 circuits',
  'grouping.5': '5 circuits',
  'grouping.6plus': '6+ circuits',

  'loadType.power': 'Puissance',
  'loadType.current': 'Courant',

  'peMethod.adiabatic': 'Adiabatique',
  'peMethod.simplified': 'Simplifiée',

  'peKFactor.Cu_sep': 'Cu, séparé (k=143)',
  'peKFactor.Cu_cable': 'Cu, dans le câble (k=115)',
  'peKFactor.Al_cable': 'Al, dans le câble (k=76)',

  'chainTo.breakerSelection': 'Choix du disjoncteur',

  'error.needExactlyTwoValues': 'Entrez exactement deux valeurs connues.',
  'error.missingRequiredFields': 'Remplissez tous les champs requis.',
  'error.noBreakerFitsInRange':
    'Aucun calibre standard ne convient entre Ip et Iz — augmentez la section du câble.',
  'error.noPeSizeFitsInRange':
    'La section PE requise dépasse la plage normalisée.',
  'warn.divisionByZero':
    'Vérifiez vos entrées — une des valeurs entraîne une division par zéro.',
  'warn.voltageDropExceedsIec':
    'La chute de tension dépasse la recommandation CEI de 5%.',
  'warn.cableSizingNoTableFit':
    'Aucune section normalisée ne couvre entièrement cette charge — la plus grande section disponible est affichée.',
  'info.largeSectionReactanceIgnored':
    "Section supérieure à 50mm² — la réactance n'est pas prise en compte dans cette formule.",
  'warn.conduitFillExceedsLimit':
    'Le remplissage dépasse la limite recommandée pour ce nombre de câbles.',

  'paywall.cableChain':
    'Enchaînez le dimensionnement de câble directement au choix du disjoncteur',
  'paywall.pdfExport': 'Exporter les calculs en PDF',
  'paywall.unlimitedHistory': 'Historique de calculs illimité',

  'ui.home.planBadge': 'PLAN GRATUIT',
  'ui.home.searchPlaceholder': 'Rechercher des calculateurs...',
  'ui.home.noResults': 'Aucun calculateur trouvé',
  'ui.home.soonSectionTitle': 'Bientôt',

  'ui.history.title': 'Historique',
  'ui.history.clear': 'Effacer',
  'ui.history.empty': "Aucun calcul pour l'instant",

  'ui.menu.title': 'Plus',
  'ui.menu.exportPdf': 'Exporter en PDF',
  'ui.menu.restorePurchases': 'Restaurer les achats',
  'ui.menu.settingsRow': 'Langue',

  'ui.paywall.title': 'AmpCore Pro',
  'ui.paywall.unlockHeadline': 'Débloquez tous les calculateurs',
  'ui.paywall.proCalculatorsSummary':
    '{{count}} calculateurs pro et historique illimité',
  'ui.paywall.includesTitle': 'Inclus',
  'ui.paywall.ctaPlaceholder': 'Mise à niveau — bientôt disponible',
  'ui.paywall.noPaymentNotice':
    "Aucune intégration de paiement pour l'instant — rien à acheter ici.",

  'ui.common.soonBadge': 'BIENTÔT',

  'ui.settings.title': 'Langue',
  'ui.settings.systemDefault':
    "Détectée depuis l'appareil — modifiable à tout moment",

  'legal.disclaimer':
    'Les résultats sont fournis à titre indicatif uniquement. La responsabilité de la conception incombe à un professionnel qualifié. Vérifiez les normes en vigueur dans votre pays.',
  'onboarding.welcome.title': 'Conçu pour la CEI',
  'onboarding.welcome.body':
    "Chaque calculateur suit la CEI 60364 et les pratiques européennes — pas une application NEC américaine avec conversion d'unités greffée.",

  'ui.onboarding.next': 'Suivant',
  'ui.onboarding.iUnderstand': "J'ai compris",
  'ui.onboarding.unitsTitle': 'Unités',
  'ui.onboarding.unitsHint':
    'Vous pouvez modifier ce choix à tout moment dans les paramètres',
  'ui.onboarding.unitsMetric': 'Métrique',
  'ui.onboarding.unitsImperial': 'Impérial',
  'ui.onboarding.disclaimerTitle': 'Avant de commencer',
};
