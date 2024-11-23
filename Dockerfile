# Use the electronuserland/builder image for multi-platform Electron builds
FROM electronuserland/builder:18

# Set the working directory inside the container
WORKDIR /app

# Install Python and ensure it's set correctly
RUN apt-get update && apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && apt-get install -y python3.11 python3.11-distutils python3-pip && \
    ln -sf /usr/bin/python3.11 /usr/bin/python@3.11

# Bootstrap the latest version of pip and install setuptools + wheel
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python && \
    pip install --no-cache-dir --upgrade setuptools wheel

# Set the PYTHON environment variable globally for node-gyp
ENV PYTHON=/usr/bin/python

# # Copy only package.json and lock files first for dependency installation
# COPY package.json package-lock.json ./

# # Install project dependencies
# RUN npm install

# # Copy the rest of the application source code
# COPY . .

# # Set environment variables for caching
# ENV ELECTRON_CACHE=/root/.cache/electron
# ENV ELECTRON_BUILDER_CACHE=/root/.cache/electron-builder

# # Ensure all dependencies for electron-builder are installed
# RUN npm run postinstall

# # Set default command to start the build process
# CMD ["npm", "run", "build"]
