export const inventoryConfig = {
  password: process.env.INVENTORY_PASSWORD ?? "",
  sessionSecret: process.env.INVENTORY_SESSION_SECRET ?? "",
} as const;
