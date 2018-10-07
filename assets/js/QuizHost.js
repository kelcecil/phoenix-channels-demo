import React from 'react';

export class QuizHost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answers: [],
            newAnswer: '',
        }
        this.addAnswer = this.addAnswer.bind(this);
    }

    componentWillMount() {
      const { channel } = this.props;
      channel.join()
        .receive("ok", resp => { 
            console.log("Joined successfully", resp);            
        })
        .receive("error", resp => { console.log("Unable to join", resp) });
    }

    handleQuestionChange(question) {
        this.setState({
            question: question,
        })
    }

    handleAnswerChange(answer) {
        this.setState({
            newAnswer: answer,
        });
    }
    addAnswer() {
        this.setState((prevState) => ({
            newAnswer: '',
            answers: prevState.answers.concat(prevState.newAnswer),
        }));
    }
    removeAnswer(i) {
        this.setState((prevState) => ({
            answer: prevState.answers.splice(i, 1),
        }))
    }
    sendQuestion() {
        const { question, answers } = this.state;
        const { sendQuestion, channel } = this.props;
        this.setState({
            question: '',
            answers: [],
            newAnswer: '',
        });
        channel.push('new_question', {question, answers})
    }

    render() {
        const { question, answers, newAnswer } = this.state;

        return (
            <React.Fragment>
                <p>Question: </p>
                <textarea value={question} onChange={(e) => this.handleQuestionChange(e.target.value)}></textarea>

                <label htmlFor="answer" /><input value={newAnswer} onChange={(e) => this.handleAnswerChange(e.target.value)} name="answerBox" type="text" length="50"></input>
                <button onClick={() => this.addAnswer()}>Add answer</button>

                <ul>
                {answers.map((answer, i) => (
                    <div key={i}>
                        <li key={i}>{answer} <button onClick={() => this.removeAnswer(i)}>Remove</button></li>
                    </div>
                ))}
                </ul>

                <button onClick={() => this.sendQuestion()}>Send</button>
            </React.Fragment>
        );
    }
}