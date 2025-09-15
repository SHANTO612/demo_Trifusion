# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Rebuild better-sqlite3 for Linux
RUN npm rebuild better-sqlite3

# Copy the rest of the application code
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 8000

# Start the application
CMD ["npm", "run", "dev"]
