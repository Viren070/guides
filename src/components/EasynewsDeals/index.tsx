import BrowserOnly from "@docusaurus/BrowserOnly";
import React from "react";

// Define EasynewsDeal type
type EasynewsDeal = {
  name: string;
  url: string;
};

const corsProxy = "https://cors-proxy.viren070.me/?url=";
const searchUrl = `${corsProxy}https://www.google.com/search?q=site:signup.easynews.com/checkout`; // Google search URL to search for Easynews deals
const searchResultsSelector = "div.g"; // CSS selector to select search results

// Helper function to capitalize the first letter of each word
const capitalizeWords = (text: string): string => {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Scrape for Easynews deals
async function scrapeForEasynewsDeals(): Promise<EasynewsDeal[]> {
  const deals: EasynewsDeal[] = [];
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.statusText}`);
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const results = doc.querySelectorAll(searchResultsSelector);

    results.forEach((result) => {
      const anchor = result.querySelector("a");
      if (!anchor) return;

      let url = anchor.getAttribute("href");
      if (!url) return;

      try {
        const path = new URL(url).pathname;
        let name = path.split("/")[2];
        name = capitalizeWords(name);

        // Remove query strings from URL
        url = url.split("?")[0];

        // Check if URL already exists
        if (deals.find((deal) => deal.url === url)) return;

        deals.push({ name, url });
      } catch (e) {
        console.error("Error parsing URL:", e);
      }
    });
  } catch (error) {
    console.error("Error fetching Easynews deals:", error);
  }
  console.log(deals);
  return deals;
}

// EasynewsDeals component
export default function EasynewsDeals() {
  const [deals, setDeals] = React.useState<EasynewsDeal[]>([]);

  React.useEffect(() => {
    const fetchDeals = async () => {
      try {
        const deals = await scrapeForEasynewsDeals();
        setDeals(deals);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => (
        <div>
          <h2>Easynews Deals</h2>
          <ul>
            {deals.map((deal, index) => (
              <li key={index}>
                <a href={deal.url}><strong>{deal.name}</strong></a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </BrowserOnly>
  );
}