let utils ={};

    /**
     * 随机生成不重复字符串
     * @returns {string}
     */
    utils.guid = function() {
        let str = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
        let arr = str.split('');
        arr = arr.map(item =>{
            if(item === 'x'){
                let r = Math.random()*16|0;
                let v = item == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }
        })
        return arr.join('');
    };


export default utils;
