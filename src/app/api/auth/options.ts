import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions, SessionStrategy } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          throw new Error("Benutzername und Passwort erforderlich");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Falscher Benutzername oder Passwort!");
        }

        const passwordMatches = bcrypt.compareSync(credentials.password, user.password);
        if (!passwordMatches) {
          throw new Error("Falsches Passwort");
        }

        return { id: user.id, username: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Typ explizit setzen
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
