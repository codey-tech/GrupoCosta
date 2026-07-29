export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/painel"],
    },
    sitemap: "https://grupocosta.online/sitemap.xml",
  };
}
