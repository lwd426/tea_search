
export function setMainPageOptions(testGroups, arr, type) {
    testGroups.forEach(function(project,index){
        let inObj ={};

        let strageties = [] //各个策略的tag 数组
        if(project.strageties.length > 0){
            project.strageties.forEach(function(stragety,index){
                if(stragety.tag){
                    strageties.push(stragety.tag)
                }
            })
        }

        if(type == 'running'){
            if(project.status == 'running'){
                inObj['value'] = project.objectId;
                inObj['label'] = project.name;
                inObj['strageties'] = strageties;
                arr.push(inObj)
            }
        }
        if(type == 'new'){
            if(project.status == 'new'){
                inObj['value'] = project.objectId;
                inObj['label'] = project.name + '（new）';
                inObj['disabled'] = true;
                arr.push(inObj)
            }
        }
        if(type == 'stopped'){
            if(project.status == 'stopped'){
                inObj['value'] = project.objectId;
                inObj['label'] = project.name + '(stopped)';
                inObj['strageties'] = strageties;
                /*if(strageties.length == 0){
                    inObj['disabled'] = true;
                }*/
                arr.push(inObj)
            }
        }
    })
    return arr
}

/*


if(slblist.length > 0 ){
    slblist.forEach(function(slb,index){
        let obj = {}
        obj['value'] = slb.objectId;
        obj['label'] = slb.name;

        if(slb.testGroups.length > 0){
            let arr = [];
            arr = setMainPageOptions(slb.testGroups, arr, 'running');
            arr = setMainPageOptions(slb.testGroups, arr, 'new');
            arr = setMainPageOptions(slb.testGroups, arr, 'stopped');
            slb.testGroups.forEach(function(project,index){
                let inObj ={};

                let strageties = [] //各个策略的tag 数组
                if(project.strageties.length > 0){
                    project.strageties.forEach(function(stragety,index){
                        if(stragety.tag){
                            strageties.push(stragety.tag)
                        }
                    })
                }

                if(project.status == 'running'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name;
                    inObj['strageties'] = strageties;

                }else if(project.status == 'new'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '（new）';
                    inObj['disabled'] = true;
                }else if(project.status == 'stopped'){
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '(stopped)';
                    inObj['strageties'] = strageties;
                }
                arr.push(inObj)
            })
            obj['children'] = arr;
            options.push(obj);
        }
        if(slb.testGroups.length > 0){
            let arr = [];
            slb.testGroups.forEach(function(project,index){
                let inObj ={};
                if(project.strageties.length > 0){
                    let strageties = [] //各个策略的tag 数组
                    project.strageties.forEach(function(stragety,index){
                        if(stragety.tag){
                            strageties.push(stragety.tag)
                        }
                    })
                    if(strageties.length > 0){
                        inObj['value'] = project.objectId;
                        inObj['label'] = project.name;
                        inObj['strageties'] = strageties;
                    }else{
                        inObj['value'] = project.objectId;
                        inObj['label'] = project.name + '（所有策略未发布）';
                        inObj['disabled'] = true;
                    }
                    
                    arr.push(inObj)
                }else{
                    inObj['value'] = project.objectId;
                    inObj['label'] = project.name + '（项目下无策略）'
                    inObj['disabled'] = true;
                    arr.push(inObj)
                }
                
            })
            obj['children'] = arr;
            options[option_idx] = obj;
            option_idx ++;
        }else{
            obj['label'] = slb.name + '（此测试组下无项目）'
            obj['disabled'] = true;
        }
    })
}

*/