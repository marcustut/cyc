// src/server/trpc/router/index.ts
import { t } from '../utils';
import { summerCampRouter } from './summerCamp';
import { authRouter } from './auth';

export const appRouter = t.router({
  summerCamp: summerCampRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
