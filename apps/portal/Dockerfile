FROM node:22-alpine AS dependencies

WORKDIR /app

COPY apps/portal/package.json apps/portal/package-lock.json ./

RUN npm ci


FROM node:22-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY apps/portal ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PROPERTY_API_URL=http://property-api:8001
ENV MARKET_API_URL=http://market-api:8002

RUN addgroup -S appuser && adduser -S appuser -G appuser

COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/.next/standalone ./

RUN chown -R appuser:appuser /app

EXPOSE 3000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["node", "-e", "require('http').get('http://127.0.0.1:3000', res => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"]

CMD ["node", "server.js"]
