import {h} from 'preact';
import labels from '../i18n.json';

// Function to detect if a string contains Arabic numerals
const containsArabicNumerals = (input) => {
  const arabicNumerals = /[٠-٩]/u;
  return arabicNumerals.test(input);
};

// Function to convert Arabic numerals to standard numbers
export const convertSejjelToStandard = (input) => {
  if (!containsArabicNumerals(input)) return input;
  
  const arabicNumerals = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  return input.split('').map(char => arabicNumerals[char] || char).join('');
};

const SejjelInput = ({sejjel, onInput, lang}) => h(
  'div', {id: 'sejjelinput'},
  h('label', {}, labels[lang].labels.sejjel),
  h('br'),
  h('input', {
    onInput: onInput,
    type: 'text',
    placeholder: labels[lang].labels.sejjel_default,
    value: sejjel
  })
);

export default SejjelInput;
