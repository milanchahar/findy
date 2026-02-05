import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeColor, setThemeColor] = useState('#0a0a2a');

    useEffect(() => {
        // Update CSS variable for the theme color
        document.documentElement.style.setProperty('--theme-color', themeColor);

        // Also update a transparent version for gradients/overlays if needed
        // This is a simple hex-to-rgb conversion for basic support
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ?
                `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` :
                '0 0 0';
        };

        document.documentElement.style.setProperty('--theme-rgb', hexToRgb(themeColor));
    }, [themeColor]);

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
