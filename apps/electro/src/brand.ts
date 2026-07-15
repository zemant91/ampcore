// apps/electro/src/brand.ts
import type { BrandConfig } from '@calc/engine';
import {
    ohmsLaw,
    kwToAmps,
    cableSizing,
    voltageDrop,
    conduitFill,
    motorCurrent,
    breakerSelection,
    peConductor,
} from '@calc/calculators-electrical';

export const electro: BrandConfig = {
    id: 'electro',
    displayName: 'AmpCore',
    theme: { accent: '#FFBB00' },
    calculators: [
        ohmsLaw,
        kwToAmps,
        cableSizing,
        voltageDrop,
        conduitFill,
        motorCurrent,
        breakerSelection,
        peConductor,
    ],
    upcoming: [
        { id: 'power_factor', titleKey: 'calc.powerFactor.title', descriptionKey: 'calc.powerFactor.desc', category: 'fundamentals', icon: 'pulse' },
        { id: 'short_circuit', titleKey: 'calc.shortCircuit.title', descriptionKey: 'calc.shortCircuit.desc', category: 'protection-coordination', icon: 'shield' },
        { id: 'transformer_rating', titleKey: 'calc.transformerRating.title', descriptionKey: 'calc.transformerRating.desc', category: 'protection-coordination', icon: 'transformer' },
    ],
    defaultUnitsSystem: 'metric',
    disclosureLevel: 'technical',
    legalDisclaimer: {
        en: 'Results are for reference only. Design responsibility rests with a qualified professional. Verify against standards in force in your country.',
        pl: 'Wyniki mają charakter poglądowy. Odpowiedzialność za rozwiązania projektowe ponosi wykwalifikowany specjalista.',
    },
    paywall: {
        valueProps: ['paywall.cableChain', 'paywall.pdfExport', 'paywall.unlimitedHistory'],
    },
};
