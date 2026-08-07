"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { Step1TrackSelect } from "@/components/wizard/Step1TrackSelect";
import { Step2LearnRecommend } from "@/components/wizard/Step2LearnRecommend";
import { Step3Task } from "@/components/wizard/Step3Task";
import { Step4SubmitProof } from "@/components/wizard/Step4SubmitProof";
import { Step5Mint } from "@/components/wizard/Step5Mint";
import { useWizardStore } from "@/lib/store";

export default function Home() {
  const step = useWizardStore((s) => s.step);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step]);

  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mb-12">
          <StepIndicator current={step} />
        </div>
        {step === 1 && <Step1TrackSelect />}
        {step === 2 && <Step2LearnRecommend />}
        {step === 3 && <Step3Task />}
        {step === 4 && <Step4SubmitProof />}
        {step === 5 && <Step5Mint />}
      </main>
      <footer className="border-t border-line py-6 text-center font-mono-tag text-xs text-ink-soft">
        DeSci Contributor Path · Built for Monad Hackathon Demo
      </footer>
    </>
  );
}
