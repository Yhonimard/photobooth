<template>
  <v-select
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template
      v-for="(_, slotName) of $scopedSlots"
      :slot="slotName"
      slot-scope="scope"
    >
      <slot
        :name="slotName"
        v-bind="scope"
      />
    </template>
  </v-select>
</template>
<script>

export default {
  name: 'CustomSelect'
}
</script>

<style lang="scss">
.vs--open {
  .vs__dropdown-toggle {
    border-color: #e7e8fd !important;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(115, 122, 241, 0.25);
  }
}

.v-select {
  &.is-invalid {
    .vs__actions,
    .vs__dropdown-menu,
    .vs__selected-options {
      border-color: #dc3545 !important;
    }

    &.vs--open {
      .vs__dropdown-toggle {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
      }
    }
  }

  &.vs--disabled {
    .vs__dropdown-toggle,
    .vs__clear,
    .vs__search,
    .vs__selected,
    .vs__open-indicator {
      cursor: default;
      background-color: #e9ecef;
    }
  }

  .vs__dropdown-toggle {
    padding: 0;
    border: none;
    vertical-align: middle;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    .vs__selected-options {
      min-height: calc(1.5em + 0.75rem + 2px);
      padding: 0.375rem 0 0 0.75rem;
      border: 1px solid #ced4da;
      border-right: none;
      border-radius: 0.25rem 0 0 0.25rem;
      margin: 0;

      .vs__search {
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0 0.75rem 0.375rem 0;
        margin: -4px 0 0;
        background: transparent;
        width: 100%;
      }
    }

    &[aria-expanded="false"]{
      .vs__selected-options {
        z-index: 1;
        .vs__search {
          position: absolute !important;
          z-index: -1;
        }
      }
    }

    .vs__actions {
      margin: 0;
      border: 1px solid #ced4da;
      border-left: none;
      border-radius: 0 0.25rem 0.25rem 0;
      padding-right: 1rem;
      padding-bottom: 0.25rem;
      z-index: 1;

      svg {
        fill: rgba(0, 0, 0, 0.4);
      }
    }
  }

  .vs__dropdown-menu {
    top: calc(100% - 2px);
    border-radius: 0 0 0.25rem 0.25rem;
    border-color: #ced4da;
    padding-top: 8px;
    padding-bottom: 0;

    .vs__dropdown-option {
      margin: 0;
      font-size: 1rem;
      line-height: 1rem;
      padding: 8px 16px;

      &--selected {
        background: #EDEEFD !important;
        color: rgba(0, 0, 0, 0.67) !important;
      }

      &--highlight {
        background: #A2A6F6;
        color: #FFF;
      }
    }
  }

  &.vs--single {
    .vs__selected {
      padding: 0;
      margin: 0 0.75rem 0.375rem 0;
    }
  }

  &.vs--multiple {
    .vs__selected {
      color: #6979F8;
      background-color: #EDEEFD;
      padding: 2px 8px;
      border: none;
      margin: 0 0.75rem 0.375rem 0;

      .vs__deselect {
        margin-left: 6px;
      }
    }
  }
}
</style>
