import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { centroClinicoSchema } from "@/lib/schema";

export const metadata = PAGE_METADATA.centroClinico;

export default function CentroClinicoLayout({ children }) {
  return (
    <>
      <JsonLd data={centroClinicoSchema} />
      {children}
    </>
  );
}
