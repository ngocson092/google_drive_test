import Vue from 'vue'
import _ from 'lodash';
import alertify from 'alertify.js';
import helper from './helper';
var initIdAddStart = 30;

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
      this.$root.selected = [];
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
    }
  }//end methods
});

Vue.component('inner-item', {
  template: '#inner-item-template',
  props: {
      list_item: {}
  },
  data: function () {
    return {
      selected:[]
    }
  },
  computed: {


    
  },
  ready(){


  },
  methods: {

    selectFolder(item,e){

        if(_.some(this.$root.selected,{'id':item.id})){
            //toggle push item to selected
            this.$root.selected.$remove(item);
        }else{
            this.$root.selected.push(item);
        }
        $(e.target).closest('.item-folder').toggleClass('selected');


    },
    goToThisFolder(item,e){
          this.$root.currentFolderActive = item;
        this.$root.currentFolderActive.open = true;
    }
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
    currentFolderActive:null,
    selected:null
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
