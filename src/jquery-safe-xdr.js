(function ($, window) {

  $.safeXDR = function (url, parameters, complete) {
   if (complete) {
      get(url, parameters, complete);
    } else {
      getByImage(url, parameters);
    }
  }

 function getByImage (url, parameters) {
    parameters.nocache = new Date().getTime();
    var imageSrc = url + "?" + $.param(parameters);
    var image = new Image();

    image.src = imageSrc;
  }

  function get (url, parameters, complete) {
    function parseAndInvokeCallback(response) {
      try{
        response = JSON.parse(response);
      } catch(err) {}
      complete(response);
    }

    if ( isIE() ) {
      getByXDomainRequest(url, parameters, parseAndInvokeCallback);
    } else {
      getByAjax(url, parameters, parseAndInvokeCallback);
    }
  }

  function getByAjax (url, parameters, complete) {
    $.ajax({
      url: url,
      type: 'GET',
      data: parameters,
      cache: false,
      timeout: 500,
      success: function (response) {
        complete(response);
      },
      error: function () {
        complete();
      }
    });
  }

  function getByXDomainRequest (url, parameters, complete) {
    parameters.nocache = new Date().getTime();

    var xdr = new XDomainRequest();

    if (!xdr) {
      return complete();
    }

    xdr.onload = function() {
      complete(xdr.responseText);
    };

    xdr.onerror = function() {
      complete();
    };

    xdr.onprogress = function() {};

    xdr.ontimeout = function() {
      complete();
    };

    xdr.timeout = 500;

    xdr.open('GET', url + "?" + $.param(parameters));
    xdr.send();
  }

  function isIE () {
    return window.XDomainRequest;
  }

}(jQuery, window));
