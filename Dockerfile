FROM node:lts-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM node:lts-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BRAND_NAME='Kayra Export'

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

RUN find .next -type f | grep css || echo "No CSS files found"
RUN ls -la .next/static

FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BRAND_NAME='Kayra Export'

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

RUN ls -la .next/static && find .next -type f | grep css || echo "No CSS files found in final image"

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
