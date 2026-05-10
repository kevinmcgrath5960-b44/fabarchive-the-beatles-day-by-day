import React, { createContext, useContext, useState } from 'react';

// Provides the current visual phase to any component in the tree.
// Timeline and EventDetail set the phase when their year/event loads.
// Navbar reads it to tint the masthead accordingly.

const PhaseContext = createContext({ phaseId: null, setPhaseId: () => {} });

export function PhaseProvider({ children }) {
  const [phaseId, setPhaseId] = useState(null);
  return (
    <PhaseContext.Provider value={{ phaseId, setPhaseId }}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  return useContext(PhaseContext);
}
