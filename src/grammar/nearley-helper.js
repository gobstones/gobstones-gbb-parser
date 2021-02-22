/* eslint-disable  */
module.exports = {
    id: function () {
        return function (tokenList) {
            return tokenList[0];
        };
    },
    null: function () {
        return function (tokenList) {
            return null;
        };
    },
    array: function (arr) {
        return function (tokenList) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                result.push(tokenList[arr[i]]);
            }
            return result;
        };
    },
    object: function (obj) {
        return function (tokenList) {
            var keys = Object.keys(obj);
            var result = {};
            for (var i = 0; i < keys.length; i++) {
                var value = obj[keys[i]];
                result[keys[i]] = tokenList[value];
            }
            return result;
        };
    },
    list: {
        head: function () {
            return function (tokenList) {
                return [tokenList[0]];
            };
        },
        tail: function () {
            return function (tokenList) {
                return [tokenList[0]].concat(tokenList[2]);
            };
        }
    }
};
