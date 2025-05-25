FROM node:20-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files for workspace
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm ci --include=optional --verbose

# Copy source code
COPY . .

# Rebuild native dependencies and clear any cached build artifacts
RUN rm -rf node_modules/.cache client/node_modules/.cache server/node_modules/.cache
RUN npm rebuild --verbose

# Build the applications using workspace commands
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["sh", "-c", "cd server && npm start"]
