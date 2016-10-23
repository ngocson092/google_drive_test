<template>
    <div class="col-sm-3 item-folder"
         v-for="item in list_item">
        <span  v-text="item.name"
               @click="selectFolder(item,$event)"
               @dblclick="goToThisFolder(item,$event)"
        >
        </span>
    </div>

</template>
<style>
    ul[dnd-list], ul[dnd-list] > li {
        position: relative;
    }
</style>
<script>

    export default{
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

    }
</script>