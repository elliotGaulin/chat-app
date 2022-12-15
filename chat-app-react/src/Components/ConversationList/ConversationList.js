import React from 'react';
import { List, Divider, Paper } from '@mui/material';
import ConversationListItem from '../ConversationListItem/ConversationListItem';

export default class ConversationList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
        };
    }

    componentDidMount() {
        this.fetchConversations(
            () => {
                this.props.loadConversation(this.props.loadConversation(this.state.conversations[0]._id));
            }
        );
    }

    componentDidUpdate(prevProps) {
        if(this.props.refreshConversations){
            this.fetchConversations();
            this.props.didRefreshConversations();
        }
    }

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