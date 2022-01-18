import React, { FC, useEffect, useRef } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
import 'ol/ol.css';
import {Map, View } from 'ol';
import {defaults as defaultInteractions} from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import { v4 as uuidv4 } from 'uuid';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Circle, Fill, Stroke, Style} from 'ol/style';

interface MapComponentProps {
  classes: any,
  longitude: number;
  latitude: number;
  height?: number;
}

const styles = (): StyleRules => ({
  root: {

  },
});

const stroke = new Stroke({color: 'black', width: 1});
const fill = new Fill({color: 'rgb(41, 120, 232)'});

export const MapComponent: FC<MapComponentProps> = ({ classes, longitude, latitude, height = 250 }) => {
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
      interactions: defaultInteractions({
        onFocusOnly: true,
        dragPan: false,
        mouseWheelZoom: false,
      }),
      target: `map-container-${randomId.current}`,
      layers: [
        new TileLayer({
          source: new OSM()
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
    <div tabIndex={1} id={`map-container-${randomId.current}`} className={classes.root} style={{ height }}/>
  );
};

export default withStyles(styles)(MapComponent);
