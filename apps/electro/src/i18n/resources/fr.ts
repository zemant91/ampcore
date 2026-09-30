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
  'calc.transformerRating.desc': 'Puissance kVA normalisée et courants nominaux',
  'calc.pfCorrection.title': 'Compensation du cos φ',
  'calc.pfCorrection.desc': 'Puissance des condensateurs pour un cos φ cible',
  'calc.earthLoop.title': 'Boucle de défaut',
  'calc.earthLoop.desc': 'Zs et vérification du déclenchement automatique — IEC 60364',

  'field.system': 'Système',
  'field.voltage': 'Tension',
  'field.current': 'Courant',
  'field.resistance': 'Résistance',
  'field.impedance': 'Impédance',
  'field.power': 'Puissance',
  'field.cosPhi': 'Facteur de puissance',
  'field.length': 'Longueur',
  'field.crossSection': 'Section',
  'field.temperature': 'Température',
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

  // Power factor / compensation / transformer / short-circuit / earth loop
  'field.reactivePower': 'Puissance réactive',
  'field.apparentPower': 'Puissance apparente',
  'field.targetCosPhi': 'Facteur de puissance cible',
  'field.compensationPower': 'Puissance de compensation',
  'field.apparentPowerBefore': 'Puissance apparente avant',
  'field.apparentPowerAfter': 'Puissance apparente après',
  'field.currentReduction': 'Réduction du courant',
  'field.reservePercent': 'Réserve',
  'field.primaryVoltage': 'Tension primaire',
  'field.secondaryVoltage': 'Tension secondaire',
  'field.requiredApparentPower': 'Puissance apparente requise',
  'field.ratedApparentPower': 'Puissance normalisée du transformateur',
  'field.transformerLoad': 'Charge à cette puissance',
  'field.primaryCurrent': 'Courant nominal primaire',
  'field.secondaryCurrent': 'Courant nominal secondaire',
  'field.transformerPower': 'Puissance du transformateur',
  'field.ukPercent': 'Tension de court-circuit uk',
  'field.networkPower': 'Puissance de court-circuit du réseau',
  'field.shortCircuitSource': 'Ik″ au transformateur',
  'field.shortCircuitEnd': 'Ik″ en bout de câble',
  'field.totalImpedance': 'Impédance en bout de câble',
  'field.earthVoltage': 'Tension phase–terre',
  'field.externalImpedance': 'Impédance de boucle amont Ze',
  'field.peSection': 'Section du conducteur PE',
  'field.tripCurve': 'Courbe de déclenchement',
  'field.loopResistance': 'Résistance des conducteurs de la boucle',
  'field.earthLoopImpedance': 'Impédance de boucle Zs',
  'field.maxLoopImpedance': 'Zs maximale admissible',

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

  'tripCurve.B': 'B (3–5 × In)',
  'tripCurve.C': 'C (5–10 × In)',
  'tripCurve.D': 'D (10–20 × In)',

  'chainTo.breakerSelection': 'Choix du disjoncteur',

  'error.needExactlyTwoValues': 'Entrez exactement deux valeurs connues.',
  'error.missingRequiredFields': 'Remplissez tous les champs requis.',
  'error.noBreakerFitsInRange':
    'Aucun calibre standard ne convient entre Ip et Iz — augmentez la section du câble.',
  'error.noPeSizeFitsInRange':
    'La section PE requise dépasse la plage normalisée.',
  'error.apparentPowerTooSmall': 'La puissance apparente ne peut pas être inférieure à la puissance active ou réactive.',
  'error.cosPhiOutOfRange': 'Le facteur de puissance doit être compris entre 0,01 et 1.',
  'error.noTransformerFitsInRange': 'La charge dépasse la plus grande puissance normalisée (2500 kVA) — répartissez-la sur plusieurs transformateurs.',
  'info.pfAlreadyAtTarget': 'Le facteur de puissance atteint déjà la cible — aucune compensation nécessaire.',
  'warn.earthLoopTooHigh': "L'impédance de boucle dépasse le maximum pour ce disjoncteur — il peut ne pas déclencher instantanément. Augmentez la section, raccourcissez la ligne ou ajoutez un DDR.",
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

  // App chrome: Projects (Pro) — named sets of saved calculations
  'ui.projects.title': 'Projets',
  'ui.projects.description': "Regroupez les calculs liés — p. ex. courant du moteur → câble → disjoncteur. Reportez les résultats d'une étape à l'autre et exportez tout le projet en un seul PDF.",
  'ui.projects.empty': "Aucun projet pour l'instant",
  'ui.projects.newPlaceholder': 'Nom du nouveau projet',
  'ui.projects.create': 'Créer',
  'ui.projects.stepsLabel': 'Calculs',
  'ui.projects.emptySteps': 'Ce projet ne contient encore aucun calcul',
  'ui.projects.addCalculation': 'Ajouter un calcul',
  'ui.projects.addToProject': 'Ajouter au projet',
  'ui.projects.saveToProject': 'Enregistrer dans le projet',
  'ui.projects.saved': 'Enregistré dans le projet',
  'ui.projects.pickTitle': 'Choisir un projet',
  'ui.projects.saveError': "Impossible d'enregistrer dans le projet. Il est peut-être plein.",
  'ui.projects.limitReached': "Limite de projets atteinte. Supprimez-en un d'abord.",
  'ui.projects.deleteTitle': 'Supprimer le projet ?',
  'ui.projects.deleteBody': 'Le projet et tous ses calculs seront supprimés.',
  'ui.projects.delete': 'Supprimer',
  'ui.projects.cancel': 'Annuler',

  'ui.menu.title': 'Plus',
  'ui.menu.manageSubscription': "Gérer l'abonnement",
  'ui.menu.settingsRow': 'Paramètres',
  'ui.menu.feedback': 'Envoyer un commentaire',
  'ui.calculator.reportIssue': 'Signaler un problème',

  'ui.paywall.alreadyProTitle': 'Vous avez Pro',
  'ui.paywall.alreadyProBody': 'Tous les calculateurs sont débloqués. Merci pour votre abonnement !',
  'ui.paywall.close': 'Fermer',

  'ui.subscriptions.errorTitle': 'Un problème est survenu',
  'ui.subscriptions.errorBody': 'Veuillez réessayer.',

  // PDF report (generated from the calculator screen's header button)
  'pdf.inputsHeading': 'Entrées',
  'pdf.outputsHeading': 'Résultats',
  'pdf.generatedOn': 'Généré le',
  'pdf.warningsHeading': 'Avertissements',
  'pdf.calculatedOn': 'Calculé le',
  'pdf.errorTitle': 'Impossible de créer le PDF',
  'pdf.errorBody': 'Veuillez réessayer.',

  'ui.common.soonBadge': 'BIENTÔT',

  'ui.settings.title': 'Paramètres',
  'ui.settings.languageTitle': 'Langue',
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
  'ui.onboarding.unitsMetric': 'Métrique',
  'ui.onboarding.unitsImperial': 'Impérial',
  'ui.onboarding.disclaimerTitle': 'Avant de commencer',
};
