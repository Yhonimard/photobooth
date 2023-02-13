/* eslint-disable camelcase */
import Vue from 'vue'
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from 'vee-validate'
import {
  max,
  min,
  max_value,
  min_value,
  required,
  size,
  email
} from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'

Vue.component('validation-observer', ValidationObserver)
Vue.component('validation-provider', ValidationProvider)

extend('required', required)
extend('max', max)
extend('min', min)
extend('max_value', max_value)
extend('min_value', min_value)
extend('size', size)
extend('email', email)
extend('total_size', {
  validate: (value, { size }) => value.length * 3 / 4 <= size * 1000 * 1000,
  params: [{ name: 'size' }]
})

localize({
  en: {
    ...en,
    messages: {
      ...en.messages,
      total_size: 'The {_field_} field size must be less than {size}MB'
    }
  }
})
