var tableBody = document.getElementById("repo-table");
var wButton = document.getElementById("fetch-button");
var weaEl = document.getElementById("wea");
const theKey = "d3cead6b24ef04751594f3f9dfdaba4a";
const theUrl = "api.openweathermap.org/data/2.5/weather?id=";
var date = moment().format("MMMM Do, YYYY, H a");
var tomorro = moment().add(1, "days").format("MMMM Do");

var obj = {};
document.getElementById("Tdate").innerHTML = date;

var todoFiveCities = document.querySelector("#fivedays");
var cityInput = document.querySelector("#city-text");
var todoForm = document.querySelector("#todo-form");
var todoCity = document.querySelector("#cities");
//var todoCountSpan = document.querySelector("#todo-count");
var CountSpan;
var citiesArray = [];

function citiesfromLOCA() {
  // Clear todoCity element and update todoCountSpan
  todoCity.innerHTML = "";

  for (var i = 0; i < citiesArray.length; i++) {
    var citytoBtn = citiesArray[i];

    var li = document.createElement("li");
    li.setAttribute("class", "");

    var buttonC = document.createElement("button");
    buttonC.setAttribute("class", "btn-primary btn-lg btn-block");

    buttonC.textContent = citytoBtn;

    li.appendChild(buttonC);
    todoCity.appendChild(li);
  }
}

function init() {
  // Cities from localStorage
  var citiesStored = JSON.parse(localStorage.getItem("citiesArray"));

  if (citiesStored !== null) {
    citiesArray = citiesStored;
  }
  citiesfromLOCA();
}

function storeCitiesLOCA() {
  localStorage.setItem("citiesArray", JSON.stringify(citiesArray));
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityText = cityInput.value.trim();

  if (cityText === "") {
    return;
  }

  citiesArray.push(cityText);
  cityInput.value = "";
  if (citiesArray.length > 5) {
    citiesArray.splice(0, 1);
  }

  // Store updated cities in localStorage, re-render the list
  storeCitiesLOCA();
  citiesfromLOCA();
  getApi(cityText);
});

init();

//----------------------------end buttonslocal

function getApi(acity) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    acity +
    "&appid=d3cead6b24ef04751594f3f9dfdaba4a&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let latit = data.coord.lat; //take latitud from the respone
      let longi = data.coord.lon;
      let iconURL = data.weather[0].icon + "@2x.png";
      console.log(latit);
      console.log(longi);
      console.log(data);
      console.log(data.name);
      let requestUrlFive =
        "https://api.openweathermap.org/data/2.5/onecall?&lat=" +
        latit +
        "&lon=" +
        longi +
        "&units=imperial&exclude=alerts&appid=d3cead6b24ef04751594f3f9dfdaba4a";

      fetch(requestUrlFive)
        .then(function (response) {
          return response.json();
        })
        .then(function (elwe) {
          console.log(elwe.daily);

          //  CREATE DAY BY DAY ------------------------------------------------------------
          function createFiveDays() {
            $("#fivedays").hide();
            var link1 = document.createElement("li");
            link1.textContent = elwe.name;
            todoFiveCities.innerHTML = "";

            for (var i = 0; i < 5; i++) {
              //var citytoBtn = citiesArray[i];

              let ul = document.createElement("ul");
              let buttonCit = document.createElement("li");
              let uli = document.createElement("li");
              let pTempe = document.createElement("li");
              let pWind = document.createElement("li");
              let pUVI = document.createElement("li");

              ul.setAttribute("class", "list-group-item");
              uli.setAttribute("class", "list-group-item");
              pTempe.setAttribute("class", "list-group-item");
              pWind.setAttribute("class", "list-group-item");
              pUVI.setAttribute("class", "list-group-item");

              buttonCit.textContent = "Day" + i;
              tContent = "Day" + i;

              uli.textContent = "Temp" + elwe.daily[i].temp.day;
              pWind.textContent = "Wind " + elwe.daily[i].wind_speed;
              pTempe.textContent = "humid " + elwe.daily[i].humidity;
              pUVI.textContent = "uvi " + elwe.daily[i].uvi;
              //pWind.textContent = "Temperature " +  elwe.daily[i].humidity;

              //ul.appendChild(buttonCit);
              ul.appendChild(uli);
              ul.appendChild(pWind);
              ul.appendChild(pTempe);
              ul.appendChild(pUVI);
              todoFiveCities.appendChild(ul);
            }
            $("#fivedays").slideToggle(1000);
          }

          createFiveDays();

          document.getElementById("nameCity").innerHTML =
            data.name +
            "<br> Temperature " +
            data.main.temp +
            " humidity " +
            data.main.humidity +
            "<br> Wind speed" +
            data.wind.speed;
          document.getElementById("iconWea").src =
            "https://openweathermap.org/img/wn/" + iconURL;

          console.log(elwe);

          localStorage.setItem("getCity", acity);
        });
    });
}

//event for city of the INPUT
var todo1 = document.getElementById("myBtn");
todo1.addEventListener("click", function (event, cit) {
  const acity = document.getElementById("inpuCity");
  const theCity = acity.value.trim();
  getApi(theCity);
  getApi(cit);
});

// get tcity from the buttons
var todo = document.getElementById("cities");
todo.addEventListener("click", function (event, cit) {
  var element = event.target;
  cit = element.textContent;

  getApi(cit); //call the API send the city
});

// local storage
var x = localStorage.getItem("getCity");

console.log(x);
