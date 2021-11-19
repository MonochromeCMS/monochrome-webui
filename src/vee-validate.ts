import { extend, localize, setInteractionMode } from 'vee-validate';
import { digits, max, numeric, regex, required } from 'vee-validate/dist/rules';

setInteractionMode('eager');

extend('required', required);

extend('digits', digits);

extend('max', max);

extend('numeric', numeric);

extend('regex', regex);

localize({
  en: {
    messages: {
      digits: '{_field_} requires {length} digits',
      max: "{_field_} can't be that long",
      numeric: '{_field_} must be a number',
      regex: '{_field_} is not valid',
      required: '{_field_} can not be empty',
    },
  },
  fr: {
    messages: {
      digits: '{_field_} a besoin de {length} chiffres',
      max: '{_field_} ne peut pas être aussi long',
      numeric: '{_field_} doit être un numéro',
      regex: "{_field_} n'est pas valide",
      required: '{_field_} ne peut pas être vide',
    },
  },
});
