import React, { FC, useEffect, useRef } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import 'ol/ol.css';
import {Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import uuidv4 from 'uuid/v4';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Fill, RegularShape, Circle, Stroke, Style} from 'ol/style';

interface MapComponentProps {
  classes: any,
  longitude: number;
  latitude: number;
}

const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
  },
});

const stroke = new Stroke({color: 'black', width: 1});
const fill = new Fill({color: 'rgb(41, 120, 232)'});

export const MapComponent: FC<MapComponentProps> = ({ classes, longitude, latitude }) => {
  const mapRef = useRef<Map>(null);
  const randomId = useRef<string>(uuidv4());

  useEffect(() => {
    const circle = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude]))
    });

    circle.setStyle(new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 8,
      })
    }));
    
    const vectorSource = new VectorSource({
      features: [circle]
    });
    
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    mapRef.current = new Map({
      target: `map-container-${randomId.current}`,
      layers: [
        new TileLayer({
          source: new XYZSource({
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
          })
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 15
      })
    });
  }, [longitude, latitude]);

  return (
    <div id={`map-container-${randomId.current}`} className={classes.root}/>
  );
};

export default withStyles(styles)(MapComponent);
