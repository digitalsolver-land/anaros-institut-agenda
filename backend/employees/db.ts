import { SQLDatabase } from "encore.dev/storage/sqldb";

export const employeesDB = new SQLDatabase("employees", {
  migrations: "./migrations",
});
