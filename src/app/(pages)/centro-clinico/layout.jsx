import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { centroClinicoJsonLd } from "@/lib/seo/jsonld";

export const metadata = PAGE_METADATA.centroClinico;

export default function CentroClinicoLayout({ children }) {
  return (
    <>
      <JsonLd data={centroClinicoJsonLd()} />
      {children}
    </>
  );
}
