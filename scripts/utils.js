class utils {
    constructor() {
        this.asyncForMembers = async (array, callback) => {
            for (var index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        };
        this.asyncForindex = async (nrIterations, callback) => {
            for (var i = 0; i < nrIterations; i++) {
                await callback(i);
            }
        };
        this.getResetDay = function (day) {
            var resetWeekDay = day - 2;
            if (day < 2) {
                resetWeekDay = day + 5;
            }
            return resetWeekDay;
        };
        this.getResetDate = function (nowDate) {
            //var resetWeekDay = getResetDay(nowDate.getDay());	
            nowDate.setDate(nowDate.getDate() - getResetDay(nowDate.getDay()));
            console.log("getResetDate RESET DATE: " + nowDate.getDate());
            return nowDate;
        };
    }
}
const _utils = utils;
export { _utils as utils };