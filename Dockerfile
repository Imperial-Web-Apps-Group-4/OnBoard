FROM ruby:2.4

# Install prereqs
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev \
  libxml2-dev libxslt1-dev nodejs postgresql-client npm

# Install default gems
RUN gem install nokogiri -v '1.7.2'
RUN gem install pg -v '0.20.0'
RUN gem install byebug -v '9.0.6'
RUN gem install puma -v '3.8.2'
RUN gem install ffi -v '1.9.18'
RUN gem install bindex -v '0.5.0'

# Set up node
RUN ln -s /usr/bin/nodejs /usr/bin/node
# Install browserify
RUN npm install -g browserify browserify-incremental

# Set up directories
RUN mkdir /onboard
RUN mkdir /onboard/tmp
WORKDIR /onboard

# Install gems
COPY Gemfile /onboard/Gemfile
COPY Gemfile.lock /onboard/Gemfile.lock
RUN bundle install

# Copy application files
COPY . /onboard
