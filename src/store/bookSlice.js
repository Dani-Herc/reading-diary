import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    elements: {},
    backgrounds: {
      animals: '/backgrounds/animals-background.png',
      fantasy: '/backgrounds/fantasy-background.png',
      adventure: '/backgrounds/adventure-background.png',
    },
  },
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
      const { category } = action.payload;
      const categoryLower = category.toLowerCase();
      if (!state.elements[categoryLower]) state.elements[categoryLower] = [];
      state.elements[categoryLower].push({
        id: Date.now(), // Unique ID for each element
        x: 100,         // Initial position
        y: 100,
        type: getElementType(categoryLower),
      });
    },
    updateElementPosition: (state, action) => {
      const { category, id, x, y } = action.payload;
      const categoryLower = category.toLowerCase();
      const element = state.elements[categoryLower].find((el) => el.id === id);
      if (element) {
        element.x = x; // Save new x position
        element.y = y; // Save new y position
      }
    },
    updateBackground: (state, action) => {
      const { category, backgroundPath } = action.payload;
      state.backgrounds[category.toLowerCase()] = backgroundPath;
    },
    loadState: (state, action) => {
      return action.payload; // Load saved state, including elements and positions
    },
  },
});

const getElementType = (category) => {
  const types = { animals: 'animalhouse', fantasy: 'castle', adventure: 'treasure' };
  return types[category] || 'default';
};

export const { addBook, updateElementPosition, updateBackground, loadState } = bookSlice.actions;
export default bookSlice.reducer;