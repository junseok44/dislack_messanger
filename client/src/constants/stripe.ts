export const PRODUCTS = [
  {
    id: 0,
    name: "Basic",
    servers: 1,
    prices: [],
    productId: "product_basic",
  },
  {
    id: 1,
    name: "Intermediate",
    servers: 3,
    prices: [
      {
        priceId: "price_1PdmrBRv8HKFmcvfpTS7cx12",
        description: "Monthly Subscription",
        amount: 3,
        type: "monthly",
      },
    ],
    productId: "prod_QUmQ81fCE5AECn",
  },
  {
    id: 2,
    name: "Expert",
    servers: 5,
    prices: [
      {
        priceId: "price_1Pdms8Rv8HKFmcvfKC9Ho9ci",
        description: "Monthly Subscription",
        amount: 10,
        type: "monthly",
      },
    ],
    productId: "prod_QUmQGIDEH0tcJD",
  },
];

export const getUserPlan = (planId: number) => {
  return PRODUCTS.find((product) => product.id === planId);
};
