defmodule ChannelDemoWeb.RoomChannel do
  use Phoenix.Channel
  alias ChannelDemoWeb.Presence

  def join("room:lobby", params, socket) do
    IO.inspect(params, label: "On lobby join")
    send(self(), :after_join)
    reply = Map.merge(
        ChannelDemo.QuestionStore.get_current_question(),
        %{}
    )
    {:ok, reply, assign(socket, :user, params["user"])}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.user, %{
      online_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end

  def handle_in("answer_question", %{"user" => user, "answer" => answer}, socket) do
    broadcast! socket, "answered_question", %{user: user, answer: answer}
    {:noreply, socket}
  end

  def handle_in("new_question", %{"question" => question, "answers" => answers}, socket) do
    ChannelDemo.QuestionStore.set_question(question, answers)
    IO.inspect(ChannelDemo.QuestionStore.get_current_question())
    broadcast! socket, "new_question", %{question: question, answers: answers}
    {:noreply, socket}
  end
end
