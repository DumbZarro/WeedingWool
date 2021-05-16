module.exports = {
  get:get,
  getDate:getDate
}

function get(TimeString,option){
  let Y_M_D = TimeString.split(" ")[0]
  let time = TimeString.split(" ")[0]
  switch(option){
    case "Y": return Y_M_D.split("-")[0];
    case "M": return Y_M_D.split("-")[1];
    case "D": return Y_M_D.split("-")[2];
    case "T": return time;
    case "date": return Y_M_D;
    default: return null;
  }
}

function getDate(TimeString){
  let string = get(TimeString,"date")
  let year = get(string,"Y")
  let month = get(string,"M")
  let day = get(string,"D")
  return year+"年"+month+"月"+day+"日"
}