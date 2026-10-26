// Shared between the backend call ledger (server/call-ledger.ts) and the voice agent.
//
// The backend is the only place every call passes through (createCall), and it
// is single-threaded, so it is the one authority that can say "no call is
// active". The ledger holds every non-idle call nonce until positive end
// evidence (idle presence, session.stopped, forceStop, or an explicit release)
// removes it. Missing or late evidence is "unknown", never idle.

/** Reported phase of a ledger entry that blocks a reserved start. */
export type CallLedgerPhase =
  /** Reserved or created, with no presence yet; not known to be live. */
  | "reserved"
  /** Positively reported by its owner in this backend process. */
  | "connecting" | "live" | "muted"
  /** Restored after a backend restart, or the ledger itself is unavailable. */
  | "unknown";

export const POSITIVE_CALL_PHASES: readonly CallLedgerPhase[] = ["connecting", "live", "muted"];

export interface CallConflict {
  /** Null when the ledger is unavailable, so no specific call can be named. */
  nonce: string | null;
  phase: CallLedgerPhase;
}

/** createCall's error message when a reserved start lost to another start. */
export const CALL_SUPERSEDED = "Another call started first.";
