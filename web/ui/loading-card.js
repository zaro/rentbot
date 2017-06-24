import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'react-toolbox/lib/card';
import ProgressBar from 'react-toolbox/lib/progress_bar';


const LoadingCard = () => {
    return (
      <Card>
        <CardText>
          <div>
            <div style={styles.centerSpinner}>
              <ProgressBar type="circular" />
            </div>
          </div>
        </CardText>
        <CardActions >
        </CardActions>
      </Card>
    );
}

const styles = {
  centerDiv: {
    width: '100%',
    textAlign: 'center',
  },
  stateMessage: {
    marginTop: '5em',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '35%',
    fontSize: '2em',
    color: 'rgba(55,55,55,0.87)',
    textAlign: 'center',
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '35%',
    fontSize: '1.5em',
    color: 'rgba(55,55,55,0.87)',
    textAlign: 'center',
  },
  centerSpinner: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}


export default LoadingCard;
