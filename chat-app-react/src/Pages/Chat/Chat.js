import * as React from 'react';
import { Navigate } from 'react-router-dom';
import './Chat.css';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import ConversationList from '../../Components/ConversationList/ConversationList';
import Messages from '../../Components/Messages/Messages';


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

    sendMessage(message) {
        if(this.state.conversationId == null) return;
        if (this.state.ws == null) {
            this.connectToWebSocket();
        }
        this.state.ws.send(JSON.stringify({
            token: localStorage.getItem('token'),
            message: message,
            receiver: this.state.conversationId,
        }));
    }

    connectToWebSocket() {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            if (localStorage.getItem('token') == null) return;

            console.log('WebSocket Client Connected');
            ws.send(JSON.stringify({
                token: localStorage.getItem('token'),
            }));
        }
        ws.onclose = () => {
            console.log('WebSocket Client Disconnected');
            this.setState({ ws: null });
        }

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

    componentDidUpdate() {
        if (this.state.ws == null) {
            this.connectToWebSocket();
        }
    }

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