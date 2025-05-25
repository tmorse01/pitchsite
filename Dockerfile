FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for workspace
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all workspace dependencies from root
RUN npm ci

# Copy source code
COPY . .

# Build the applications using workspace commands
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["sh", "-c", "cd server && npm start"]
