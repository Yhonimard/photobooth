import Vue from 'vue';
import vSelect from 'vue-select';
import CustomSelect from '@/components/CustomSelect';

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('fa-icon', {
      attrs: {
        icon: 'times'
      }
    })
  },
  OpenIndicator: {
    render: createElement => createElement('fa-icon', {
      attrs: {
        icon: 'caret-down'
      }
    })
  }
})

// Register the component
Vue.component('v-select', vSelect)
Vue.component('custom-select', CustomSelect)
