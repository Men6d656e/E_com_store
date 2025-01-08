import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  searchOpen: false,
  filterDrawerOpen: false,
  cartDrawerOpen: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeAllDrawers: (state) => {
      state.sidebarOpen = false;
      state.searchOpen = false;
      state.filterDrawerOpen = false;
      state.cartDrawerOpen = false;
      state.mobileMenuOpen = false;
    },
  },
});

export const {
  toggleSidebar,
  toggleTheme,
  addNotification,
  removeNotification,
  toggleSearch,
  toggleFilterDrawer,
  toggleCartDrawer,
  toggleMobileMenu,
  closeAllDrawers,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectFilterDrawerOpen = (state) => state.ui.filterDrawerOpen;
export const selectCartDrawerOpen = (state) => state.ui.cartDrawerOpen;
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen;
