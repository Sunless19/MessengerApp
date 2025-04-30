# ---- Stage 1: Build ----
# Use a Node.js image to build the application
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file (leverages Docker cache)
COPY package*.json ./

# Install dependencies using npm ci (clean install)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# --- IMPORTANT: Configure API URL ---
# Set the backend API URL the frontend will use.
# Since your backend Nginx is exposed on port 80 via Docker Compose,
# 'http://localhost:80' or just 'http://localhost' (port 80 is default)
# should work when accessing the frontend from your browser.
#
# Adjust the variable name if your app uses something other than REACT_APP_API_URL (e.g., VITE_API_URL)
ARG REACT_APP_API_URL=http://localhost:80
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the application for production
# *** CHECK YOUR package.json *** : If your build script is different (e.g., 'generate'), change 'build' below.
RUN npm run build

# ---- Stage 2: Serve ----
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Set working directory to Nginx web root
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy static assets from the 'build' stage
# *** CHECK YOUR BUILD OUTPUT ***: If 'npm run build' creates a 'dist' folder instead of 'build', change '/app/build' below to '/app/dist'.
COPY --from=build /app/dist/frontend/browser/. .

# (Optional) Copy custom Nginx configuration for SPA routing
# If you have issues with page refreshes on routes other than '/',
# create an 'nginx.conf' file (see Step 3) and uncomment the next line:
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]