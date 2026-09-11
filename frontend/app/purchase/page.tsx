"use client";

import { useState, useMemo, type FormEvent, type ChangeEvent } from "react";

// --- Types ---
interface Appraiser {
  id: string;
  name: string;
  isAdminApproved: boolean;
}

type PurchaseType = "direct" | "pledged";
type PurityOption = "24K" | "22K" | "18K" | "14K";
type OrnamentType = "Ring" | "Necklace" | "Bangle" | "Coin" | "Other";

interface DirectPurchaseState {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  ornamentType: OrnamentType;
  weightGrams: string;
  purity: PurityOption;
  customPricePerGram: string;
  finalAgreedPrice: string;
}

interface PledgedState {
  receiptFile: File | null;
  receiptPreviewUrl: string | null;
  pledgedPrice: string;
  requestFundAssistance: boolean;
  assistanceAmount: string;
}

interface PurchaseFormState {
  appraiserId: string;
  purchaseType: PurchaseType;
  direct: DirectPurchaseState;
  pledged: PledgedState;
}

// --- Hardcoded Appraiser Data ---
const MOCK_APPRAISERS: Appraiser[] = [
  { id: "app-1", name: "Rajesh Sharma", isAdminApproved: true },
  { id: "app-2", name: "Ananya Deshmukh", isAdminApproved: true },
  { id: "app-3", name: "Vikram Mehta", isAdminApproved: false },
  { id: "app-4", name: "Suresh Kumar", isAdminApproved: true },
  { id: "app-5", name: "Priya Nair", isAdminApproved: true },
];

const MOCK_CURRENT_GOLD_PRICE = 6200; // Demo value in ₹/gram

const PURITY_MULTIPLIERS: Record<PurityOption, number> = {
  "24K": 1.0,
  "22K": 0.916,
  "18K": 0.75,
  "14K": 0.583,
};

