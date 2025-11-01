export default function handler(req, res) {
  const host = req?.headers?.host || "localhost";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const sitemapUrl = `${protocol}://${host}/sitemap.xml`;

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /checkout",
    "Disallow: /payment-status",
    "Disallow: /profile/",
    `Sitemap: ${sitemapUrl}`,
    "",
  ];

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(lines.join("\n"));
}


