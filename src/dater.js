export default class Dater{

  constructor(lang = "es",timezone){
	/* Main class constructor */
	this.lang = lang;
	this.timezone = timezone;

	this.dateObject = new Date();

	this.mysqlFormat = /^(((\d{4})(-)(0[13578]|10|12)(-)(0[1-9]|[12][0-9]|3[01]))|((\d{4})(-)(0[469]|1‌​1)(-)([0][1-9]|[12][0-9]|30))|((\d{4})(-)(02)(-)(0[1-9]|1[0-9]|2[0-8]))|(([02468]‌​[048]00)(-)(02)(-)(29))|(([13579][26]00)(-)(02)(-)(29))|(([0-9][0-9][0][48])(-)(0‌​2)(-)(29))|(([0-9][0-9][2468][048])(-)(02)(-)(29))|(([0-9][0-9][13579][26])(-)(02‌​)(-)(29)))(\s([0-1][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9]))$/;

	/* Language switch */

	/* Language selection, the class default is Spanish */
	switch(this.lang){
	  case "es":
		this.months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
		this.week = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sábado"];
		this.adv = ["hoy","mañana", "ayer","pasado mañana", "anteayer", "esta semana","este mes","siguiente mes"];
		this.dayMoment = ["media noche","madrugada", "mañana", "medio día", "tarde", "noche"];
	  break;

	  case "en":
		this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		this.week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Frdiday","Saturday"];
		this.adv = ["today","tomorrow", "yesterday","past tomorrow", "the day before yesterday", "this week","in this month","next month"];
		this.dayMoment = ["midnight","early morning", "morning", "noon", "afternoon", "night"];
	  break;

	  case "pt":
		this.months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
		this.week = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
		this.adv = ["hoje","amanhã", "ontem","passado amanhã", "no dia anterior", "esta semana","neste mês","o próximo mês"];
		this.dayMoment = ["meia noite","de manhã cedo", "de manhã", "meio-dia", "tarde", "noite"];
	  break;

	  default:
		throw new Error("Language was not declared in class Daterjs");
	}
  }

  objectBuild(dObj){
	/* Daterjs object consturctor */
	if(dObj instanceof Date){
	  var date = {
		day: dObj.getDate(),
		month: this.months[dObj.getMonth()],
		monthValue: dObj.getMonth(),
		year: dObj.getFullYear(),
		hour: dObj.getHours(),
		hour12: dObj.getHours(),
		meridiem: "",
		minute: dObj.getMinutes(),
		second: dObj.getSeconds(),
		millisecond: dObj.getMilliseconds(),
		timezone: dObj.toTimeString().substring(9,17),
		dayName: this.week[dObj.getDay()],
		dayMoment: this.getDateMoment(dObj.getHours()+":00:00"),
	  }

	  if(dObj.getHours() == 0){
		date.hour12 = 12;
	  }else if(dObj.getHours() > 12){
		date.hour12 = dObj.getHours()-12;
	  }

	  if(dObj.getHours() < 12){
		date.meridiem = "AM";
	  }else if(dObj.getHours() >= 12){
		date.meridiem = "PM";
	  }

	  return date;
	}else{
	  throw new Error("Daterjs expects Date object to build the Dater object");
	}
	
  }

  mysqlToDate(date,dater=false){
	/* Parse Mysql date string format to a Javascript Date object */
	
	if(this.mysqlFormat.test(date)){
		var date = date.split(/[- :]/);

		date[1] = date[1]-1;

		if(date[1]== -1){
			date[1] = 11;
		}

		var dateCreated = new Date(date[0],date[1],date[2],date[3],date[4],date[5]);
		if(!dater){
			return dateCreated;
		}else{
			return this.objectBuild(dateCreated);
		}

	}else{
		throw new Error("Date string was not 'YYYY-MM-DD HH:mm:ss' format");
	}
  }

  getDate(date){
	/* Build a Dater object form a Javascript Date object */
	if(!date){
	  var nowObject = new Date();
	}else{
	  var nowObject = new Date(date);
	}
	return this.objectBuild(nowObject);
  }

  upperCaser(str){
	/* Upercases the first letter from the str */
	return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getDateAdv(date,capital=false){
	/* Adverb refference from today */
	if(typeof date == "string"){
		var dateCompare = this.mysqlToDate(date);
	}else if(typeof date == "number"){
		var dateCompare = new Date(date * 1000);
	}
	
	var justNow = new Date();

	var adv = "";

	if(dateCompare.getDate() == justNow.getDate() && dateCompare.getMonth() == justNow.getMonth()){
	  adv = this.adv[0];
	}else if(dateCompare.getDate() == (justNow.getDate() + 1)){
	  adv = this.adv[1];
	}else if(dateCompare.getDate() == (justNow.getDate() - 1)){
	  adv = this.adv[2];
	}else if(dateCompare.getDate() == (justNow.getDate() + 2)){
	  adv = this.adv[3];
	}else if(dateCompare.getDate() == (justNow.getDate() - 2)){
	  adv = this.adv[4];
	}else if(dateCompare.getDate() == (justNow.getDate() + 3)){
	  adv = this.adv[5];
	}else if((dateCompare.getDate() > (justNow.getDate() + 3)) && dateCompare.getMonth() == justNow.getMonth()){
	  adv = this.adv[6];
	}else if(dateCompare.getMonth() == (justNow.getMonth() + 1)){

	  adv = this.adv[7];
	}

	if(capital){
	  adv = this.upperCaser(adv);
	}

	return adv;
  }

  getDateMoment(time,capital=false){
	/* Day moment from the time */
	time = time.split(":");   
	var momentObject = new Date();

	momentObject.setHours(time[0]);

	var moment = "";

	if(momentObject.getHours() >= 1 && momentObject.getHours() <= 5){
	  moment = this.dayMoment[1];
	}else if(momentObject.getHours() > 5 && momentObject.getHours() < 12){
	  moment = this.dayMoment[2];
	}else if(momentObject.getHours()== 12){
	  moment = this.dayMoment[3];
	}else if(momentObject.getHours() >= 13 && momentObject.getHours() < 20){
	  moment = this.dayMoment[4];
	}else if(momentObject.getHours() >= 20 && momentObject.getHours() <= 23){
	  moment = this.dayMoment[5];
	}else if(momentObject.getHours() == 0){
	  moment = this.dayMoment[0];
	}

	if(capital){
	  moment = this.upperCaser(moment);
	}

	return moment;
  }
}