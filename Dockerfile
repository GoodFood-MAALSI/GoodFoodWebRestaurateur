# Étape de base (commune à toutes les étapes)
FROM node:22.11-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Étape de build (pour générer les fichiers de production)
FROM base AS builder
RUN npm run build

# Étape de dev (pour le développement avec hot-reloading)
FROM base AS dev
CMD ["npm", "run", "dev", "--", "-p", "4002"]

# Étape de prod (pour la production)
FROM node:22.11-alpine AS prod
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
CMD ["npm", "start", "--", "-p", "4002"]
