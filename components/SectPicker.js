import {h} from 'preact';
import labels from '../i18n.json';

const sectToArabic = {
  'Armenian Orthodox': 'ارمن ارثوذكس',
  'Armenian Catholic': 'ارمن كاثوليك',
  'Israelite': 'اسرائيلي',
  'Achouri': 'اشوري',
  'Achouri Orthodoxe': 'اشوري ارثوذكس',
  'Evangelical': 'انجيلي',
  'Druze': 'درزي',
  'Greek Orthodox': 'روم ارثوذكس',
  'Greek Catholic': 'روم كاثوليك',
  'Syriac Orthodox': 'سريان ارثوذكس',
  'Syriac Catholic': 'سريان كاثوليك',
  'Sunni': 'سني',
  'Shia': 'شيعي',
  'Alawite': 'علوي',
  'Caldan': 'كلدان',
  'Caldan Orthodoxe': 'كلدان ارثوذكس',
  'Caldan Catholic': 'كلدان كاثوليك',
  'Latin': 'لاتين',
  'Maronite': 'ماروني',
  'Other': 'مختلط'
}

const sectToEnglish = {};
for (let key in sectToArabic) {
  sectToEnglish[sectToArabic[key]] = key;
}

export function getSectName(arName) {
  return sectToEnglish[arName];
}

export function getSectKey(enName) {
  return sectToArabic[enName];
}

export function sectArToEn(name) {
  return sectToEnglish[name];
}

export function sectEnToAr(name) {
  return sectToArabic[name];
}

const SectPicker = ({lang, selected, onChange}) => {
  const mappedOptions = Object.keys(sectToArabic).map((option) => {
    const text = (lang === 'ar' ? sectToArabic[option] : option);
    return h('option', {value: sectToArabic[option], key: sectToArabic[option]}, text);
  });
  return h(
    'span', {id: 'sectpicker'},
    h('label', {}, labels[lang].labels.sect),
    h('br'),
    h('select', {
      onChange: onChange,
      value: selected
    },
      h('option', {disabled: true, selected: 'default'}, labels[lang].labels.sect_default),
      mappedOptions));
};

export default SectPicker;
