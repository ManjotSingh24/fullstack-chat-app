import {create} from 'zustand';

 export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('chat-theme') || 'retro', // default theme
    setTheme: (theme) => { 
        localStorage.setItem('theme', theme); // save theme to local storage
        set({ theme }); // update state with new theme
    },
 }))

//every time we change the theme it will get saved inside out local storage