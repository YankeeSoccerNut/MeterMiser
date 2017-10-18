$(document).ready(()=>{

$('.mm-signin-form').submit((event)=>{

  event.preventDefault()

  var firstName = $('#first-name-input').val();//pick value off html form
  var lastName = $('#last-name-input').val();//pick value off html form
  var email = $('#email-input').val();//pick value off html form
  var phonePhone = $('#phone-phone-input').val();//pick value off html form
  var textPhone = $('#text-phone-input').val();//pick value off html form


//First Name
  localStorage.setItem('First Name',firstName);//store the value
  //to read the value from local storage
  var firstName = localStorage.getItem('First Name');//

//Last Name
  localStorage.setItem('Last Name',lastName);//store the value
  //to read the value from local storage
  var lastName = localStorage.getItem('Last Name');//

//Email Address
  localStorage.setItem('Email Address',email);//store the value
  //to read the value from local storage
  var email = localStorage.getItem('Email Address');//

//Main Phone Number
  localStorage.setItem('Main Phone',phonePhone);//store the value
  //to read the value from local storage
  var phonePhone = localStorage.getItem('Main Phone');//

  //Text Phone Number
    localStorage.setItem('Text Phone',phonePhone);//store the value
    //to read the value from local storage
    var textPhone = localStorage.getItem('Text Phone');//















	})
});
