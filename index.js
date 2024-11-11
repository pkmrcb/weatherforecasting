// console.log("pawan kumar")
// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// function renderWeatherInformation(data){
//     let newPara=document.createElement('p');
//     newPara.textContent=`{data?.main?.temp.toFixed(2)} °C`;

//     document.body.appendChild(newPara);
// }
// async function fetchWeatherDetails(){
//     // let latitude=15.33333;
//     // let longitude=74.0833;
//     try{
//         let city="goa"

//        const response= await fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric')
//        const data= await response.json()
//        console.log("Weather data =>" ,data);
//        renderWeatherInformation(data);//for rendering data on UI

//        //     let newPara=document.createElement('p');
//       //     newPara.textContent= `{data?.main?.temp.toFixed(2)} °C`

//       //     document.body.appendChild(newPara);
//     }catch(err){
//        //handle the error here
//     }
//    //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
    
    
// }
// async function getCustomWeatherDetails(){
//     try{
//         let latitude=15.6333;
//         let longitude=18.3333;
//         let result=await fetch('https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric')
//         let data=await result.json();
//         console.log(data);
//     }catch(err){
//         console.log("Error Found ",err);
//     }
    
    
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No Geolocation support");
//     }
// }
// function showPosition(position){
//     let lat=position.coords.latitude;
//     let longi=position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userConatiner=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container")

//initially variables needs??
 let oldTab=userTab;
 const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
 oldTab.classList.add("current-tab");//current-tab css property add karta hai
 
//ek kaam or pending hai??
//ho sakta hai ki session me pahle se latitude and longitude present ho
//so we have to initially call getFromSessionStorage
getFromSessionStorage();
function switchTab(newTab){
    if(newTab!=currentTab){
        oldTab.classList.remove("current-tab");//current-tab ki css property  remove karta hai
        oldTab=newTab;
        oldTab.classList.add("current-tab");//current-tab ki css property add karte hai
        if(!searchForm.classList.contains("active")){
            //kya search form wala container invisible??
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");           
        }
        else{
            //mai pahle searchTab par tha ab yourWeather wala tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab pe aa gya hu to weather bhi display karna padega,so let's check local storage first
            //for coordinates if we have saved them there
            getFromSessionStorage();
        }

    }
}

userTab.addEventListener("click", ()=>{
    //pass clicked as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    //pass clicked as input parameter
    switchTab(searchTab);
})
//check if coordinates  are already present in session storage
function getFromSessionStorage(){
   const localCoordinates=sessionStorage.getItem("user-coordinates")//user-coordinates ek json string hai jo set hui hai
   if(!localCoordinates){
    //agar local coordinates nhi mile
      grantAccessContainer.classList.add("active");
   }
   else{
      const coordinates=JSON.parse(localCoordinates);//json string ko json object me change karna
      fetchUserWeatherInfo(coordinates);
   }
}
//Api call ke liye async function banana padega
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API CALL
    try{
       const response=await fetch('//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric') 
       const data= await response.json();
       //after api call remove loader
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       //api ke data ko ui pe render karna hai
       renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        //hw
    }
}
function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    //fetch values from weatherInfo object and put it UI elelments
    //optional chaining operator dwara ham json ke andar kisi value ko access karte hai
    //formatter me bhejke dekhte hai ki kaise access kare
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;



}
//grant access button par eventListener lagana hoga joki 
//local coordinate calculate karega
//then usko sessionstorsag
function getLocation(){
    //we use geolocation api in this
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geolocation support available
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-cooridinates", JSON.stringify(userCoordinates));//user-coordinates naam ki string
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
        //api call karna  padfega
    }
})
//since it is api call
//so we use async await
async function fetchSearchWeatherInfo(cityName){
    ///jab tak call ho rha hai loading screen dikhyi deni chahiye
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        //response api se load ho chuka hai
        //so remove the loader
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
       //hw
    }
}
