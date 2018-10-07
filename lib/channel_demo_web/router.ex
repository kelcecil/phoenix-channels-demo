defmodule ChannelDemoWeb.Router do
  use ChannelDemoWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChannelDemoWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/show-host", PageController, :host
    get "/spectate", PageController, :spectate
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChannelDemoWeb do
  #   pipe_through :api
  # end
end
