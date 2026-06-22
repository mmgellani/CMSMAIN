import Vue from "vue";
import * as hlp from "../../root/application/helper";

Vue.component("select-ex", {
  props: {
    options: { type: Array },
    value: null,
    multiple: {
      type: Boolean,
      default: false
    },
    keyValue: {
      type: String,
      required: true
    },
    displayValue: {
      type: String,
      required: true
    },
    groupBy: {
      type: String,
      required: false
    }
  },
  template: `
    <select style="width:100%" :multiple="multiple">
      <slot></slot>
    </select>
  `,
  mounted: function () {
    let vm = this;
    let select = $(this.$el);

    if (this.options) {
      select
        .select2({
          data: this.groupBy
            ? this.groupBy.length > 2
              ? hlp.formulateGroup(
                this.options,
                this.groupBy,
                this.keyValue,
                this.displayValue
              )
              : hlp.formulateSingle(
                this.options,
                this.keyValue,
                this.displayValue
              )
            : hlp.formulateSingle(
              this.options,
              this.keyValue,
              this.displayValue
            )
        })
        .val(this.value)
        .trigger("change")
        // emit event on change.
        .on("change", function () {
          if (select.val() != null) {
            vm.$emit("input", select.val());
          }
        });

      select.val(this.value).trigger('change');
    }
  },
  // beforeUpdate() {
  //     $(this.$el).val(this.value).trigger('change');
  // },
  watch: {
    value: function (value) {

      // alert(typeof value)
      if (null != value) {
        if (typeof value === 'object') {

          // multiselect, need a deep compare

          if (JSON.stringify(value) !== JSON.stringify(value)) {
            $(this.$el)
              .val(value)
              .trigger('change')
          }
        } else {
          $(this.$el)
            .val(value)
            .trigger('change')
        }
      }

      // // update value
      // $(this.$el).val(value)
      //   .trigger('change');
    },
    // watch: {
    //   value: function (value) {
    //     // update value
    //     $(this.$el).val(value)
    //       .trigger('change');
    //   },
    options: function (options) {
      // update options
      if (this.options) {
        $(this.$el)
          .empty()
          .select2({
            data: this.groupBy
              ? this.groupBy.length > 2
                ? hlp.formulateGroup(
                  this.options,
                  this.groupBy,
                  this.keyValue,
                  this.displayValue
                )
                : hlp.formulateSingle(
                  this.options,
                  this.keyValue,
                  this.displayValue
                )
              : hlp.formulateSingle(
                this.options,
                this.keyValue,
                this.displayValue
              )
          })
          .val(this.value)
          .trigger("change");
      }
    }
  },
  destroyed: function () {
    if (
      $(this.$el)
        .off()
        .data("select2")
    ) {
      $(this.$el)
        .off()
        .select2("destroy");
    }
  }
});
