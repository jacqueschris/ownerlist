FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

COPY package*.json ./

# Copy the rest of the application code
COPY . .

RUN npm install -g pnpm && pnpm install

# Set environment variables (optional)
ENV NODE_ENV production

# Expose the port the app will run on
EXPOSE 3000

RUN pnpm run build

# Run the Next.js application
CMD ["pnpm", "start"]
