import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
    persist(
        (set, get) => ({
            // State - default to system preference
            theme: "light",

            // Actions
            setTheme: (theme) => {
                document.documentElement.setAttribute("data-theme", theme);
                set({ theme });
            },

            toggleTheme: () => {
                const newTheme = get().theme === "light" ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", newTheme);
                set({ theme: newTheme });
            },

            // Initialize theme on app load
            initializeTheme: () => {
                const savedTheme = get().theme;
                document.documentElement.setAttribute("data-theme", savedTheme);
            },

            // Check if dark mode
            isDark: () => get().theme === "dark",
        }),
        {
            name: "fundwatch-theme",
            onRehydrateStorage: () => (state) => {
                // Apply theme after rehydration
                if (state) {
                    document.documentElement.setAttribute("data-theme", state.theme);
                }
            },
        }
    )
);

export default useThemeStore;
