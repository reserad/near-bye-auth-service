import { Prisma } from '@prisma/client';

export type User = {
  id: string;
  phone_number: string;
  base_lattitude: Prisma.Decimal;
  base_longitude: Prisma.Decimal;
  created_at: string;
};
