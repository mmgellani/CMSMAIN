import Vue from "vue";

Vue.component('input-ex', {
    props: ['value'],
    data() {
      return {
        innerValue: '',
      }
    },
    template: `<input v-model="innerValue"/>`,
    watch: {
      // Handles internal model changes.
      innerValue(newVal) {
        this.$nextTick(() => {
          this.$emit('input', newVal);      
        });
      },
      // Handles external model changes.
      value(newVal) {
        this.innerValue = String(newVal).toUpperCase();
      },
    },
    created() {
      if (this.value) {
        this.innerValue = String(this.value).toUpperCase();
      }
    },
  });