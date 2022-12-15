import React from 'react';
import ChatFooter from '../ChatFooter/ChatFooter';
import Message from './Message';

/**
 * Composant Messages. Il affiche la messages dans la page chat.
 * Il contient le composant ChatFooter et la liste des messages reçus.
 */
export default class Messages extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * si le nombre de messages a changé, on scroll vers le bas pour afficher le nouveau message.
     * @param {*} prevProps 
     */
    componentDidUpdate(prevProps) {
        if (prevProps.messages.length !== this.props.messages.length) {
            this.scrollToBottom();
        }
    }

    /**
     * Scroll vers le bas de la page.
     */
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
                {/* Boucle à travers les messages pour afficher le composant.
                Si le message est envoyé par l'utilisateur, on place le message à droite
                */}
                {this.props.messages.map((message) => (
                    <Message message={message} key={message._id} right={this.props.user._id === message.sender._id}/>
                ))}
                {/* Composant pour scroller vers le bas de la page */}
                <div ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
                <ChatFooter sendMessage={this.props.sendMessage}/>
            </div>
        )
    }
}