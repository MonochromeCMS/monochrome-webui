import { extend, localize, setInteractionMode } from 'vee-validate';
import { digits, numeric, regex, required } from 'vee-validate/dist/rules';

setInteractionMode('eager');

extend('required', required);

extend('digits', digits);

extend('numeric', numeric);

extend('regex', regex);

localize({
  en: {
    messages: {
      digits: '{_field_} requires {length} digits',
      numeric: '{_field_} must be a number',
      regex: '{_field_} is not valid',
      required: '{_field_} can not be empty',
    },
  },
  fr: {
    messages: {
      digits: '{_field_} a besoin de {length} chiffres',
      numeric: '{_field_} doit être un numéro',
      regex: "{_field_} n'est pas valide",
      required: '{_field_} ne peut pas être vide',
    },
  },
});
