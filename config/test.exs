use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :channel_demo, ChannelDemoWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :channel_demo, ChannelDemo.Repo,
  username: "postgres",
  password: "postgres",
  database: "channel_demo_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
