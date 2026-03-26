import InstitutionalClient from "@/components/institutionalholding/InstitutionalHolding";
import { getInstitutionalHoldings } from "../../../services/allservies";
import { fetchUserCompanyOptions } from "@/app/actions/insider-analytics";

export default async function InstitutionalHoldingsPage() {
  const data = await getInstitutionalHoldings();
  const companyOptions = await fetchUserCompanyOptions();

  return <InstitutionalClient initialData={data} companyOptions={companyOptions} />;
}