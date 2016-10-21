import Vue from 'vue'
import alertify from 'alertify.js';
import helper from './helper';
Vue.component('item', {
  template: '#folder-template',
  props: {
    model: Object
  },
  data: function () {
    return {

    }
  },
  computed: {

    hasChildren:function () {
      return !!(this.model.children &&
          this.model.children.length)
    },
    isActive:function(){
      return this.model.id == this.model.id;
    }
    
  },
  ready(){
    Vue.set(this,'open',false);

  },
  methods: {
    toggle: function () {
      this.$parent.active = this.open;
      if (this.hasChildren) {
        this.open = !this.open
      }

    },
    changeType: function () {
      var _this = this;
      alertify
      .defaultValue("")
      .prompt("Rename folder",
          function (val, ev) {
            ev.preventDefault();
            if(val)
              _this.model.name = val;
            alertify.success("rename folder successfully");

          }, function(ev) {
            ev.preventDefault();
          });
    },
    addChild: function () {

      var _this = this;
      alertify
      .defaultValue("New folder")
      .prompt("Enter new folder name",
          function (val, ev) {
            ev.preventDefault();

            _this.model.children.push({
              name: val,
              parent_id:_this.model.id
            })

            alertify.success("add folder successfully");

          }, function(ev) {
            ev.preventDefault();
      });



    }
  }
})

new Vue({
  el: 'body',
  data: {
    folders: [
      { id: 1, name: 'My Drive', parent_id: null ,children:null},
      { id: 2, name: 'subfolder1', parent_id: 1  ,children:null},
      { id: 3, name: 'subfolder2', parent_id: 1  ,children:null},
      { id: 4, name: 'subfolder3', parent_id: 1  ,children:null},
      { id: 5, name: 'subfolder2', parent_id: 4  ,children:null},
      { id: 6, name: 'subfolder3', parent_id: 5  ,children:null}
    ],
    active:null
  },
  ready:function(){
    Vue.set(this, 'folders', helper.convertHierarchical(this.folders))
  },
  methods:{

  }
});
