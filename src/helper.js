module.exports = {
    convertHierarchical:function(array){
        var map = {};
        for(var i = 0; i < array.length; i++){

            var obj = array[i];
            obj.children= [];

            map[obj.id] = obj;

            var parent = obj.parent_id || '-';
            if(!map[parent]){
                map[parent] = {
                    children: []
                };
            }
            map[parent].old = 123;
            map[parent].children.push(obj);
        }

        return map['-'].children;

    }
}
