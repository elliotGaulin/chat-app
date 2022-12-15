import { Button, Input, Paper } from "@mui/material";
import { Component } from "react";
import { Navigate } from "react-router-dom";
import "./Login.css";
import { Buffer } from "buffer";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loggedIn: false,
            loading: false,
        };
        this.login = this.login.bind(this);
    }

    login(){
        console.log(process.env);
        this.setState({loading: true});
        fetch(process.env.REACT_APP_API_URL + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
         }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({loading: false});
            if (data.user) {
                this.props.saveUser(data.user);
                let token = this.state.username + ":" + this.state.password;
                token = Buffer.from(token).toString('base64');
                localStorage.setItem('token', token);
                this.setState({
                    loggedIn: true,
                    loading: false,
                })
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            this.setState({loading: false});
        });
    }


    render() {
        if(this.state.loggedIn) {
            return (
                <Navigate to={"/"} />
            )
        }
        return (
            <div className="login">
                {this.state.loading ? <LoadingSpinner/>: null}
                <Paper className="paper">
                    <form>
                        <Input
                            placeholder="Username"
                            fullWidth={true}
                            margin="dense"
                            onChange={e => this.setState({
                                username: e.target.value
                            })}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            fullWidth={true}
                            margin="dense"
                            onChange={e => this.setState({
                                password: e.target.value
                            })}
                        />
                        <Button type="button" color="primary" onClick={this.login}>
                            Log in
                        </Button>
                    </form>
                </Paper>
            </div>
        );
    }
} 