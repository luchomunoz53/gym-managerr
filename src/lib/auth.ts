import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
        portalType: { label: 'Tipo', type: 'text' }, // 'staff' o 'athlete'
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Si ingresa por el portal de atleta (autenticación por email/teléfono)
        if (credentials.portalType === 'athlete') {
          const client = await prisma.client.findFirst({
            where: {
              OR: [
                { email: credentials.email.trim() },
                { phone: credentials.email.trim() },
              ],
            },
          });

          if (!client) return null;

          return {
            id: client.id,
            name: client.name,
            email: client.email || `${client.phone}@gym.com`,
            role: 'CLIENT',
          } as any;
        }

        // Si ingresa como Staff (ADMIN o COACH)
        if (!credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};