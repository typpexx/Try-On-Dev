export type Brand = {
  id: string;
  name: string;
  websiteUrl: string;
  affiliateUrl: string;
  logoText: string;
  category: "luxury" | "high-street" | "streetwear";
  active: boolean;
  selectors: {
    productImage: string;
    title: string;
    price: string;
  };
};

export const brandDirectory: Brand[] = [
  {
    id: "zara",
    name: "Zara",
    websiteUrl: "https://www.zara.com/",
    affiliateUrl: "https://www.zara.com/?ref=tryonhub",
    logoText: "ZA",
    category: "high-street",
    active: true,
    selectors: {
      productImage: "img[data-qa-anchor='product-image']",
      title: "h1[data-qa-action='product-name']",
      price: "span[data-qa-action='product-price']",
    },
  },
  {
    id: "gucci",
    name: "Gucci",
    websiteUrl: "https://www.gucci.com/",
    affiliateUrl: "https://www.gucci.com/?utm_source=tryonhub",
    logoText: "GC",
    category: "luxury",
    active: true,
    selectors: {
      productImage: "img[data-testid='hero-image']",
      title: "h1",
      price: "[data-testid='product-price']",
    },
  },
  {
    id: "fashion-nova",
    name: "Fashion Nova",
    websiteUrl: "https://www.fashionnova.com/",
    affiliateUrl: "https://www.fashionnova.com/?utm_source=tryonhub",
    logoText: "FN",
    category: "streetwear",
    active: true,
    selectors: {
      productImage: ".product-main-image img",
      title: "h1.product-single__title",
      price: ".product__price",
    },
  },
  {
    id: "versace",
    name: "Versace",
    websiteUrl: "https://www.versace.com/",
    affiliateUrl: "https://www.versace.com/?utm_source=tryonhub",
    logoText: "VS",
    category: "luxury",
    active: true,
    selectors: {
      productImage: ".product-gallery img",
      title: "h1",
      price: ".price",
    },
  },
  {
    id: "fendi",
    name: "Fendi",
    websiteUrl: "https://www.fendi.com/",
    affiliateUrl: "https://www.fendi.com/?utm_source=tryonhub",
    logoText: "FD",
    category: "luxury",
    active: true,
    selectors: {
      productImage: ".product-slider img",
      title: "h1",
      price: ".f-price",
    },
  },
];
