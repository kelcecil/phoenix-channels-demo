import React from 'react';

export class Quiz extends React.Component {
    constructor(props) {
        super(props); 
        
        const { channel } = this.props;

        this.state = {
            connected: false,
            question: '',
            answers: [],
            selectedAnswer: '',
        }

        this.sendAnswer = this.sendAnswer.bind(this);
    }
    sendAnswer(value) {
        const { channel } = this.props;
        console.log('value: ' + value);
        channel.push('answer_question', {
            user: "Kel",
            answer: value,
        });
        this.setState({
            selectedAnswer: value,
        });
    }

    componentWillMount() {
        const { channel } = this.props;
        channel.join()
            .receive("ok", resp => { 
                console.log("Joined successfully", resp);
                this.setState({
                    connected: true,
                    question: resp.question,
                    answers: resp.answers,
                    selectedAnswer: '',
                });              
            })
            .receive("error", resp => { console.log("Unable to join", resp) })
        channel.on('new_question', payload => {
            this.setState({
                question: payload.question,
                answers: payload.answers,
            })
        });
    }

    render() {
        const { connected, waitingForFirstQuestion, question, answers } = this.state;
        if (!connected) {
            return (<p>Waiting to connect.</p>)
        }
        if (question == null || question == '') {
            return (<p>Waiting for the first question to be delivered</p>);
        }
        return (
            <React.Fragment>
                <Question text={question} />
                {answers.map((answer, i) => (
                    <Answer key={i} text={answer} onClick={this.sendAnswer} />
                ))}
            </React.Fragment>
        )
    }
}

class Question extends React.Component {
    render() {
        const { text } = this.props;

        return (
            <React.Fragment>
                <strong>Q: </strong>
                <p>{text}</p>
            </React.Fragment>
        );
    }
}

const Answer = ({text, onClick}) => (
    <button onClick={(e) => onClick(text)}>{text}</button>
)
