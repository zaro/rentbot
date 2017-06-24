import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'react-toolbox/lib/card';
import Gallery from './gallery';
import Chip from 'react-toolbox/lib/chip';
import { IconButton } from 'react-toolbox/lib/button';
import Lightbox from 'react-images';
import FontIcon from 'react-toolbox/lib/font_icon';
import styles from './css/app.css';


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
      <Card className={styles.adcard}>
          <div className={styles.title}>
            <a href={ad.url} target='_blank'>
              <h1>{ad.price_euro && `[${ad.price_euro} €]`} {ad.title || 'Виж оригиналната обява'}</h1>
              <FontIcon className="material-icons">link</FontIcon>
            </a>
            { (listIndex && listTotal) && (<div className={styles.counter}>{listIndex}/{listTotal}</div>)}
            <div className={styles.subtitle}>
              {`Дата: ${new Date(ad.time).toLocaleString()}, Id:`}
              <a href={`/${ad._id}`}>{ad._id}</a>
            </div>
            <div className={styles.location}>{ad.location_name}</div>
          </div>
        <CardMedia>
          {(images && images.length>0)
            ? <Gallery heading="Снимки" showThumbnails images={images.map(src => ({src, thumbnail:src}))} />
            :null
          }
        </CardMedia>
        <CardText>
          <div className={styles.description}>{descriptionArray}</div>
          <div className={styles.wrapper}>
            {
              details.map(b => <Chip  key={b}>{b}</Chip>)
            }
          </div>
          <div className={styles.wrapper}>
            {
              bullets.map(b => <Chip  key={b}>{b}</Chip>)
            }
          </div>
          {addFavourite &&(
            <IconButton className={styles.favButton} onClick={() => {isFavourite ? removeFavourite(ad._id) : addFavourite(ad._id)}}>
              { isFavourite
                ?<FontIcon className="material-icons" >favorite</FontIcon>
                :<FontIcon className="material-icons" >favorite_border</FontIcon>
              }
            </IconButton>
          )}
          <div className={styles.spacer}></div>
        </CardText>
        <CardActions >
        </CardActions>
      </Card>
    );
  }
}



export default ResultComponent;
