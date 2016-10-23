<template>
    <li>
        <div
                :class="{bold: hasChildren,active: isActive}"
                @click="toggle"
        >
            <span @dblclick="renameFolder" v-text="model.name"></span>
            <i v-if="hasChildren" class="fa fa-caret-down" aria-hidden="true"></i>

        </div>
        <ul  v-if="hasChildren">
            <item
                    class="item"
                    v-for="model in model.children"
                    :model="model">
                >
            </item>

        </ul>
    </li>

</template>

<script>

    import Vue from 'vue';

    export default{
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
                return !!(this.model.children && this.model.children.length);

            },
            isActive(){

                if(this.$root.currentFolderActive && this.$root.currentFolderActive.id){
                    return this.$root.currentFolderActive.id == this.model.id;
                }
                return false;

            },
            isRoot(){
                if(this.model.id == 1){
                    //default : root folder id will be 1
                    return true;
                }
                return false;
            }

        },
        ready(){
            if(this.isRoot){
                // set currentFolderActive is root when app start
                Vue.set(this.$root, 'currentFolderActive',this.model);
            }
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
    }
</script>