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
     * @returns {*}
     */
    get: function* (tableName, whereOpts){
        var result;
        try{
            var Quwey = ParseUtils.initQuery(tableName);
            if(whereOpts) {
                for(var key in whereOpts){
                    Quwey.equalTo(key, whereOpts[key]);
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
     * @returns {*}
     */
    update: function* (tableName, whereOpts, updateData){
        var result;
        try{
            var Quwey = ParseUtils.initQuery(tableName);
            if(whereOpts) {
                for(var key in whereOpts){
                    Quwey.equalTo(key, whereOpts[key]);
                }
            }
            var results = yield ParseUtils.get(Quwey);
            var i = 0, len = results.length, updateResult = false;
            for(;i<len;i++){
                for(var key in updateData){
                    results[i].set(key, updateData[key]);
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






