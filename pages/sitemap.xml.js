const publicRoutes = [
  "/",
  "/about",
  "/blogs",
  "/contact",
  "/disclaimer",
  "/free-videos",
  "/login",
  "/notes",
  "/premium-courses",
  "/privacy-and-policy",
  "/quiz",
  "/results",
  "/signup",
  "/terms-and-conditions",
];

function buildUrlEntry(loc, lastmod) {
  const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  return `\n    <url>\n      <loc>${loc}</loc>${lastmodTag}\n      <changefreq>weekly</changefreq>\n      <priority>0.7</priority>\n    </url>`;
}

function buildXml(baseUrl) {
  const today = new Date().toISOString().split("T")[0];
  const urls = publicRoutes
    .map((route) => buildUrlEntry(`${baseUrl}${route}`, today))
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`;
}

export default function handler(req, res) {
  const host = req?.headers?.host || "localhost";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const xml = buildXml(baseUrl);
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(xml);
}


