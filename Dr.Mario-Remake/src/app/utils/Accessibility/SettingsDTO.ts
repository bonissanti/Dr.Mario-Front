export const THEMES = ['light', 'dark', 'auto'] as const;
export const TEXT_SIZES = [ 'small', 'medium', 'large' ] as const;

export type Theme = typeof THEMES[number];
export type TextSize = typeof TEXT_SIZES[number];

export interface SettingsDTO {
    theme: Theme;
    textSize: TextSize;
    pieceShapes: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
    sound: boolean;
}
