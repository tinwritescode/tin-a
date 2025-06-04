import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.chat.findMany({
        take: input.limit,
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (messages.length === input.limit) {
        nextCursor = messages[messages.length - 1]?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.db.chat.create({
        data: {
          message: input.message,
          senderId: ctx.session.user.id,
        },
        include: {
          sender: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      return newMessage;
    }),
});
