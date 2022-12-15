import * as React from 'react';
import { Navigate } from 'react-router-dom';
import './Chat.css';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import ConversationList from '../../Components/ConversationList/ConversationList';
import Messages from '../../Components/Messages/Messages';

/**
 * Page Chat. Elle affiche la liste des conversations et les messages de la conversation sélectionnée.
 */
export default class ChatPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: [],
            refreshConversations: false,
        };

        this.getUser = this.getUser.bind(this);
        this.loadConversation = this.loadConversation.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.connectToWebSocket = this.connectToWebSocket.bind(this);
        this.didRefreshConversations = this.didRefreshConversations.bind(this);
    }

    /**
     * Récupère les informations de l'utilisateur connecté.
     */
    getUser() {
        this.setState({ loading: true });
        fetch(process.env.REACT_APP_API_URL + '/users/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem('token')
            },
        }).then(response => response.json())
            .then(data => {
                this.setState({ loading: false });
                if (data.user) {
                    this.props.setUser(data.user);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ loading: false });
            });
    }
    
    /**
     * Envoie un message dans la conversation sélectionnée.
     * @param {string} message : message à envoyer.
     */
    sendMessage(message) {
        if(this.state.conversationId == null) return;
        
        //Pour empecher l'envoi de message lorsqu'on n'est pas connecté.
        if (this.state.ws == null) {
            this.connectToWebSocket();
        }
        this.state.ws.send(JSON.stringify({
            token: localStorage.getItem('token'),
            message: message,
            receiver: this.state.conversationId,
        }));
    }

    /**
     * Crée la connexion avec le serveur WebSocket et la stocke dans le state. 
     */
    connectToWebSocket() {
        const ws = new WebSocket("ws://localhost:8080");

        //Lorsque la connexion est établie, on envoie le token de l'utilisateur.
        ws.onopen = () => {
            if (localStorage.getItem('token') == null) return;

            console.log('WebSocket Client Connected');
            ws.send(JSON.stringify({
                token: localStorage.getItem('token'),
            }));
        }

        //Lorsque la connexion est fermée, on supprime la connexion du state.
        ws.onclose = () => {
            console.log('WebSocket Client Disconnected');
            this.setState({ ws: null });
        }

        //Lorsque le serveur envoie un message, on l'ajoute à la conversation et on met à jour la liste des conversations pour afficher le dernier message. 
        ws.onmessage = (message) => {
            let json = JSON.parse(message.data);
            console.log("message received");

            if (json.sender._id === this.state.conversationId || json.receiver._id === this.state.conversationId) {
                console.log("message is for this conversation");
                this.setState({
                    messages: [...this.state.messages, json],
                });
            }
            this.setState({ refreshConversations: true });

        }

        this.setState({ ws: ws });
    }


    componentDidMount() {
        if (this.props.user == null && localStorage.getItem('token') != null) {
            this.getUser();
        } else {
            this.setState({ loading: false });
        }
    }

    //Reconnexion au WebSocket si la connexion est perdue.
    componentDidUpdate() {
        if (this.state.ws == null) {
            this.connectToWebSocket();
        }
    }

    /**
     * Charge les messages de la conversation sélectionnée.
     * @param {*} conversationId 
     */
    loadConversation(conversationId) {
        this.setState({ loading: true });
        fetch(process.env.REACT_APP_API_URL + '/messages/conversations/' + conversationId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem('token')
            },
        }).then(response => response.json())
            .then(data => {
                this.setState({ loading: false });
                if (data.messages) {
                    this.setState({
                        conversationId: conversationId,
                        messages: data.messages,
                    });
                }
            });
    }

    /**
     * Demande au composant ConversationList de se rafraichir.
     */
    didRefreshConversations = () => {
        this.setState({ refreshConversations: false });
    }

    render() {
        if (this.props.user == null && !this.state.loading) {
            return <Navigate to="/login" />
        }

        return (
            <div>
                {this.props.loading ? <LoadingSpinner /> : null}
                <div className='main'>
                    <ConversationList loadConversation={this.loadConversation} refreshConversations={this.state.refreshConversations} didRefreshConversations={this.didRefreshConversations} />
                    <Messages messages={this.state.messages} sendMessage={this.sendMessage} user={this.props.user} />
                </div>
            </div>
        )
    }
}