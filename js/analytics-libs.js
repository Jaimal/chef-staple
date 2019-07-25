!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
analytics.load("haAQy4QifQ1YAYrL0e3NFociL7lNv9mn");
analytics.page();
}}();

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function doFormSubmit(redirectUrl) {

  // Callback as per: https://segment.com/docs/sources/website/analytics.js/#identify
  return analytics.identify(
    {
        email: document.getElementById('txt_email').value
    },function(){
      doRedirect(redirectUrl);
    });
}
function doRedirect(url){
  //This is preferred to send to a backend form for capture server-side
  //another way is to use window.location = url, but append data as querystring
  //That said, you could always just submit to the form and then do the identify
  //call server-side in php
  alert('Thank you for signing up!');
  document.getElementById("signup_form").action = url;
  document.getElementById("signup_form").submit();
}
