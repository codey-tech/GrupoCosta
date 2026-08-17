export default function sitemap() {
  const base = "https://grupocosta.online";
  const routes = [
    "",
    "/plano",
    "/centro-clinico",
    "/ambulancias",
    "/funeraria",
    "/memorial",
    "/politica-de-privacidade",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
