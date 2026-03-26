# Stage 1: Build
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
# Make sure dynamic pages are marked with `export const dynamic = 'force-dynamic';`
RUN npm run build

# Stage 2: Production image
FROM node:lts-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && rm -rf /root/.npm

# Copy built Next.js app and public files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public


# Expose port 3000
EXPOSE 3000

# Set environment variable for Node
ENV NODE_ENV=production

# Start the Next.js app
CMD ["npm", "start"]
