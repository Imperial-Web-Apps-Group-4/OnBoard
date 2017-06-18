require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Onboard
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Produce source map for development environments for Browserified scripts
    config.browserify_rails.source_map_environments << "development"
    # Avoid having to clear the cache when updating onboard-shared
    config.browserify_rails.evaluate_node_modules = true
  end
end
