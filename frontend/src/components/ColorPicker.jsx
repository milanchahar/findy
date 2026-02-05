import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colors = [
    { name: 'Void Black', value: '#000000' },
    { name: 'Midnight Blue', value: '#0a0a2a' },
    { name: 'Deep Forest', value: '#051a0d' },
    { name: 'Royal Purple', value: '#1a0524' },
    { name: 'Crimson Night', value: '#240505' },
    { name: 'Slate Gray', value: '#1a1a1a' },
    { name: 'Cosmic Teal', value: '#001f24' },
    { name: 'Luxury Brown', value: '#241a05' },
];

const ColorPicker = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { themeColor, setThemeColor } = useTheme();

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="mb-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl"
                    >
                        <div className="grid grid-cols-2 gap-3 w-48">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setThemeColor(color.value)}
                                    className={`group relative w-full h-12 rounded-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 border-2 ${themeColor === color.value ? 'border-white' : 'border-transparent'
                                        }`}
                                    aria-label={`Select ${color.name}`}
                                >
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    {themeColor === color.value && (
                                        <motion.div
                                            layoutId="active-dot"
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-xs text-white/50 mt-3 font-medium uppercase tracking-wider">
                            Choose Theme
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <X size={24} /> : <Palette size={24} />}
            </motion.button>
        </div>
    );
};

export default ColorPicker;
