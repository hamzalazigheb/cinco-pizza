export interface Drink {
  id:     string;
  label:  string;
  volume: string;
  price:  number;
}

/** Boissons vendues à l'unité (la Maxi Boisson est incluse dans les packs). */
export const DRINKS: Drink[] = [
  { id: "boisson-33cl", label: "Boisson 33cl", volume: "33cl", price: 1.5 },
  { id: "boisson-1-5l", label: "Boisson 1,5L", volume: "1,5L", price: 3 },
];

export const DRINK_IMAGE = "/images/boisson.jpg";
