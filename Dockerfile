FROM kianm/onboard-template@sha256:046f3cf8422d692dee08a459a728cca937d9530247cbcacc032602ea0655ae62

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
