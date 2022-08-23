const uuid = require('uuid');
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const between = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateEmailCode = () => {
  const emailCode = between(100000, 200000);

  return emailCode;
};

const generatePhoneNumberCode = () => {
  const phoneNumberCode = between(100000, 200000);

  return phoneNumberCode;
};


const generateKey = () => {
  const keyCode = uuid.v1();
  return keyCode;
};

const generateDateTime = () => {
  // create a new `Date` object
  var today = new Date();
 
  // get the date and time
  //var now = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds);

  //var now = today.toLocaleString();
  return today;
};

const generateYear = () => {
  const d = new Date();
    const year = d.getFullYear();
    
  return year;
};

const generateMonth = () => {
  const d = new Date();
    
    const month = d.getMonth() + 1;
  
  return month;
};

const generateWeek = () => {

    currentdate = new Date();
    var oneJan = new Date(currentdate.getFullYear(),0,1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
  
  return weekNumber;
};

const generateDay = () => {
  const d = new Date();
  
    const day = d.getDate();
  return day;
};



const generateMonthName = () => {
  const date = new Date();
    return monthNames[date.getMonth()];
}


module.exports = {
  generateEmailCode,
  generateKey,
  generatePhoneNumberCode,
  generateDateTime,
  generateYear,
  generateMonth,
  generateWeek,
  generateDay,
  generateMonthName

};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfZW1haWwiOiJtaXJpYW1AZ21haWwuY29tIiwidXNlcm5hbWUiOiJtaW1pIiwiX2lkIjoiNjJmYjVkNjNjZDQ3MDUyN2Y2NWY3ZDA1Iiwid2hvQXJlWW91IjoiY3VzdG9tZXIiLCJpYXQiOjE2NjA4MDg5NzIsImV4cCI6MTY5MjM0NDk3Mn0.r1R8MoajIo1GOAUGYySyDloxKsoexM2v4ciI1HpTYBI