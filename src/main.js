import Vue from 'vue'
import helper from './helper';
var x = 0;
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
      return x == this.model.id;
    }
    
  },
  ready(){
    Vue.set(this,'open',false);

  },
  methods: {
    toggle: function () {
      this.$parent.active = this.model.id;
      if (this.hasChildren) {
        this.open = !this.open
      }




    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {

      var x = this.model;

      x.children.push({
        name: 'new folder',
        parent_id:this.model.id
      })

      Vue.set(this,'model',x)

      this.$parent.folders.push({ id: '2', name: 'subfolder1', parent_id: this.model.id});

    }
  }
})

new Vue({
  el: 'body',
  data: {
    folders: [
      { id: 1, name: 'My Drive', parent_id: null },
      { id: 2, name: 'subfolder1', parent_id: 1 },
      { id: 3, name: 'subfolder2', parent_id: 1 },
      { id: 4, name: 'subfolder3', parent_id: 1 },
      { id: 5, name: 'subfolder2', parent_id: 4},
      { id: 6, name: 'subfolder3', parent_id: 5 }
    ],
    active:''
  },
  ready:function(){
    Vue.set(this, 'folders', helper.convertHierarchical(this.folders))
  },
  methods:{

  }
});
