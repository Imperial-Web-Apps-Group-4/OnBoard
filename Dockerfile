FROM kianm/onboard-template@sha256:03137c5b6df97f74310ca5d10b9f683795df495b055c6e87f5c1dcbc71139f04

# Set up directories
RUN mkdir /onboard
RUN mkdir /onboard/tmp
WORKDIR /onboard

# Install gems
COPY Gemfile /onboard/Gemfile
COPY Gemfile.lock /onboard/Gemfile.lock
RUN bundle install

# Install NPM packages
COPY package-lock.json /onboard/package-lock.json
COPY package.json /onboard/package.json
RUN npm install

# Copy application files
COPY . /onboard
