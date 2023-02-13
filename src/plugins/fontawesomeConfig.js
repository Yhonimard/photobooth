import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBars,
  faChartPie,
  faPen,
  faFileAlt,
  faSearch,
  faTimes,
  faTrashAlt,
  faShoppingCart,
  faFolder,
  faEye,
  faUserCircle,
  faSignOutAlt,
  faHome,
  faTruck,
  faShapes,
  faUserFriends,
  faLink,
  faCaretDown,
  faCaretRight,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBars,
  faChartPie,
  faPen,
  faFileAlt,
  faSearch,
  faTimes,
  faTrashAlt,
  faShoppingCart,
  faFolder,
  faEye,
  faUserCircle,
  faSignOutAlt,
  faHome,
  faTruck,
  faShapes,
  faUserFriends,
  faLink,
  faCaretDown,
  faCaretRight,
  faTrash
)

Vue.component('fa-icon', FontAwesomeIcon)
