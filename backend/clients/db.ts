import { SQLDatabase } from "encore.dev/storage/sqldb";

export const clientsDB = new SQLDatabase("clients", {
  migrations: "./migrations",
});
