import React from 'react';
import { List, Divider, Paper } from '@mui/material';
import ConversationListItem from '../ConversationListItem/ConversationListItem';

/**
 * Composant ConversationList. Il contient la liste des conversations.
 */
export default class ConversationList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
        };
    }

    /**
     * Récupère la liste des conversations et les stocke dans le state.
     */
    componentDidMount() {
        this.fetchConversations(
            () => {
                this.props.loadConversation(this.props.loadConversation(this.state.conversations[0]._id));
            }
        );
    }

    /**
     * Refresh la liste des conversations si la props refreshConversations est à true.
     * @param {*} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(this.props.refreshConversations){
            this.fetchConversations();
            this.props.didRefreshConversations();
        }
    }

    /**
     * fait une requête pour récupérer la liste des conversations.
     * execute la fonction loadConversation si elle est passée en paramètre.
     * @param {function} loadConversation : callback pour charger la conversation après avoir récupéré la liste des conversations.
     */
    fetchConversations(loadConversation) {
        fetch(process.env.REACT_APP_API_URL + '/messages/conversations/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem('token')
            },
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.conversations) {
                    this.setState({
                        conversations: data.conversations,
                    })
                    if(this.state.conversations.length > 0){
                        if(loadConversation){
                            loadConversation();
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    render() {
        return (
            <Paper className='conversations' square={true}>
                <List>
                    {this.state.conversations.map((conversation) => (
                        <ConversationListItem key={conversation._id} conversation={conversation} loadConversation={this.props.loadConversation} />
                    ))}
                </List>
            </Paper>
        )
    }
}