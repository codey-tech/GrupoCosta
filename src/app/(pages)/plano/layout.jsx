import JsonLd from "@/components/JsonLd";
import { PAGE_METADATA } from "@/lib/seo/config";
import { planoFaqSchema, planoSchema } from "@/lib/schema";

export const metadata = PAGE_METADATA.plano;

export default function PlanoLayout({ children }) {
  return (
    <>
      <JsonLd data={planoSchema} />
      <JsonLd data={planoFaqSchema} />
      {children}
    </>
  );
}