export default function PurchasePage() {
  const [appraiserId, setAppraiserId] = useState<string>(MOCK_APPRAISERS[0].id);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("direct");

  // Direct Purchase State
  const [directState, setDirectState] = useState<DirectPurchaseState>({
    imageFile: null,
    imagePreviewUrl: null,
    ornamentType: "Ring",
    weightGrams: "",
    purity: "22K",
    customPricePerGram: "",
    finalAgreedPrice: "",
  });

  // Pledged State
  const [pledgedState, setPledgedState] = useState<PledgedState>({
    receiptFile: null,
    receiptPreviewUrl: null,
    pledgedPrice: "",
    requestFundAssistance: false,
    assistanceAmount: "",
  });

  // --- Handlers ---
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "direct" | "pledged"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "direct") {
      setDirectState((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: previewUrl,
      }));
    } else {
      setPledgedState((prev) => ({
        ...prev,
        receiptFile: file,
        receiptPreviewUrl: previewUrl,
      }));
    }
  };

  // --- Range Calculation ---
  const calculatedRange = useMemo(() => {
    const weight = parseFloat(directState.weightGrams);
    const userPrice = parseFloat(directState.customPricePerGram);

    if (isNaN(weight) || weight <= 0 || isNaN(userPrice) || userPrice <= 0) {
      return null;
    }

    const purityMultiplier = PURITY_MULTIPLIERS[directState.purity];

    // TODO: confirm actual formula with business rules
    const baseValue = weight * purityMultiplier * userPrice;
    const afterWastage = baseValue * 0.97; // placeholder 3% melting wastage
    const rangeLow = afterWastage * 0.95;
    const rangeHigh = afterWastage * 1.0;

    return {
      low: Math.round(rangeLow),
      high: Math.round(rangeHigh),
    };
  }, [directState.weightGrams, directState.purity, directState.customPricePerGram]);

  // --- Validation & Submit ---
  const canSubmit = useMemo(() => {
    if (!appraiserId) return false;

    if (purchaseType === "direct") {
      return (
        parseFloat(directState.weightGrams) > 0 &&
        parseFloat(directState.customPricePerGram) > 0 &&
        parseFloat(directState.finalAgreedPrice) > 0
      );
    } else {
      const basicPledgedValid = parseFloat(pledgedState.pledgedPrice) > 0;
      if (pledgedState.requestFundAssistance) {
        return (
          basicPledgedValid && parseFloat(pledgedState.assistanceAmount) > 0
        );
      }
      return basicPledgedValid;
    }
  }, [appraiserId, purchaseType, directState, pledgedState]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const payload: PurchaseFormState = {
      appraiserId,
      purchaseType,
      direct: directState,
      pledged: pledgedState,
    };

    console.log("Purchase Form Submission Payload:", payload);
  }

  return (
    <div className="flex min-h-dvh w-full flex-1 justify-center bg-[#FFFFFF] font-sans text-[#0F172A] pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] sm:pt-[max(3rem,env(safe-area-inset-top))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pb-[max(3rem,env(safe-area-inset-bottom))] sm:pl-[max(1.5rem,env(safe-area-inset-left))]">
      <div className="w-full max-w-md min-w-0 self-start rounded-lg border border-slate-200 bg-[#FFFFFF] shadow-sm">
        <header className="px-5 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-8">
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">
            GoldTrace
          </p>
          <p className="mt-1 text-sm text-[#0F172A]/70">New Gold Purchase Entry</p>
        </header>

        <div className="h-px bg-[#D4AF37]" aria-hidden="true" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8"
        >
          {/* STEP 1 — Appraiser Selection */}
          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="appraiser" className="text-sm font-medium">
              Select Appraiser
            </label>
            <select
              id="appraiser"
              value={appraiserId}
              onChange={(e) => setAppraiserId(e.target.value)}
              className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
            >
              {MOCK_APPRAISERS.map((appraiser) => (
                <option key={appraiser.id} value={appraiser.id}>
                  {appraiser.name}{" "}
                  {appraiser.isAdminApproved ? "✓ (Admin Approved)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2 — Purchase Type Toggle */}
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm font-medium">Purchase Type</span>
            <div className="grid grid-cols-2 gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setPurchaseType("direct")}
                className={`h-9 rounded text-sm font-medium transition-colors ${
                  purchaseType === "direct"
                    ? "bg-[#FFFFFF] text-[#0F172A] shadow-sm"
                    : "text-[#0F172A]/60 hover:text-[#0F172A]"
                }`}
              >
                Direct Purchase
              </button>
              <button
                type="button"
                onClick={() => setPurchaseType("pledged")}
                className={`h-9 rounded text-sm font-medium transition-colors ${
                  purchaseType === "pledged"
                    ? "bg-[#FFFFFF] text-[#0F172A] shadow-sm"
                    : "text-[#0F172A]/60 hover:text-[#0F172A]"
                }`}
              >
                Pledged
              </button>
            </div>
          </div>

          {/* STEP 3 — Direct Purchase Fields */}
          {purchaseType === "direct" && (
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-sm font-medium">Ornament Photo</label>
                <div className="flex flex-col gap-2 rounded-md border border-dashed border-[#C9973A] bg-[#C9973A]/5 p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "direct")}
                    className="text-xs text-[#0F172A]/70 file:mr-3 file:rounded file:border-0 file:bg-[#C9973A]/20 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-[#0F172A]"
                  />
                  {directState.imagePreviewUrl && (
                    <div className="mt-1 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={directState.imagePreviewUrl}
                        alt="Ornament Preview"
                        className="h-28 w-28 rounded-md object-cover border border-[#C9973A]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="ornamentType" className="text-sm font-medium">
                  Ornament Type
                </label>
                <select
                  id="ornamentType"
                  value={directState.ornamentType}
                  onChange={(e) =>
                    setDirectState((prev) => ({
                      ...prev,
                      ornamentType: e.target.value as OrnamentType,
                    }))
                  }
                  className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                >
                  <option value="Ring">Ring</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Bangle">Bangle</option>
                  <option value="Coin">Coin</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="weight" className="text-sm font-medium">
                    Weight (grams)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={directState.weightGrams}
                    onChange={(e) =>
                      setDirectState((prev) => ({
                        ...prev,
                        weightGrams: e.target.value,
                      }))
                    }
                    className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="purity" className="text-sm font-medium">
                    Purity
                  </label>
                  <select
                    id="purity"
                    value={directState.purity}
                    onChange={(e) =>
                      setDirectState((prev) => ({
                        ...prev,
                        purity: e.target.value as PurityOption,
                      }))
                    }
                    className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                  >
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="18K">18K</option>
                    <option value="14K">14K</option>
                  </select>
                </div>
              </div>

              <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-[#0F172A]/70">
                  Current Gold Price Benchmark:
                </p>
                <p className="text-sm font-semibold text-[#0F172A]">
                  ₹{MOCK_CURRENT_GOLD_PRICE.toLocaleString("en-IN")}/gram
                </p>
                <span className="text-[11px] text-[#0F172A]/50">
                  Demo value — connect live feed later
                </span>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="customPrice" className="text-sm font-medium">
                  Custom Price per Gram (₹)
                </label>
                <input
                  id="customPrice"
                  type="number"
                  placeholder="e.g. 6150"
                  value={directState.customPricePerGram}
                  onChange={(e) =>
                    setDirectState((prev) => ({
                      ...prev,
                      customPricePerGram: e.target.value,
                    }))
                  }
                  className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                />
              </div>

              {calculatedRange ? (
                <div className="rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-3">
                  <p className="text-xs font-medium text-[#0F172A]/70">
                    Calculated Buying Price Range:
                  </p>
                  <p className="text-lg font-bold text-[#0F172A]">
                    ₹{calculatedRange.low.toLocaleString("en-IN")} – ₹
                    {calculatedRange.high.toLocaleString("en-IN")}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#0F172A]/50 italic">
                  Enter weight and custom price per gram to see estimated buying range.
                </p>
              )}

              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="finalPrice" className="text-sm font-medium">
                  Final Agreed Buying Price (₹)
                </label>
                <input
                  id="finalPrice"
                  type="number"
                  placeholder="Enter final negotiated price"
                  value={directState.finalAgreedPrice}
                  onChange={(e) =>
                    setDirectState((prev) => ({
                      ...prev,
                      finalAgreedPrice: e.target.value,
                    }))
                  }
                  className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 4 — Pledged Fields */}
          {purchaseType === "pledged" && (
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-sm font-medium">Pledge Receipt Photo</label>
                <div className="flex flex-col gap-2 rounded-md border border-dashed border-[#C9973A] bg-[#C9973A]/5 p-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "pledged")}
                    className="text-xs text-[#0F172A]/70 file:mr-3 file:rounded file:border-0 file:bg-[#C9973A]/20 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-[#0F172A]"
                  />
                  {pledgedState.receiptPreviewUrl && (
                    <div className="mt-1 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pledgedState.receiptPreviewUrl}
                        alt="Receipt Preview"
                        className="h-28 w-28 rounded-md object-cover border border-[#C9973A]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="pledgedPrice" className="text-sm font-medium">
                  Pledged Amount / Decision Price (₹)
                </label>
                <input
                  id="pledgedPrice"
                  type="number"
                  placeholder="Enter pledged price"
                  value={pledgedState.pledgedPrice}
                  onChange={(e) =>
                    setPledgedState((prev) => ({
                      ...prev,
                      pledgedPrice: e.target.value,
                    }))
                  }
                  className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={pledgedState.requestFundAssistance}
                    onChange={(e) =>
                      setPledgedState((prev) => ({
                        ...prev,
                        requestFundAssistance: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span>Request fund assistance for pledge release</span>
                </label>

                {pledgedState.requestFundAssistance && (
                  <div className="mt-1 flex min-w-0 flex-col gap-1.5 pl-6">
                    <label htmlFor="assistance" className="text-xs font-medium">
                      Required Assistance Amount (₹)
                    </label>
                    <input
                      id="assistance"
                      type="number"
                      placeholder="Enter amount needed"
                      value={pledgedState.assistanceAmount}
                      onChange={(e) =>
                        setPledgedState((prev) => ({
                          ...prev,
                          assistanceAmount: e.target.value,
                        }))
                      }
                      className="h-11 w-full min-w-0 rounded-md border border-slate-200 bg-[#FFFFFF] px-3 text-base text-[#0F172A] outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] sm:h-10 sm:text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 — Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-11 w-full rounded-md bg-[#D4AF37] text-base font-semibold text-[#0F172A] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:text-sm"
          >
            Confirm Purchase
          </button>
        </form>
      </div>
    </div>
  );
}