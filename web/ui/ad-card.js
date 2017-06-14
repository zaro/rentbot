import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
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
    const {ad, listIndex, listTotal, isFavourite, addFavourite, removeFavourite} = this.props;
    const description = (ad.description || "");
    const images = ad.images || [];
    const bullets = ad.bullets || [];
    const details = [];
    for(const k in ad.details) {
      const v = ad.details[k];
      details.push(`${v.name}: ${v.value}`);
    }
    let r;
    const urlRegex = /(https?:\/\/\S+)/gi;
    let idx = 0;
    const descriptionArray = []
    while((r = urlRegex.exec(description)) !== null) {
      // console.log('TEXT',description.substr(idx, r.index-idx));
      // console.log('URL',r[0]);
      descriptionArray.push(description.substr(idx, r.index-idx))
      descriptionArray.push(<a href={r[0]} target="_blank" key={idx} >{r[0]}</a>)
      idx = urlRegex.lastIndex;
    }
    if (!descriptionArray.length) {
      descriptionArray.push(description)
    }
    return (
      <Card>
        <CardTitle
          title={
            <div>
              <a href={ad.url} target='_blank'><h1 style={styles.h1}>{ad.price_euro && `[${ad.price_euro} €]`} {ad.title || 'Виж оригиналната обява'} <FontIcon className="material-icons" >link</FontIcon></h1></a>
              { (listIndex && listTotal) && (<div style={{float: 'right'}}>{listIndex}/{listTotal}</div>)}
            </div>
          }
          subtitle={`Дата: ${new Date(ad.time).toLocaleString()}, Id: ${ad._id}`}
        >{ad.location_name}</CardTitle>
        <CardMedia>

          <div style={styles.root}>
            <GridList  style={styles.gridList} cols={2.2}>
            {images.map((url, idx) => (
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
            images={images.map(src => ({src}))}
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
          <div style={styles.description}>{descriptionArray}</div>
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
          {addFavourite &&(
            <IconButton style={styles.favButton} onTouchTap={() => {isFavourite ? removeFavourite(ad._id) : addFavourite(ad._id)}}>
              { isFavourite
                ?<FontIcon className="material-icons" >favorite</FontIcon>
                :<FontIcon className="material-icons" >favorite_border</FontIcon>
              }
            </IconButton>
          )}
          <div style={{'height':".5em"}}></div>
        </CardText>
        <CardActions >
        </CardActions>
      </Card>
    );
  }
}

const styles = {
  h1: {
    fontSize: 'large',
  },
  favButton: {
    float: 'right',
  },
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
    overflow: 'hidden',
  }
};


export default ResultComponent;
