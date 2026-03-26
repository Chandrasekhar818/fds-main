import { Suspense } from "react";
import PriceAnalysisPage from "./PriceAnalysisClient.tsx";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <PriceAnalysisPage />
    </Suspense>
  );
}
