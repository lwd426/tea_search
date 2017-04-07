var ParseUtils = require('./parse/sdk');

module.exports = {
    /**
     * 保存数据（如果表不存在，就自动新建）
     * @param tableName 表名称
     * @param data 数据
     * @returns {*}
     */
    save: function *(tableName, data){
        var result;
        try{
            var Quwey = ParseUtils.initObject(tableName);
            result = yield ParseUtils.save(Quwey, data);
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
            if(otherOpts){
                switch(otherOpts.opt){
                    case "in": Quwey.containedIn(otherOpts.key, otherOpts.data);
                }
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
     * @param otherOpts where里的其他条件，比如in, 大于小于等（对象形式）
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
            if(otherOpts){
                switch(otherOpts.opt){
                    case "in": Quwey.containedIn(otherOpts.key, otherOpts.data);
                }
            }
            var results = yield ParseUtils.get(Quwey);
            var i = 0, len = results.length, updateResult = false;
            for(;i<len;i++){
                for(var key in updateData){
                    switch(updateData.opt){
                        case "in": Quwey.containedIn(otherOpts.key, otherOpts.data);
                    }
                    if(type === 'add' && results[i].get(key)){
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






