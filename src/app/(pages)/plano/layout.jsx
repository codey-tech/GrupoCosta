import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { planoLocalBusinessJsonLd } from "@/lib/seo/jsonld";

export const metadata = PAGE_METADATA.plano;

export default function PlanoLayout({ children }) {
  return (
    <>
      <JsonLd data={planoLocalBusinessJsonLd()} />
      {children}
    </>
  );
}
