import { Button, Paper, TextField } from '@mui/material';
import React from 'react';
import './ChatFooter.css'

/**
 * Composant ChatFooter. Il contient la zone de texte pour écrire un message et le bouton pour envoyer le message.
 */
export default class ChatFooter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: "",
            messageError: "",

        };
        this.handleSend = this.handleSend.bind(this);
    }

    /**
     * Envoie le message en utilisant la fonction sendMessage du composant parent.
     * @returns {void}
     */
    handleSend = () => {
        if(this.state.message.length === 0){
            this.setState({
                messageError: "Message cannot be empty"
            })
            return;
        }
        this.props.sendMessage(this.state.message);
    }

    render(){
        return(
            <Paper className='chatFooter' square={true}>
                <TextField 
                    fullWidth
                    sx={{
                        flex: 6,
                        marginRight: "0.5em",
                    }}
                    label="Message"
                    error={this.state.messageError.length > 0}
                    helperText={this.state.messageError}
                    onChange={(event) => {
                        this.setState({
                            message: event.target.value,
                            messageError: "",
                        })
                    }}
                    
                />
                <Button fullWidth sx={{flex:1, padding:2}} variant="outlined" onClick={this.handleSend}>Send</Button>
            </Paper>
        )
    }
}