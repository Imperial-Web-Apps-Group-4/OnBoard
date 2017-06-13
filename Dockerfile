FROM kianm/onboard-template

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
