import { SQLDatabase } from "encore.dev/storage/sqldb";

export const servicesDB = new SQLDatabase("services", {
  migrations: "./migrations",
});
