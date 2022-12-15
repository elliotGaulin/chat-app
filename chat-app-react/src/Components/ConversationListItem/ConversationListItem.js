import { ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

export default class ConversationListItem extends React.Component {
    render() {
        return (
            <ListItemButton onClick={
                () => {
                    this.props.loadConversation(this.props.conversation._id);
                }
            }>
                <ListItemText
                    primary={this.props.conversation.user.username}
                    secondary={this.props.conversation.lastMessage.message}
                />
            </ListItemButton>
        );
    }
}