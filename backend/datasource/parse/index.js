var ParseUtils = require('./sdk');

module.exports = {
    /**
     * 保存数据（如果表不存在，就自动新建）
     * @param tableName 表名称
     * @param data 数据
     * @returns {*} 保存的数据或false
     */
    save: function *(tableName, data){
        var result;
        try{
            var Quwey = ParseUtils.initObject(tableName);
            result = yield ParseUtils.save(Quwey, data);
            result = result.data;
        }catch(e){
            result = false;
        }

        return result;
    },
    /**
     * 获取数据
     * @param tableName  表名称
     * @param whereOpts 条件
     * @param otherOpts 除了等于条件的其他条件 格式：{key: 'stra_id', opt: 'in', data:xxx}
     * @returns {*}
     */
    get: function* (tableName, equalToOpts, otherOpts){
        var result;
        try{
            var Quwey = ParseUtils.initQuery(tableName);
            if(equalToOpts) {
                for(var key in equalToOpts){
                    equalToOpts[key] ? Quwey.equalTo(key, equalToOpts[key]) : '';
                }
            }
            if(otherOpts && Array.isArray(otherOpts)){
                otherOpts.map((opt)=>{
                    switch(opt.opt){
                        case "in": Quwey.containedIn(opt.key, opt.data);break;
                        case "limit": Quwey.limit(opt.data);break;
                        case "noEqual": Quwey.notEqualTo(opt.key, opt.data);break;
                        case "equal": Quwey.equalTo(opt.key, opt.data);break;
                        case "desc": Quwey.descending(opt.key);break;
                        case "asc": Quwey.ascending(opt.key);break;
                        case "noExsit": Quwey.doesNotExist(opt.key);break;
                    }
                })
            }
            result = yield ParseUtils.get(Quwey)
        }catch(e){
            result = [];
        }
        return result;
    },
    /**
     * 删除接口
     * @param tableName 表名称
     * @param whereOpts 条件
     * @returns {*}
     */
    delete: function* (tableName, whereOpts){
        var result;
        try{
            var Quwey = ParseUtils.initQuery(tableName);
            if(whereOpts) {
                for(var key in whereOpts){
                    Quwey.equalTo(key, whereOpts[key]);
                }
            }
            var results =  yield ParseUtils.get(Quwey);
            var i = 0, len = results.length, deleteResult = false;
            for(;i<len;i++){
                deleteResult = yield ParseUtils.delete(results[i]);
                deleteResult = deleteResult.status;
            }
            result = deleteResult;
        }catch(e){
            result = false;
        }
        return result;
    },
    /**
     * 更新接口
     * @param tableName 表名称
     * @param whereOpts 条件（对象形式）
     * @param updateData 更新数据（对象形式）
     * @param otherOpts where里的其他条件，比如in, 大于小于等（数组形式）
     * @returns {*}
     */
    update: function* (tableName, whereOpts, updateData, otherOpts, type){
        var result;
        try{
            var Quwey = ParseUtils.initQuery(tableName);
            if(whereOpts) {
                for(var key in whereOpts){
                    Quwey.equalTo(key, whereOpts[key]);
                }
            }
            if(otherOpts && Array.isArray(otherOpts)){
                otherOpts.map((opt)=>{
                    switch(opt.opt){
                        case "in": Quwey.containedIn(opt.key, opt.data);break;
                        case "limit": Quwey.limit(opt.data);break;
                        case "noEqual": Quwey.notEqualTo(opt.key, opt.data);break;
                    }
                })
            }
            var results = yield ParseUtils.get(Quwey);
            var i = 0, len = results.length, updateResult = false;
            for(;i<len;i++){
                for(var key in updateData){
                    switch(updateData.opt){
                        case "in": Quwey.containedIn(otherOpts.key, otherOpts.data);
                    }
                    if(type === 'add' && results[i].get(key) && results[i].get(key).indexOf(updateData[key]) === -1){
                        results[i].set(key,results[i].get(key)+';' + updateData[key]);
                    }else{
                        results[i].set(key, updateData[key]);
                    }
                }
                updateResult = yield ParseUtils.save(results[i]);
                updateResult = updateResult.status;
            }
            result = updateResult
        }catch(e){
            result = false;
        }
        return result;
    }
}






