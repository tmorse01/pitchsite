FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci
RUN cd server && npm ci
RUN cd client && npm ci

# Copy source code
COPY . .

# Build the applications
RUN cd server && npm run build
RUN cd client && npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["sh", "-c", "cd server && npm start"]
