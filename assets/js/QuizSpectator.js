import React from 'react';
import { Presence } from 'phoenix';

export class QuizSpectator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waitingForFirstQuestion: true,
            question: '',
            answers: {},
            participants: {},
        }
        this.updateQuestion = this.updateQuestion.bind(this);
    }

    componentWillMount() {
        const { channel } = this.props;
        const { participants } = this.state;

        channel.on('new_question', payload => {
            this.setState({
                question: payload.question,
                answers: payload.answers.reduce((result, item, index, array) => {
                    result[index] = [];
                    return result;
                  }, {}),
            })
        });

        channel.on('answered_question', (payload) => {
            this.setState(({answers: prevAnswers}) => {
                console.log(prevAnswers);
                const guessedBefore = prevAnswers[payload.answer].includes(payload.user);
                let guessedList = prevAnswers[payload.answer];
                if (!guessedBefore) {
                    guessedList = guessedList.concat(payload.user);
                }
                let newAnswers = prevAnswers;
                newAnswers[payload.answer] = guessedList;
                return {
                    answers: newAnswers,
                }
            })
        });

        channel.on('presence_state', (state) => {
            this.setState(({participants: oldParticipants}) => {
                let newParticipants = Presence.syncState(oldParticipants, state);
                console.log('state ' + newParticipants);
                return {
                    participants: newParticipants,
                }
            });
        });

        channel.on("presence_diff", (diff) => {
            this.setState(({participants: oldParticipants}) => {
                let newParticipants = Presence.syncDiff(oldParticipants, diff);
                console.log('diff ' + newParticipants);
                return {
                    participants: newParticipants,
                }
            });
        })

        channel.join()
            .receive("ok", resp => { 
            console.log("Joined successfully", resp);
                this.setState({
                    connected: true,
                    question: resp.question,
                    answers: resp.answers.reduce((result, item, index, array) => {
                        result[item] = [];
                        return result;
                      }, {}),
                });              
        })
        .receive("error", resp => { console.log("Unable to join", resp) })
    }

    updateQuestion({question, answers}) {
        this.setState({
            waitingForFirstQuestion: false,
            question,
            answers,
        })
    }

    render() {
        const { question, answers, participants } = this.state;
        if (question === null || question === '') {
            return (
                <React.Fragment>
                    <p>Waiting for first question to be delivered</p>
                    <Participants participants={participants} />
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <h1>Current question: </h1>
                <h2>{question}</h2>

                <h1>Answers</h1>
                <ul>
                {Object.keys(answers).map((key, i) => {
                    console.log(key);
                    return (
                        <div key={i}>
                            <li key={i}>{key}</li>
                            <ul>
                                {
                                    answers[key].map((name, i) => {
                                        console.log(name);
                                        return (
                                            <li key={i}>{name}</li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    );
                })}
                </ul>
                <Participants participants={participants}  />
            </React.Fragment>
        );
    }
}

const Participants = ({participants}) => (
    <React.Fragment>
        <h2>Connected users:</h2>
        {Object.keys(participants).map((key, i) => (
            <p key={i}>{key}</p>
        ))}
    </React.Fragment>
);
