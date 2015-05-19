function getAverageSpeed (){
  var speed = 0;
  for(i in distances){
    speed += distances[i].vitesse_moy;
  }

  speed = speed / distances.length;
  return speed.toFixed(1);
}

function getMaxSpeed(){
  var speed = distances[0].vitesse_max;
  for(var i=1; i<distances.length;i++){
    if(distances[i].vitesse_max > speed) speed = distances[i].vitesse_max;
  }
  return speed;
}

function getDistanceSinceLastRecharge(dateLastRecharge){
  var distance = 0;

  // Last Date recharge (request bdd)
  var lastDate = new Date(dateLastRecharge.annee,dateLastRecharge.mois,dateLastRecharge.jour);


  for(var i=0; i<distances.length;i++){
    var currentDate = new Date(distances[i].date.annee,distances[i].date.mois,distances[i].date.jour);
    if(currentDate > lastDate) distance += distances[i].distance;
  }
  return distance;
}

// Period must be : year, month, week or hour....
function getDistance(period){
  var distance = 0;
  var currentDate = moment().locale("fr");

  for(var i=0; i<distances.length;i++){
    var date = new Date(distances[i].date.annee,distances[i].date.mois-1,distances[i].date.jour);
    if(moment(currentDate).isSame(date,period)){
      distance += distances[i].distance;
    } 
  }
  return distance;
}

function getTotaleDistance(){
  var distance = 0;
  for(var i=0; i<distances.length;i++){
    distance += distances[i].distance;
  }
  return distance;
}
