// state/localStorageUtils.js

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined; // Let reducers initialize the state
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

export const resetStoredState = () => {
  try {
    const serializedState = localStorage.getItem("state");

    if (serializedState !== null) {
      const state = JSON.parse(serializedState);

      if (state.global) {
        state.global.mode = "dark"; // Retain mode as "dark" or set to null as needed
        state.global.role = null;
        state.global.nom = null;
        state.global.prenom = null;
        state.global.email = null;
        state.global.isAuthenticated = false;
        state.global.status = "idle";
        state.global.error = null;
      }

      localStorage.setItem("state", JSON.stringify(state));
    }
  } catch (err) {
    console.error("Could not reset state", err);
  }
};
