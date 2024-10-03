import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

export const MyPreset = definePreset(Aura, {
    primitive: {
        violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#6750A4', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
    },
    semantic: {
        primary: {
            50: '{violet.50}',
            100: '{violet.100}',
            200: '{violet.200}',
            300: '{violet.300}',
            400: '{violet.400}',
            500: '{violet.500}',
            600: '{violet.600}',
            700: '{violet.700}',
            800: '{violet.800}',
            900: '{violet.900}',
            950: '{violet.950}'
        }
    },
    components: {
        card: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.500}',
                        color: '{surface.700}'
                    },
                    subtitle: {
                        color: '{surface.500}'
                    }
                },
                dark: {
                    root: {
                        background: '{surface.900}',
                        color: '{surface.0}'
                    },
                    subtitle: {
                        color: '{surface.400}'
                    }
                }
            }
        },
        button: {
            padding:{x: '2rem'},
            paddingY: '2rem',
            colorScheme: {
                light:{
                    successBorderColor: "{red-500}",
                    // primaryBackground: '{red-500}'
                }
            } 
        }
    }
});
