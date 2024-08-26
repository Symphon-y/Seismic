# Dockerfile

# Use the latest Node.js image for development
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 6006 for Storybook
EXPOSE 6006

# Command to start Storybook
CMD ["npm", "run", "storybook"]
