"use client";

import { useContext } from "react";
import { EcosystemContext, InteractionContext, SessionContext } from ".";

export function useInteractiveMap() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error("useInteractiveMap must be used within a ContextProvider");
  }

  return context;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a ContextProvider");
  }

  return context;
}

export function useEcosystem() {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error("useEcosystem must be used within a ContextProvider");
  }

  return context;
}
