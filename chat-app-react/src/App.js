import './App.css';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginPage from './Pages/Login/Login';
import ChatPage from './Pages/Chat/Chat';
import { Routes, Route, BrowserRouter } from 'react-router-dom';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null
    };

    this.logout = this.logout.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  logout() {
    this.setState({
      loggedIn: false,
      user: null
    });
    localStorage.removeItem('token');
  }

  saveUser = (user) => {
    this.setState({
      user: user
    });
  }

  render() {
    let logoutButton = <Button color="inherit" onClick={() => this.logout()}>Logout</Button>;
    return (
      <ThemeProvider theme={this.darkTheme}>
        <CssBaseline />

        <Box sx={{ flexGrow: 1, paddingTop: "64px"}} className="test" position="fixed">
          <AppBar>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {this.state.user == null ? "Chat App" : this.state.user.username.toUpperCase()}
              </Typography>
              {this.state.user != null ? logoutButton : null}
            </Toolbar>
          </AppBar>
        </Box>

        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage saveUser={this.saveUser}/>} />
            <Route path="/" element={<ChatPage user={this.state.user} setUser={this.saveUser}/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    );
  }
}

export default App;
