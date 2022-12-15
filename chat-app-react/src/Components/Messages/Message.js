import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';

export default class Message extends React.Component {
    render() {
        return (
            <Card sx={{
                maxWidth: "80%",
                margin: "1em",
                marginLeft : !this.props.right ? "1em" : "auto",
            }}>
                <CardContent>
                    <Typography variant="h6">
                        {this.props.message.sender.username}
                    </Typography>
                    {this.props.message.message}
                </CardContent>
            </Card>
        )
    }
}