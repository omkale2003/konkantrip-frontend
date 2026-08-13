import { useState } from "react";

const TOTAL_STEPS = 8;

function usePropertyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [propertyData, setPropertyData] = useState(null);

  const nextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const goToStep = (step) => {
    const targetStep = Number(step);

    if (
      Number.isInteger(targetStep) &&
      targetStep >= 1 &&
      targetStep <= TOTAL_STEPS
    ) {
      setCurrentStep(targetStep);
    }
  };

  const saveProperty = (data) => {
    setPropertyData(data);
  };

  const savePropertyId = (id) => {
    setPropertyId(id);
  };

  return {
    currentStep,
    propertyId,
    propertyData,
    totalSteps: TOTAL_STEPS,
    nextStep,
    previousStep,
    goToStep,
    saveProperty,
    savePropertyId,
  };
}

export default usePropertyWizard;