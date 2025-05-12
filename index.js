import 'whatwg-fetch';

import {h, render, Component} from 'preact';
import MapboxMap from './components/MapboxMap.js';
import Form from './components/form.js';
import {sectArToEn, getSectKey} from './components/SectPicker.js';
import labels from './i18n.json' with { type: 'json' };


/**
 * Processes the polling station data into an index
 * @param {Object[]} json
 * @return An index of the polling stations grouped by sect,gender
 */
function process(json) {
  var index = {};
  json.forEach((item) => {
    let {sect, gender, subdistrict} = item;
    sect = getSectKey(sectArToEn(sect));
    if (!index[sect]) {
      index[sect] = {};
    }
    if (!index[sect][subdistrict]) {
      index[sect][subdistrict] = {};
    }
    if (!index[sect][subdistrict][gender]) {
      index[sect][subdistrict][gender] = [];
    };
    index[sect][subdistrict][gender].push(item);
  });
  return index;
}

/**
 * Checks if the entered values exist in the index
 * @param {Object} index
 * @param {Object} entry
 * @returns {Object[]} list of matching polling stations
 */
function checkInIndex(index, entry) {
  let { sect, subdistrict, gender, val } = entry;
  var fromIndex = index[sect][subdistrict][gender];
  return fromIndex.filter((row) => {
    return Number(row.from) <= Number(val) &&
      Number(val) <= Number(row.to);
  });
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      center: null,
      error: '',
      selected: false,
      lang: 'ar',
      sect: '',
      subdistrict: '',
      sejjel: '',
      gender: '',
      location: null,
      room: '',
      kalam: ''
    };
    var self = this;
    fetch('public/polling_stations.csv')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch CSV data');
        return res.text();
      })
      .then((csvText) => {
        // Convert CSV to JSON
        const rows = csvText.split('\r\n').map(row => {
          const [name, station_name_combined, station_number, district, religion, gender, to_register, from_register, room, station_name, maps, latitude, longitude] = row.split(',');
          return { sect: religion, gender, subdistrict: district, from: from_register, to: to_register, place: station_name, room, kalam: station_name, maps, center: [longitude, latitude] };
        });
        return rows;
      })
      .then((json) => {
        return fetch('public/polling_stations.geojson')
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch GeoJSON data');
            return res.json();
          })
          .then((geojson) => {
            self.geo = geojson;
            self.data = process(json);
          });
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        self.setState({ error: 'Failed to load data. Please try again later.' });
      });
  }

  validateInput(e) {
    e.preventDefault();
    let {sect, subdistrict, gender, sejjel, lang} = this.state;
    console.log('VALIDATING INPUT', this.state);
    var valid = true;

    valid = valid && sect && sect.length > 0;
    console.log('VALID SECT', valid);
    valid = valid && subdistrict && subdistrict.length > 0;
    console.log('VALID SUBDISTRICT', valid);
    valid = valid && sejjel && sejjel.length > 0;
    console.log('VALID SEJJEL', valid);
    valid = valid && gender && (gender === 'ذكر' || gender === 'أنثى');
    console.log('VALID GENDER', valid);

    if (valid) {
      var locations = checkInIndex(this.data, {
        sect,
        subdistrict,
        gender,
        val: sejjel
      });
      if (locations.length > 0) {
        // Take the first one for now
        let new_location = locations[0];
        this.setState({
          center: new_location.center,
          maps: new_location.maps,
          room: new_location.room,
          kalam: new_location.kalam,
          selected: true,
          error: ''
        });
      } else {
        this.setState({
          error: labels[lang].errors.location_not_found
        });
      }
    }
    else {
      this.setState({
        error: labels[lang].errors.location_not_found
      });
    }
  }

  fromGenderPicker(value) {
    this.setState({gender: value});
  }

  returnToForm() {
    this.setState({selected: false});
  }

  setLang(lang) {
    this.setState({lang: lang});
  }

  render(props, state) {
    console.log('CURRENT_STATE', state);
    return h(
      'div', {id: 'app'},
      h(MapboxMap, { center: state.center, kalam: state.kalam }),
      h('div', {id: 'main', class: (state.lang === 'ar'?'':'override')},
        h('header',
          {id: 'lang-selector'},
          h('a', {
            class: 'lang-btn' + (state.lang === 'ar'? ' lang-btn-bold':''),
            onClick: this.setLang.bind(this, 'ar')
          }, 'AR'),
          ' | ',
          h('a', {
            class: 'lang-btn' + (state.lang === 'en'? ' lang-btn-bold':''),
            onClick: this.setLang.bind(this, 'en')
          }, 'EN')
         ),
        (state.selected
          ? h('div', {
            id: 'form'
          },
              (state.lang=== 'ar'
               ? h('div', {}, state.kalam)
               : h('div', {}, state.kalam)),
              h('div', {}, state.room),
              h('input', {
                type: 'submit',
                value: labels[state.lang].labels.google_directions,
                onClick: () => window.open(state.maps, '_blank')
              }),
              h('br'),
              h('input', {
                type: 'submit',
                value: 'back',
                onClick: this.returnToForm.bind(this)
              })
             )
        : h(Form, {
          class: (state.selected? 'hide-form':''),
          sect: state.sect,
          gender: state.gender,
          subdistrict: state.subdistrict,
          sejjel: state.sejjel,
          lang: state.lang,
          actions: {
            changeSejjel: (e) => this.setState({ sejjel: e.target.value }),
            changeSubdistrict: (e) => this.setState({ subdistrict: e.target.value }),
            changeSect: (e) => this.setState({ sect: e.target.value }),
            changeGender: this.fromGenderPicker.bind(this),
            submit: this.validateInput.bind(this)
          }
        })),
        h('div', {id: 'errors'}, state.error),
        h('hr'),
        h('footer', {},
          h('div', {}, labels[state.lang].about.problems),
          h('span', {}, labels[state.lang].about.blurb1)
        )
       )
    );
  }
}

render(h(App), document.body);
