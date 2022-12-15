import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingSpinner.css';

export default class LoadingSpinner extends React.Component {
    render() {
        return (
            <div className='loading'>
                <CircularProgress />
            </div>
        )
    }
}