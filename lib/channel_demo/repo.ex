defmodule ChannelDemo.Repo do
  use Ecto.Repo,
    otp_app: :channel_demo,
    adapter: Ecto.Adapters.Postgres
end
