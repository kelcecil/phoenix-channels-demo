defmodule ChannelDemo.QuestionStore do
  use Agent

  def start_link(initial_state) do
    Agent.start_link(fn -> initial_state end, name: __MODULE__)
  end

  def set_question(question, answers) do
    Agent.update(__MODULE__, fn state ->
      state
      |> put_in([:question], question)
      |> put_in([:answers], answers)
    end)
  end

  def get_current_question() do
    Agent.get(__MODULE__, fn state ->
      %{question: state[:question], answers: state[:answers]}
    end)
  end

  def get_scores() do
    Agent.get(__MODULE__, fn state ->
      state[:scores]
    end)
  end

  def increment_score(name) do
    Agent.update(__MODULE__, fn state ->
      put_in(state, [:scores, name], state[:scores][name] + 1)
    end)
  end
end
