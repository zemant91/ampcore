/**
 * TODO(i18n-review): AI-drafted Polish translation. Needs review by a native
 * or professional translator (especially electrical terminology) before
 * this locale ships to real users — see resources.test.ts for the key-parity
 * check against en.ts that keeps this file structurally in sync.
 */
export const pl: Record<string, string> = {
  'formula.ohmsLaw.dc1': 'U = I · R',
  'formula.ohmsLaw.dc2': 'P = U · I',
  'formula.ohmsLaw.dc3': 'P = I² · R',
  'formula.ohmsLaw.1ph1': 'U = I · Z',
  'formula.ohmsLaw.1ph2': 'P = U · I · cosφ',
  'formula.ohmsLaw.1ph3': 'I = P / U·cosφ',
  'formula.ohmsLaw.3ph1': 'U = I · Z',
  'formula.ohmsLaw.3ph2': 'P = √3·U·I·cosφ',
  'formula.ohmsLaw.3ph3': 'I = P / √3·U·I·cosφ',

  'hint.enterAnyTwo': 'Wprowadź dowolne dwie wartości, aby obliczyć',
  'hint.oneMoreValue': 'ustawione — wprowadź jeszcze jedną wartość',
  'hint.solvingFrom': 'Obliczanie na podstawie',
  'hint.and': 'i',

  'category.fundamentals': 'Podstawy elektrotechniki',
  'category.cable-wiring': 'Kable i okablowanie',
  'category.motors-drives': 'Silniki i napędy',
  'category.protection-coordination': 'Ochrona i koordynacja',

  'calc.ohmsLaw.title': 'Prawo Ohma',
  'calc.ohmsLaw.desc': 'Oblicz U, I, R, P dla prądu stałego i przemiennego',
  'calc.kwToAmps.title': 'kW ↔ A',
  'calc.kwToAmps.desc': 'Moc na prąd dla DC, 1-fazowego i 3-fazowego',
  'calc.cableSizing.title': 'Dobór przekroju kabla',
  'calc.cableSizing.desc': 'Dobór przekroju wg IEC 60364-5-52',
  'calc.voltageDrop.title': 'Spadek napięcia',
  'calc.voltageDrop.desc': 'ΔU na długości kabla i obciążeniu',
  'calc.conduitFill.title': 'Wypełnienie rury',
  'calc.conduitFill.desc': '% wypełnienia dla rur RL',
  'calc.motorCurrent.title': 'Prąd silnika',
  'calc.motorCurrent.desc': 'Prąd znamionowy i rozruchowy — IEC 60034',
  'calc.breakerSelection.title': 'Dobór wyłącznika',
  'calc.breakerSelection.desc': 'Dobór MCB na podstawie Ip i Iz — EN 60898',
  'calc.peConductor.title': 'Przewód PE',
  'calc.peConductor.desc': 'Dobór przewodu ochronnego — IEC 60364-5-54',

  'calc.powerFactor.title': 'Współczynnik mocy',
  'calc.powerFactor.desc': 'Moc czynna, bierna i pozorna',
  'calc.shortCircuit.title': 'Prąd zwarciowy',
  'calc.shortCircuit.desc': 'Spodziewany Isc w miejscu instalacji',
  'calc.transformerRating.title': 'Parametry transformatora',
  'calc.transformerRating.desc': 'kVA, impedancja i obliczenia obciążenia',

  'field.system': 'System',
  'field.voltage': 'Napięcie',
  'field.current': 'Prąd',
  'field.resistance': 'Rezystancja',
  'field.impedance': 'Impedancja',
  'field.power': 'Moc',
  'field.cosPhi': 'Współczynnik mocy',
  'field.length': 'Długość',
  'field.crossSection': 'Przekrój',
  'field.temperature': 'Temperatura',
  'field.material': 'Materiał',

  'field.nominalCurrent': 'Prąd znamionowy',
  'field.efficiency': 'Sprawność',
  'field.startupCurrentMin': 'Prąd rozruchowy (min)',
  'field.startupCurrentMax': 'Prąd rozruchowy (max)',

  'field.insulation': 'Izolacja',
  'field.conductorTemperature': 'Temperatura przewodu',
  'field.voltageDrop': 'Spadek napięcia',
  'field.voltageDropPercent': 'Spadek napięcia %',
  'field.loadType': 'Typ obciążenia',
  'field.loadCurrent': 'Prąd obciążenia',
  'field.installMethod': 'Sposób ułożenia',
  'field.ambientTemperature': 'Temperatura otoczenia',
  'field.grouping': 'Grupowanie',
  'field.designCurrent': 'Prąd obliczeniowy',
  'field.requiredAmpacity': 'Wymagana obciążalność',
  'field.tableAmpacity': 'Obciążalność tabelaryczna',
  'field.ampacityMargin': 'Margines',

  'field.breakerRating': 'Prąd znamionowy wyłącznika',

  'field.method': 'Metoda',
  'field.faultCurrent': 'Prąd zwarciowy',
  'field.disconnectionTime': 'Czas wyłączenia',
  'field.kFactor': 'Współczynnik materiałowy (k)',
  'field.phaseSection': 'Przekrój przewodu fazowego',
  'field.requiredPeSection': 'Wymagany przekrój PE',
  'field.standardPeSection': 'Znormalizowany przekrój PE',

  'field.conduitDiameter': 'Średnica wewnętrzna rury',
  'field.cableCount': 'Liczba kabli',
  'field.totalCableArea': 'Całkowita powierzchnia kabli',
  'field.conduitFillPercent': 'Wypełnienie',
  'field.conduitFillLimit': 'Limit wypełnienia',

  'system.dc': 'DC',
  'system.1ph': '1-fazowy',
  'system.3ph': '3-fazowy',

  'material.cu': 'Cu',
  'material.al': 'Al',

  'insulation.pvc': 'PVC',
  'insulation.xlpe': 'XLPE',

  'installMethod.a1': 'A1',
  'installMethod.a1.desc': 'Przewód w rurze w ścianie izolacyjnej',
  'installMethod.b1': 'B1',
  'installMethod.b1.desc': 'Rura na ścianie lub w korytku',
  'installMethod.c': 'C',
  'installMethod.c.desc': 'Mocowany bezpośrednio do muru',
  'installMethod.e': 'E',
  'installMethod.e.desc': 'Drabinka kablowa lub wolna przestrzeń',

  'ambientTemp.20': '20°C',
  'ambientTemp.25': '25°C',
  'ambientTemp.30': '30°C',
  'ambientTemp.35': '35°C',
  'ambientTemp.40': '40°C',

  'temp.20': '20°C',
  'temp.70': '70°C (PVC)',
  'temp.90': '90°C (XLPE)',

  'grouping.1': '1 obwód',
  'grouping.2': '2 obwody',
  'grouping.3': '3 obwody',
  'grouping.4': '4 obwody',
  'grouping.5': '5 obwodów',
  'grouping.6plus': '6+ obwodów',

  'loadType.power': 'Moc',
  'loadType.current': 'Prąd',

  'peMethod.adiabatic': 'Adiabatyczna',
  'peMethod.simplified': 'Uproszczona',

  'peKFactor.Cu_sep': 'Cu, oddzielny (k=143)',
  'peKFactor.Cu_cable': 'Cu, w kablu (k=115)',
  'peKFactor.Al_cable': 'Al, w kablu (k=76)',

  'chainTo.breakerSelection': 'Dobór wyłącznika',

  'error.needExactlyTwoValues': 'Wprowadź dokładnie dwie znane wartości.',
  'error.missingRequiredFields': 'Wypełnij wszystkie wymagane pola.',
  'error.noBreakerFitsInRange':
    'Żaden standardowy prąd znamionowy nie mieści się między Ip a Iz — zwiększ przekrój kabla.',
  'error.noPeSizeFitsInRange':
    'Wymagany przekrój PE przekracza zakres znormalizowany.',
  'warn.divisionByZero':
    'Sprawdź dane wejściowe — jedna z wartości prowadzi do dzielenia przez zero.',
  'warn.voltageDropExceedsIec':
    'Spadek napięcia przekracza zalecane 5% wg IEC.',
  'warn.cableSizingNoTableFit':
    'Żaden znormalizowany przekrój nie pokrywa w pełni tego obciążenia — pokazano największy dostępny przekrój.',
  'info.largeSectionReactanceIgnored':
    'Przekrój powyżej 50mm² — reaktancja nie jest uwzględniana w tym wzorze.',
  'warn.conduitFillExceedsLimit':
    'Wypełnienie przekracza zalecany limit dla tej liczby kabli.',

  'paywall.cableChain': 'Połącz dobór kabla bezpośrednio z doborem wyłącznika',
  'paywall.pdfExport': 'Eksport obliczeń do PDF',
  'paywall.unlimitedHistory': 'Nieograniczona historia obliczeń',

  'ui.home.planBadge': 'DARMOWY PLAN',
  'ui.home.searchPlaceholder': 'Szukaj kalkulatorów...',
  'ui.home.noResults': 'Nie znaleziono kalkulatorów',
  'ui.home.soonSectionTitle': 'Wkrótce',

  'ui.history.title': 'Historia',
  'ui.history.clear': 'Wyczyść',
  'ui.history.empty': 'Brak obliczeń',

  'ui.menu.title': 'Więcej',
  'ui.menu.exportPdf': 'Eksport do PDF',
  'ui.menu.manageSubscription': 'Zarządzaj subskrypcją',
  'ui.menu.settingsRow': 'Ustawienia',
  'ui.menu.feedback': 'Wyślij opinię',
  'ui.calculator.reportIssue': 'Zgłoś problem',

  'ui.paywall.alreadyProTitle': 'Masz Pro',
  'ui.paywall.alreadyProBody': 'Wszystkie kalkulatory są odblokowane. Dziękujemy za subskrypcję!',
  'ui.paywall.close': 'Zamknij',

  'ui.subscriptions.errorTitle': 'Coś poszło nie tak',
  'ui.subscriptions.errorBody': 'Spróbuj ponownie.',

  // PDF report (generated from the calculator screen's header button)
  'pdf.inputsHeading': 'Dane wejściowe',
  'pdf.outputsHeading': 'Wyniki',
  'pdf.generatedOn': 'Wygenerowano',
  'pdf.errorTitle': 'Nie udało się utworzyć PDF',
  'pdf.errorBody': 'Spróbuj ponownie.',

  'ui.common.soonBadge': 'WKRÓTCE',

  'ui.settings.title': 'Ustawienia',
  'ui.settings.languageTitle': 'Język',
  'ui.settings.systemDefault': 'Wykryto z urządzenia — zmień w każdej chwili',

  'legal.disclaimer':
    'Wyniki mają charakter poglądowy. Odpowiedzialność za rozwiązania projektowe ponosi wykwalifikowany specjalista. Sprawdź zgodność z normami obowiązującymi w Twoim kraju.',
  'onboarding.welcome.title': 'Stworzone dla IEC',
  'onboarding.welcome.body':
    'Każdy kalkulator opiera się na IEC 60364 i europejskiej praktyce — to nie jest amerykańska aplikacja NEC z doczepioną konwersją jednostek.',

  'ui.onboarding.next': 'Dalej',
  'ui.onboarding.iUnderstand': 'Rozumiem',
  'ui.onboarding.unitsTitle': 'Jednostki',
  'ui.onboarding.unitsMetric': 'Metryczne',
  'ui.onboarding.unitsImperial': 'Imperialne',
  'ui.onboarding.disclaimerTitle': 'Zanim zaczniesz',
};
