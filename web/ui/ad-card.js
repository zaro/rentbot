import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import Lightbox from 'react-images';
import FontIcon from 'material-ui/FontIcon';


class ResultComponent extends React.Component {
  state = {
    lightboxIsOpen: false,
    currentImage: 0,
  }
  openLightbox = () => {
    this.setState({lightboxIsOpen: true})
  }
  closeLightbox = () => {
    this.setState({lightboxIsOpen: false})
  }
  nextImage = () => {
    const {ad} = this.props;
    let next = this.state.currentImage + 1;
    if (next >= ad.images.length) {
      next = 0;
    }
    this.setState({currentImage: next})
  }
  prevImage = () => {
    const {ad} = this.props;
    let prev = this.state.currentImage - 1;
    if (prev >= ad.images.length) {
      prev = ad.images.length-1;
    }
    this.setState({currentImage: prev})
  }
  render() {
    const {ad, listIndex, listTotal } = this.props;
    const bullets = ad.bullets || [];
    const details = [];
    for(const k in ad.details) {
      const v = ad.details[k];
      details.push(`${v.name}: ${v.value}`);
    }
    return (
      <Card>
        <CardTitle
          title={<div><a href={ad.url} target='_blank'>{ad.price_euro && `[${ad.price_euro} €]`} {ad.title || 'Виж оригиналната обява'} <FontIcon className="material-icons" >link</FontIcon></a><div style={{float: 'right'}}>{listIndex}/{listTotal}</div></div>}
          subtitle={`Дата: ${new Date(ad.time).toLocaleString()}, Id: ${ad.source_id}`}
        />
        <CardMedia>

          <div style={styles.root}>
            <GridList  style={styles.gridList} cols={2.2}>
            {ad.images && ad.images.map((url, idx) => (
              <GridTile key={idx}>
                <img src={url} onClick={this.openLightbox}/>
              </GridTile>
            ))}
          </GridList>
          <Lightbox
            showThumbnails={true}
            backdropClosesModal={true}
            currentImage={this.state.currentImage}
            imageCountSeparator=' от '
            images={ad.images.map(src => ({src}))}
            isOpen={this.state.lightboxIsOpen}
            onClickPrev={this.prevImage}
            onClickNext={this.nextImage}
            onClickImage={(e)=>{e.preventDefault(); e.stopPropagation(); this.nextImage()}}
            onClickThumbnail={(currentImage)=>{this.setState({currentImage})}}
            onClose={(e)=>{this.closeLightbox()}}
          />
          </div>
        </CardMedia>
        <CardText>
          <div style={styles.description}>{ad.description}</div>
          <div style={styles.wrapper}>
            {
              details.map(b => <Chip style={styles.chip} key={b}>{b}</Chip>)
            }
          </div>
          <div style={styles.wrapper}>
            {
              bullets.map(b => <Chip style={styles.chip} key={b}>{b}</Chip>)
            }
          </div>
        </CardText>
      </Card>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
  wrapper: {
    marginTop: '.5em',
    marginBottom: '.5em',
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  description: {
    marginTop: '.5em',
    marginBottom: '.5em',
    fontSize: 'large',
  }
};


export default ResultComponent;
