import { t } from '../utils';
import { z } from 'zod';
import { isValidMalaysianPhoneNumberMobile } from '../../../lib/phoneNumber';

export const summerCampRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    }),
  promoClipResponses: t.procedure.query(({ ctx }) =>
    ctx.prisma.promoClipResponses.findMany({ orderBy: { createdAt: 'desc' } })
  ),
  submitResponse: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        phoneNumber: z
          .string()
          .refine(isValidMalaysianPhoneNumberMobile, 'must be a valid Malaysian phone number'),
        comment: z.string().optional(),
        interested: z.boolean().default(false),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.promoClipResponses.create({
        data: {
          name: input.name,
          phoneNumber: input.phoneNumber,
          comment: input.comment,
          interested: input.interested,
        },
      });
    }),
});
