exports.install = function (Vue, options) {
    Vue.prototype.noEmpty = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('不能为空！'));
        }
    };



};
