defmodule ChannelDemoWeb.PageController do
  use ChannelDemoWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def host(conn, _params) do
    render conn, "host.html"
  end

  def spectate(conn, _params) do
    render conn, "spectate.html"
  end
end
