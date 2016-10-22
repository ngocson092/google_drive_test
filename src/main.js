import Vue from 'vue'
import _ from 'lodash';
import alertify from 'alertify.js';
import helper from './helper';
var initIdAddStart = 100;

Vue.component('item', {
  template: '#folder-template',
  props: {
    model: Object
  },
  data: function () {
    return {
      open:false
    }
  },
  computed: {

    hasChildren() {

      /*
      * check item has children
      * */

      return !!(this.model.children &&
          this.model.children.length)
    },
    isActive(){

        if(this.$root.currentFolderActive && this.$root.currentFolderActive.id){
            return this.$root.currentFolderActive.id == this.model.id;
        }
        return false;

    }
    
  },
  ready(){


  },
  methods: {
    toggle: function () {
      if (this.hasChildren) {
        this.open = !this.open
      }
      Vue.set(this.$root, 'currentFolderActive',this.model);
    },
    renameFolder: function () {
      var _this = this;
      alertify
      .defaultValue(_this.model.name)
      .prompt("Rename folder",
          function (val, ev) {
            ev.preventDefault();

            if(!val){
              alertify.error("name folder not empty");
              return;
            }else if(val==_this.model.name){
              //name not change
              return;
            }
            _this.model.name = val;  
            alertify.success("rename folder successfully");

          }, function(ev) {
            //cancel function goes here

            ev.preventDefault();
          });//end alertify
    },
    addFolder: function () {

      var _this = this;
      alertify
      .defaultValue("New folder")
      .prompt("Enter new folder name",
          function (val, ev) {
            ev.preventDefault();
            
            if(!val){
              alertify.error("name folder not empty");
              return;
            }
            
            _this.model.children.push({
              id: initIdAddStart,
              name: val,
              parent_id:_this.model.id,
              children: {}
            })
            initIdAddStart++;
            alertify.success("add folder successfully");

          }, function(ev) {
            ev.preventDefault();
          }
      );//end alertify



    }//end addFolder

  }//end methods


})

new Vue({
  el: 'body',
  data: {
    folders: [
      { id: 1, name: 'My Drive', parent_id: null },
      { id: 4, name: 'subfolder3', parent_id: 1  },
      { id: 2, name: 'subfolder1', parent_id: 1  },
      { id: 3, name: 'subfolder2', parent_id: 1  },
      { id: 6, name: 'subfolder5', parent_id: 5  },
      { id: 5, name: 'subfolder4', parent_id: 4  }
    ],
    currentFolderActive:null
  },
  ready:function(){
    this.convertData();
  },
  methods:{
     addFolder(){
         if(!this.currentFolderActive)
             return;


         var _this = this;
         this.currentFolderActive.open = true;
         alertify
             .defaultValue("New folder")
             .prompt("Enter new folder name",
                 function (val, ev) {
                     ev.preventDefault();

                     if(!val){
                         alertify.error("name folder not empty");
                         return;
                     }

                     _this.currentFolderActive.children.push({
                         id: initIdAddStart,
                         name: val,
                         parent_id:_this.currentFolderActive.id,
                         children:null
                     })
                     initIdAddStart++;
                     alertify.success("add folder successfully");

                 }, function(ev) {
                     ev.preventDefault();
                 }
             );//end alertify



      },   
     convertData(){
       var _this = this;

       _.forEach(_this.folders, function(value,i) {

         Vue.set(_this.folders[i], 'children', null);

         /*
         * reactive properties "children"
         *
         * */

       });
       Vue.set(this, 'folders', helper.convertHierarchical(this.folders))
     }
  }
});
