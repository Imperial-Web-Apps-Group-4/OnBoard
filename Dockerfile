FROM ruby:2.4
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /onboard
WORKDIR /onboard
ADD Gemfile /onboard/Gemfile
ADD Gemfile.lock /onboard/Gemfile.lock
RUN bundle install
ADD . /onboard
