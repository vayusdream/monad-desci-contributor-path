import { create } from "zustand";
import { TrackId } from "./tracks";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

interface ProofSubmission {
  link: string;
  note: string;
  submittedAt: number;
}

export interface Attestation {
  signature: `0x${string}`;
  deadline: string;
}

interface WizardState {
  step: WizardStep;
  trackId: TrackId | null;
  proof: ProofSubmission | null;
  mintedTokenId: string | null;
  attestation: Attestation | null;
  attestationError: string | null;
  selectTrack: (id: TrackId) => void;
  goToStep: (step: WizardStep) => void;
  submitProof: (proof: Omit<ProofSubmission, "submittedAt">) => void;
  setMinted: (tokenId: string) => void;
  setAttestation: (attestation: Attestation | null) => void;
  setAttestationError: (error: string | null) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  trackId: null,
  proof: null,
  mintedTokenId: null,
  attestation: null,
  attestationError: null,
  selectTrack: (id) => set({ trackId: id, step: 2 }),
  goToStep: (step) => set({ step }),
  submitProof: (proof) =>
    set({ proof: { ...proof, submittedAt: Date.now() }, step: 5 }),
  setMinted: (tokenId) => set({ mintedTokenId: tokenId }),
  setAttestation: (attestation) => set({ attestation, attestationError: null }),
  setAttestationError: (error) => set({ attestationError: error, attestation: null }),
  reset: () =>
    set({
      step: 1,
      trackId: null,
      proof: null,
      mintedTokenId: null,
      attestation: null,
      attestationError: null,
    }),
}));
