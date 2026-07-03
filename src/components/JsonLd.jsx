import { toJsonLd } from "@/lib/seo/jsonld";

/**
 * @param {{ data: Record<string, unknown> | Record<string, unknown>[] }} props
 */
export default function JsonLd({ data }) {
  const payload = Array.isArray(data) ? data : [data];

  return payload.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(item) }}
    />
  ));
}
