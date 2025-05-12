import {h, Component} from 'preact';

export default class MapboxMap extends Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtaWN1dCIsImEiOiJMVzF2NThZIn0.WO0ArcIIzYVioen3HpfugQ';
    var mapCenter = this.props.center || [35.507126,33.883812];
    this.map = new mapboxgl.Map({
      container: this._map,
      style: 'mapbox://styles/kamicut/cinort42e0044btm4ni0q4t5t',
      center: mapCenter,
      maxBounds: [[35.445671,33.860010],[35.550556,33.920144]],
      zoom: 12.5 // starting zoom
    });

    // Force a rerender
    setTimeout(() => this.map.resize(), 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.center && nextProps.center[0] != 0) {
      this.map.flyTo({center: nextProps.center, zoom: 17});
      this.center = nextProps.center;

      // Remove existing selected marker if it exists
      if (this.selectedMarker) {
        this.selectedMarker.remove();
      }

      // Add a new marker for the selected location
      this.selectedMarker = new mapboxgl.Marker({
        color: 'blue',
        scale: 1.5
      })
        .setLngLat(nextProps.center)
        .addTo(this.map);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return h('div', {
      id: 'map',
      style: 'position:absolute; top:0; bottom:0; width:100%; z-index: -1',
      ref: (m) => this._map = m});
  }
}
