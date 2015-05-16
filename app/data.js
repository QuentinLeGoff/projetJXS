var lastDateRecharge = {
					"jour" : 10,
					"mois" : 08,
					"annee" : 2014
				};

var maxDistanceBetweenTwoRecharge = 20;

var distances = [{
					"id" : "0001",
					"date" : { "jour" : 09, "mois" : 05, "annee" : 2015, "h": 9, "m" : 33},
					"depart" : { "lat" : 48.1203012, "long" : -1.6484009, "text" : "8 Rue des Plantes, 35700 Rennes"},
					"arrivee" : { "lat" : 48.1152589, "long" : -1.67694, "text" : "Place Hoche, 35000 Rennes"},
					"distance" : 2.4,
					"duree" : { "h" : 0, "m" : 11, "s" : 20},
					"vitesse_moy" : 19.2,
					"vitesse_max" : 24.3,
					
					"calories" : 360,
					"altitude_min" : 750,
					"altitude_max" : 980,
					"url": "https://maps.googleapis.com/maps/api/directions/json?origin=8+Rue+des+Plantes,+35700+Rennes&destination=Place+Hoche,+35000+Rennes&mode=bicycling"

				},
				{
					"id" : "0002",
					"date" : { "jour" : 07, "mois" : 05, "annee" : 2015, "h": 15, "m" : 12},
					"depart" : { "lat" : 48.126888, "long" : -1.6864393, "text" : "197 Rue Saint-Malo, 35000 Rennes"},
					"arrivee" : { "lat" : 48.1159299, "long" : -1.6244498, "text" : "10 Rue de la Rabine, 35510 Cesson-Sévigné"},
					"distance" : 6.2,
					"duree" : { "h" : 0, "m" : 25, "s" : 09},
					"vitesse_moy" : 21.3,
					"vitesse_max" : 25.9,
					
					"calories" : 590,
					"altitude_min" : 750,
					"altitude_max" : 980,
					"url": "https://maps.googleapis.com/maps/api/directions/json?origin=48.126888,-1.6864393&destination=48.1159299,-1.6244498&mode=bicycling"

				},
				{
					"id" : "0003",
					"date" : { "jour" : 26, "mois" : 04, "annee" : 2015, "h": 18, "m" : 30},
					"depart" : { "lat" : 48.0975767, "long" : -1.6752134, "text" : "104 Rue de l'Alma, 35000 Rennes"},
					"arrivee" : { "lat" : 48.116373, "long" : -1.6744443, "text" : "15 Rue de la Borderie, 35000 Rennes"},
					"distance" : 2.3,
					"duree" : { "h" : 0, "m" : 9, "s" : 53},
					"vitesse_moy" : 18.2,
					"vitesse_max" : 19.1,
					
					"calories" : 296,
					"altitude_min" : 750,
					"altitude_max" : 980,
					"url": "https://maps.googleapis.com/maps/api/directions/json?origin=48.116373,-1.6744443&destination=48.0975767,-1.6752134&mode=bicycling"

				},
				{
					"id" : "0004",
					"date" : { "jour" : 26, "mois" : 04, "annee" : 2015, "h": 12, "m" : 03},
					"depart" : { "lat" : 48.0865628, "long" : -1.682404, "text" : "20 Avenue du Canada, 35200 Rennes"},
					"arrivee" : { "lat" : 48.0975767, "long" : -1.6752134, "text" : "104 Rue de l'Alma, 35000 Rennes"},
					"distance" : 1.6,
					"duree" : { "h" : 0, "m" : 8, "s" : 13},
					"vitesse_moy" : 18.3,
					"vitesse_max" : 20.6,
					
					"calories" : 327,
					"altitude_min" : 750,
					"altitude_max" : 980,
					"url": "https://maps.googleapis.com/maps/api/directions/json?origin=48.0865628,-1.682404&destination=48.0975767,-1.6752134&mode=bicycling"
				},
				{
					"id" : "0005",
					"date" : { "jour" : 24, "mois" : 04, "annee" : 2015, "h": 10, "m" : 41},
					"depart" : { "lat" : 48.131037, "long" : -1.6522842, "text" : "29 Avenue des Gayeulles, 35700 Rennes"},
					"arrivee" : { "lat" : 48.0893648, "long" : -1.6182901, "text" : "7 Rue des Lilas, 35135 Chantepie"},
					"distance" : 7.0,
					"duree" : { "h" : 0, "m" : 34, "s" : 13},
					"vitesse_moy" : 23.1,
					"vitesse_max" : 29.6,
					
					"calories" : 764,
					"altitude_min" : 750,
					"altitude_max" : 980,
					"url": "https://maps.googleapis.com/maps/api/directions/json?origin=48.131037,-1.6522842&destination=48.0893647,-1.6182901&mode=bicycling"
				}];