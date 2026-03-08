// state.js - Centralized State Management for Lifepath AI

const StateManager = {
  init() {
    if (!localStorage.getItem('lifepath_data')) {
      const defaultState = {
        netWorth: 286500,
        wellnessScore: 78,
        liquidityMonths: 8.3,
        retirementProbability: 74,
        diversification: 81,
        fragility: 63,
        activeScenario: "None",
        lastUpdated: "Today at 9:00 AM",
        dataSource: "Live FMP API"
      };
      localStorage.setItem('lifepath_data', JSON.stringify(defaultState));
    }
  },

  get() {
    this.init();
    return JSON.parse(localStorage.getItem('lifepath_data'));
  },

  update(newValues) {
    const currentState = this.get();
    const updatedState = { ...currentState, ...newValues };
    localStorage.setItem('lifepath_data', JSON.stringify(updatedState));
    console.log("State updated globally:", updatedState);
  },

  reset() {
    localStorage.removeItem('lifepath_data');
    this.init();
    console.log("State reset to Base Case.");
  }
};

StateManager.init();