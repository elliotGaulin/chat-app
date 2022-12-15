import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingSpinner.css';

/**
 * Composant LoadingSpinner. Il affiche un spinner de chargement.
 */
export default class LoadingSpinner extends React.Component {
    render() {
        return (
            <div className='loading'>
                <CircularProgress />
            </div>
        )
    }
}