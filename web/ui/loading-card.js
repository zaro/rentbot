import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import Lightbox from 'react-images';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';


const LoadingCard = () => {
    return (
      <Card>
        <CardText>
          <div>
            <div style={styles.centerSpinner}>
              <CircularProgress />
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
