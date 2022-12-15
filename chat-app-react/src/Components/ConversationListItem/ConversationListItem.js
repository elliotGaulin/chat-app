import { ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

/**
 * Composant ConversationListItem. Il contient les informations d'une conversation.
 * si on clique sur le composant, il charge la conversation.
 */
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