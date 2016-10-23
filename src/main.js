import Vue from 'vue'
import _ from 'lodash';
window.$ = require('jquery');
import alertify from 'alertify.js';
import helper from './helper';


var initIdAddStart = 30;
//when user add new folder , id folder will start initIdAddStart


Vue.component('item', require('./components/item.vue'));
Vue.component('inner', require('./components/inner.vue'));

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
      
    currentFolderActive:null, // currentFolderActive is Highlight folder
    selected:null // when user click on right content to select folder, selected will store them
  },
  ready:function(){
    this.convertData();

  },
  methods:{
      addFolder(){
         if(!this.currentFolderActive)
             return;

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

                     /*
                     * add folder
                     *
                     * */

                     if(!_this.currentFolderActive.children){
                         Vue.set(_this.$root.currentFolderActive, 'children',[]);
                     }
                     _this.currentFolderActive.children.push({
                         id: initIdAddStart,
                         name: val,
                         parent_id:_this.currentFolderActive.id
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
         *
         * reactive properties "children"
         *
         * */

       });
       Vue.set(this, 'folders', helper.convertHierarchical(this.folders))
     },
      removeFolder(){
          var _this = this;
          _.forEach(this.selected,function(v){
              _this.currentFolderActive.children.$remove(v);
          });

          //set selected is empty after remove them
          this.selected = [];
      },
      renameFolder(){

          var _this = this;
          var selectFolder = this.selected.pop();
          alertify
              .defaultValue(selectFolder.name)
              .prompt("Rename folder",
                  function (val, ev) {
                      ev.preventDefault();

                      if(!val){
                          alertify.error("name folder not empty");
                          return;
                      }else if(val==_this.currentFolderActive.name){
                          //name not change
                          return;
                      }

                        /*
                        * do rename
                        * */

                      var index = _this.currentFolderActive.children.indexOf(selectFolder);
                      //get index of object in children

                      _this.currentFolderActive.children[index] = _.merge(selectFolder, {name: val});


                     $('.selected').removeClass('selected');

                  }, function(ev) {
                      //cancel function goes here

                      ev.preventDefault();
                  });//end alertify

      }
  }

});

