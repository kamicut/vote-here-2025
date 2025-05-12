import {h} from 'preact';
import labels from '../i18n.json';

const districtToArabic = {
  'Achrafieh': 'اشرفية',
  'Bachoura': 'الباشورة',
  'Rmeil': 'الرميل',
  'Saifi': 'الصيفي',
  'Mazraaa': 'المزرعة',
  'Mina el Hosn': 'ميناء الحصن',
  'Mdawar': 'المدور',
  'Zqaq el Blat': 'زقاق البلاط',
  'Raas Beirut': 'رأس بيروت',
  'Msaitbe': 'المصيطبة',
  'Mreisse': 'دار المريسة',
  'Marfa': 'المرفأ'
};

const districtToEnglish = {};
for (let key in districtToArabic) {
  districtToEnglish[districtToArabic[key]] = key;
}

export function getDistrictName(arName) {
  return districtToEnglish[arName];
}

export function getDistrictKey(enName) {
  return districtToArabic[enName];
}

export function districtArToEn(name) {
  return districtToEnglish[name];
}

export function districtEnToAr(name) {
  return districtToArabic[name];
}

const DistrictPicker = ({lang, selected, onChange}) => {
  const mappedOptions = Object.keys(districtToArabic).map((option) => {
    const text = (lang === 'ar' ? districtToArabic[option] : option);
    return h('option', {value: districtToArabic[option], key: districtToArabic[option]}, text);
  });
  return h(
    'span', {id: 'districtpicker'},
    h('label', {}, labels[lang].labels.district),
    h('br'),
    h('select', {
      onChange: onChange,
      value: selected
    },
      h('option', {disabled: true, selected: 'default'}, labels[lang].labels.district_default),
      mappedOptions));
};

export default DistrictPicker;
