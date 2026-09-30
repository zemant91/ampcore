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
    powerFactor,
    pfCorrection,
    transformerRating,
    shortCircuit,
    earthLoop,
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
        powerFactor,
        pfCorrection,
        transformerRating,
        shortCircuit,
        earthLoop,
    ],
    upcoming: [],
    defaultUnitsSystem: 'metric',
    disclosureLevel: 'technical',
    legalDisclaimerKey: 'legal.disclaimer',
    onboarding: {
        welcomeTitleKey: 'onboarding.welcome.title',
        welcomeBodyKey: 'onboarding.welcome.body',
    },
    paywall: {
        valueProps: ['paywall.cableChain', 'paywall.pdfExport', 'paywall.unlimitedHistory'],
    },
    supportEmail: 'zemantservices@gmail.com',
};
