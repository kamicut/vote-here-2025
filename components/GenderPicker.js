import {h} from 'preact';
import labels from '../i18n.json';

const GenderPicker = (props) => {
  const lang = props.lang;
  return h(
    'div', {id: 'genderpicker'},
    h('label', {}, labels[lang].labels.gender),
    h('br'),
    h('input', {
      type: 'radio',
      value: 'أنثى',
      checked: (props.gender === 'أنثى'),
      onClick: () => props.onClick('أنثى')
    }),
    labels[lang].labels.female,
    h('br'),
    h('input', {
      type: 'radio',
      value: 'ذكر',
      checked: (props.gender === 'ذكر'),
      onClick: () => props.onClick('ذكر')
    }),
    labels[lang].labels.male,
    h('br')
  );
};

export default GenderPicker;
