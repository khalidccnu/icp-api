# Build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy all to the working directory
COPY . .

# Ensure scripts have Unix-style line endings
RUN find . -type f -name "*.sh" -exec sed -i 's/\r$//' {} +

# Install dependencies
RUN yarn install

# Build the project
RUN yarn pre:build && yarn build

# ====================================================== #

# Release stage
FROM node:20-alpine AS release

# Set the working directory
WORKDIR /app

# Copy only the build artifacts from the build stage
COPY --from=build /app/.env /app/.env
COPY --from=build /app/tsconfig.json /app/tsconfig.json
COPY --from=build /app/entrypoint.sh /app/entrypoint.sh
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Install only production dependencies
RUN yarn install --omit=dev

# Ensure the entrypoint script is executable
RUN ["chmod", "+x", "entrypoint.sh"]

# Expose the port that the app runs on
EXPOSE 3001

# Set the entrypoint for the container to run the entrypoint.sh script
ENTRYPOINT [ "sh", "entrypoint.sh" ]
