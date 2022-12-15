import React from 'react';
import ChatFooter from '../ChatFooter/ChatFooter';
import Message from './Message';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.messages.length !== this.props.messages.length) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div className='messages'>
                <div className='messages_body'>
                {this.props.messages.map((message) => (
                    <Message message={message} key={message._id} right={this.props.user._id === message.sender._id}/>
                ))}
                <div ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
                <ChatFooter sendMessage={this.props.sendMessage}/>
            </div>
        )
    }
}