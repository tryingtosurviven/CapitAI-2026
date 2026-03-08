// state.js - Centralized State Management for Lifepath AI

const StateManager = {
  // 1. Initialize data on first load
  init() {
    // If there is no saved state, pull from the base mock-data.js
    if (!localStorage.getItem('lifepath_data')) {
      // Create a flat, easy-to-manage state object
      const defaultState = {
        netWorth: 286500,
        wellnessScore: 78,
        liquidityMonths: 8.3,
        retirementProbability: 74,
        diversification: 81,
        fragility: 63,
        activeScenario: "None"
      };
      localStorage.setItem('lifepath_data', JSON.stringify(defaultState));
    }
  },

  // 2. Read the current data
  get() {
    this.init();
    return JSON.parse(localStorage.getItem('lifepath_data'));
  },

  // 3. Update the data (e.g., when a shock is simulated)
  update(newValues) {
    const currentState = this.get();
    const updatedState = { ...currentState, ...newValues };
    localStorage.setItem('lifepath_data', JSON.stringify(updatedState));
    console.log("State updated globally:", updatedState);
  },

  // 4. Reset everything back to base case
  reset() {
    localStorage.removeItem('lifepath_data');
    this.init();
    console.log("State reset to Base Case.");
  }
};

// Auto-initialize when the file loads
StateManager.init();