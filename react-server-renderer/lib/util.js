"use strict";
exports.__esModule = true;
exports.isJS = function (file) { return /\.js(\?[^.]+)?$/.test(file); };
exports.isCSS = function (file) { return /\.css(\?[^.]+)?$/.test(file); };
function createPromiseCallback() {
    var resolve;
    var reject;
    // tslint:disable-next-line variable-name
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    var cb = function (err, res) {
        if (err) {
            return reject(err);
        }
        resolve(res || '');
    };
    return { promise: promise, cb: cb };
}
exports.createPromiseCallback = createPromiseCallback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJzcmMvIiwic291cmNlcyI6WyJ1dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQWEsUUFBQSxJQUFJLEdBQUcsVUFBQyxJQUFZLElBQWMsT0FBQSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTVCLENBQTRCLENBQUE7QUFFOUQsUUFBQSxLQUFLLEdBQUcsVUFBQyxJQUFZLElBQWMsT0FBQSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQTdCLENBQTZCLENBQUE7QUFFN0UsU0FBZ0IscUJBQXFCO0lBQ25DLElBQUksT0FBTyxDQUFBO0lBQ1gsSUFBSSxNQUFNLENBQUE7SUFDVix5Q0FBeUM7SUFDekMsSUFBTSxPQUFPLEdBQW9CLElBQUksT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFFLE9BQU87UUFDN0QsT0FBTyxHQUFHLFFBQVEsQ0FBQTtRQUNsQixNQUFNLEdBQUcsT0FBTyxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBTSxFQUFFLEdBQUcsVUFBQyxHQUFVLEVBQUUsR0FBWTtRQUNsQyxJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ25CO1FBQ0QsT0FBTyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNwQixDQUFDLENBQUE7SUFDRCxPQUFPLEVBQUUsT0FBTyxTQUFBLEVBQUUsRUFBRSxJQUFBLEVBQUUsQ0FBQTtBQUN4QixDQUFDO0FBZkQsc0RBZUMifQ==