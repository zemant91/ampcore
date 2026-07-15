/**
 * TODO(i18n-review): AI-drafted Spanish translation. Needs review by a native
 * or professional translator (especially electrical terminology) before
 * this locale ships to real users — see resources.test.ts for the key-parity
 * check against en.ts that keeps this file structurally in sync.
 */
export const es: Record<string, string> = {
  'formula.ohmsLaw.dc1': 'U = I · R',
  'formula.ohmsLaw.dc2': 'P = U · I',
  'formula.ohmsLaw.dc3': 'P = I² · R',
  'formula.ohmsLaw.1ph1': 'U = I · Z',
  'formula.ohmsLaw.1ph2': 'P = U · I · cosφ',
  'formula.ohmsLaw.1ph3': 'I = P / U·cosφ',
  'formula.ohmsLaw.3ph1': 'U = I · Z',
  'formula.ohmsLaw.3ph2': 'P = √3·U·I·cosφ',
  'formula.ohmsLaw.3ph3': 'I = P / √3·U·I·cosφ',

  'hint.enterAnyTwo': 'Introduce dos valores cualesquiera para calcular',
  'hint.oneMoreValue': 'establecido — introduce un valor más',
  'hint.solvingFrom': 'Calculando a partir de',
  'hint.and': 'y',

  'category.fundamentals': 'Fundamentos eléctricos',
  'category.cable-wiring': 'Cables y cableado',
  'category.motors-drives': 'Motores y accionamientos',
  'category.protection-coordination': 'Protección y coordinación',

  'calc.ohmsLaw.title': 'Ley de Ohm',
  'calc.ohmsLaw.desc': 'Calcula U, I, R, P para sistemas CC y CA',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Potencia a corriente para DC, monofásico y trifásico',
  'calc.cableSizing.title': 'Dimensionamiento de cables',
  'calc.cableSizing.desc': 'Selección de sección según IEC 60364-5-52',
  'calc.voltageDrop.title': 'Caída de tensión',
  'calc.voltageDrop.desc': 'ΔU sobre la longitud del cable y la carga',
  'calc.conduitFill.title': 'Llenado de conducto',
  'calc.conduitFill.desc': '% de llenado para conductos RL',
  'calc.motorCurrent.title': 'Corriente del motor',
  'calc.motorCurrent.desc': 'Corriente nominal y de arranque — IEC 60034',
  'calc.breakerSelection.title': 'Selección de interruptor',
  'calc.breakerSelection.desc': 'Calibre del MCB según Ip e Iz — EN 60898',
  'calc.peConductor.title': 'Conductor PE',
  'calc.peConductor.desc':
    'Dimensionamiento del conductor de protección — IEC 60364-5-54',

  'calc.powerFactor.title': 'Factor de potencia',
  'calc.powerFactor.desc': 'Potencia activa, reactiva y aparente',
  'calc.shortCircuit.title': 'Corriente de cortocircuito',
  'calc.shortCircuit.desc': 'Icc previsto en el punto de instalación',
  'calc.transformerRating.title': 'Dimensionamiento de transformador',
  'calc.transformerRating.desc': 'kVA, impedancia y cálculos de carga',

  'field.system': 'Sistema',
  'field.voltage': 'Tensión',
  'field.current': 'Corriente',
  'field.resistance': 'Resistencia',
  'field.impedance': 'Impedancia',
  'field.power': 'Potencia',
  'field.cosPhi': 'Factor de potencia',
  'field.length': 'Longitud',
  'field.crossSection': 'Sección',
  'field.material': 'Material',

  'field.nominalCurrent': 'Corriente nominal',
  'field.efficiency': 'Eficiencia',
  'field.startupCurrentMin': 'Corriente de arranque (mín)',
  'field.startupCurrentMax': 'Corriente de arranque (máx)',

  'field.insulation': 'Aislamiento',
  'field.conductorTemperature': 'Temperatura del conductor',
  'field.voltageDrop': 'Caída de tensión',
  'field.voltageDropPercent': 'Caída de tensión %',
  'field.loadType': 'Tipo de carga',
  'field.loadCurrent': 'Corriente de carga',
  'field.installMethod': 'Método de instalación',
  'field.ambientTemperature': 'Temperatura ambiente',
  'field.grouping': 'Agrupamiento',
  'field.designCurrent': 'Corriente de diseño',
  'field.requiredAmpacity': 'Ampacidad requerida',
  'field.tableAmpacity': 'Ampacidad de tabla',
  'field.ampacityMargin': 'Margen',

  'field.breakerRating': 'Calibre del interruptor',

  'field.method': 'Método',
  'field.faultCurrent': 'Corriente de falla',
  'field.disconnectionTime': 'Tiempo de desconexión',
  'field.kFactor': 'Factor de material (k)',
  'field.phaseSection': 'Sección del conductor de fase',
  'field.requiredPeSection': 'Sección PE requerida',
  'field.standardPeSection': 'Sección PE normalizada',

  'field.conduitDiameter': 'Diámetro interno del conducto',
  'field.cableCount': 'Número de cables',
  'field.totalCableArea': 'Área total de cables',
  'field.conduitFillPercent': 'Llenado',
  'field.conduitFillLimit': 'Límite de llenado',

  'system.dc': 'CC',
  'system.1ph': 'Monofásico',
  'system.3ph': 'Trifásico',

  'material.cu': 'Cu',
  'material.al': 'Al',

  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Conducto en pared térmicamente aislante',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Conducto en pared o en canaleta',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Sujeto directamente a mampostería',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Bandeja portacables o aire libre',

  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  'grouping.1': '1 circuito',
  'grouping.2': '2 circuitos',
  'grouping.3': '3 circuitos',
  'grouping.4': '4 circuitos',
  'grouping.5': '5 circuitos',
  'grouping.6plus': '6+ circuitos',

  'loadType.power': 'Potencia',
  'loadType.current': 'Corriente',

  'peMethod.adiabatic': 'Adiabático',
  'peMethod.simplified': 'Simplificado',

  'peKFactor.Cu_sep': 'Cu, separado (k=143)',
  'peKFactor.Cu_cable': 'Cu, en cable (k=115)',
  'peKFactor.Al_cable': 'Al, en cable (k=76)',

  'chainTo.breakerSelection': 'Selección de interruptor',

  'error.needExactlyTwoValues': 'Introduce exactamente dos valores conocidos.',
  'error.missingRequiredFields': 'Completa todos los campos requeridos.',
  'error.noBreakerFitsInRange':
    'Ningún calibre estándar encaja entre Ip e Iz — aumenta la sección del cable.',
  'error.noPeSizeFitsInRange':
    'La sección PE requerida supera el rango normalizado.',
  'warn.divisionByZero':
    'Revisa tus valores — uno de ellos produce una división por cero.',
  'warn.voltageDropExceedsIec':
    'La caída de tensión supera la recomendación IEC del 5%.',
  'warn.cableSizingNoTableFit':
    'Ninguna sección estándar cubre completamente esta carga — se muestra la mayor sección disponible.',
  'info.largeSectionReactanceIgnored':
    'Sección superior a 50mm² — la reactancia no se considera en esta fórmula.',
  'warn.conduitFillExceedsLimit':
    'El llenado supera el límite recomendado para este número de cables.',

  'paywall.cableChain':
    'Encadena el dimensionamiento de cables directamente con la selección de interruptor',
  'paywall.pdfExport': 'Exportar cálculos a PDF',
  'paywall.unlimitedHistory': 'Historial de cálculos ilimitado',

  'ui.home.planBadge': 'PLAN GRATUITO',
  'ui.home.searchPlaceholder': 'Buscar calculadoras...',
  'ui.home.noResults': 'No se encontraron calculadoras',
  'ui.home.soonSectionTitle': 'Próximamente',

  'ui.history.title': 'Historial',
  'ui.history.clear': 'Borrar',
  'ui.history.empty': 'Aún no hay cálculos',

  'ui.menu.title': 'Más',
  'ui.menu.exportPdf': 'Exportar a PDF',
  'ui.menu.restorePurchases': 'Restaurar compras',
  'ui.menu.settingsRow': 'Idioma',

  'ui.paywall.title': 'AmpCore Pro',
  'ui.paywall.unlockHeadline': 'Desbloquea todas las calculadoras',
  'ui.paywall.proCalculatorsSummary':
    '{{count}} calculadoras pro e historial ilimitado',
  'ui.paywall.includesTitle': 'Incluye',
  'ui.paywall.ctaPlaceholder': 'Mejorar — próximamente',
  'ui.paywall.noPaymentNotice':
    'Aún no hay integración de pago — no hay nada que comprar aquí.',

  'ui.common.soonBadge': 'PRÓXIMAMENTE',

  'ui.settings.title': 'Idioma',
  'ui.settings.systemDefault':
    'Detectado del dispositivo — cámbialo cuando quieras',

  'legal.disclaimer':
    'Los resultados son solo de referencia. La responsabilidad del diseño recae en un profesional cualificado. Verifica las normas vigentes en tu país.',
  'onboarding.welcome.title': 'Diseñado para la IEC',
  'onboarding.welcome.body':
    'Cada calculadora sigue la IEC 60364 y la práctica europea — no es una app NEC estadounidense con conversión de unidades añadida.',

  'ui.onboarding.next': 'Siguiente',
  'ui.onboarding.iUnderstand': 'Entendido',
  'ui.onboarding.unitsTitle': 'Unidades',
  'ui.onboarding.unitsHint': 'Puedes cambiarlo en cualquier momento en Ajustes',
  'ui.onboarding.unitsMetric': 'Métrico',
  'ui.onboarding.unitsImperial': 'Imperial',
  'ui.settings.unitsMetricHint':
    'Longitud en metros, sección en mm², temperatura en °C',
  'ui.settings.unitsImperialHint':
    'Longitud en pies, sección en kcmil, temperatura en °F',
  'ui.onboarding.disclaimerTitle': 'Antes de empezar',
};
