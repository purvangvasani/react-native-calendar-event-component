export function getDateArray(start, end){
    var arr = [];
    var from = new Date(start);
    var to = new Date(end);
    if(start == end){
        arr.push(new Date(from));
    }
    else if(start != end) {
        while (from <= to) {
            arr.push(new Date(from));
            from.setDate(from.getDate() + 1);
        }
    }
    return arr;
}