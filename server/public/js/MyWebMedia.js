'use strict';


class MyWebMedia {
  eDistUpperThreshold = 0.55;
  eDistLowerThreshold = 0.03; // Too good to be true, can it be faking ?.

  SimpleAjax(ajaxObj, MyDataHandler, MyErrorHandler, Data4Handlers, that) {

    var request = $.ajax(ajaxObj);
    request.done((data) => {
      MyDataHandler(data, Data4Handlers, that);
    });

    request.fail((jqXHR, textStatus, err) => {
      MyErrorHandler(jqXHR, Data4Handlers, that);
    });

  }

  GenericDataHandler(data, Data4Handlers, that) {
    that.DisplayAlerts("success", 1000, 300, Data4Handlers.success_msg);
  }

  GenericErrorHandler(jqXHR, Data4Handlers, that) {
    let s = jqXHR.status + ' Error : ' + jqXHR.statusText
    that.DisplayAlerts("danger", 2500, 300, s + "   " + Data4Handlers.error_msg);
  }

  CheckInErrorHandler(jqXHR, Data4Handlers, that) {
    let s = jqXHR.status + ' Error : ' + jqXHR.statusText
    that.DisplayAlerts("danger", 2500, 300, s + "   " + Data4Handlers.error_msg);
  }

  DisplayAlerts(choice, delay, t2, msg) {
    var AlertView = $("#MyAlertViewText");
    AlertView.text(msg);
    if (choice == "success") {
      if (AlertView.hasClass("alert-danger")) {
        AlertView.removeClass("alert-danger");
      }
      AlertView.addClass("alert-success");
      AlertView.css("padding", "0px");
    }
    else if (choice == "danger") {
      if (AlertView.hasClass("alert-success")) {
        AlertView.removeClass("alert-success");
      }
      AlertView.css("padding", "5px");
      AlertView.addClass("alert-danger");
    }

    $("#MyAlertViewText").fadeTo(delay, t2).slideUp(t2, function () {
      $("#MyAlertViewText").slideUp(t2);
    });

  }


  SetStatusPhotoCompare(jsonObj) {
    let MyPhotoContainerElement = document.querySelector("#photo-container");

    if (jsonObj.eDistance > this.eDistLowerThreshold &&
      jsonObj.eDistance < this.eDistUpperThreshold) {
      MyPhotoContainerElement.style.borderColor = "green";
      this.DisplayAlerts("success", 2000, 300, "Welcome aboard");
    } else {
      MyPhotoContainerElement.style.borderColor = "red";
      let s = "Photo verification failed: please proceed to manual check-in process";
      if (jsonObj.mlsCode1 == 0) {
        s = "User not found: please proceed to manual check-in process";
      }

      this.DisplayAlerts("danger", 3000, 300, s);
    }
  }


  CheckInDataHandler(data, Data4Handlers, that) {
    var jsonObj = undefined;

    if (typeof data === 'string' || data instanceof String) {
      jsonObj = JSON.parse(data);
    } else {
      jsonObj = data;
    }

    console.log(jsonObj);
    that.SetStatusPhotoCompare(jsonObj);
  }

  AddNewPassengerDataHandler(data, Data4Handlers, that) {
    var jsonObj = undefined;

    if (typeof data === 'string' || data instanceof String) {
      jsonObj = JSON.parse(data);
    } else {
      jsonObj = data;
    }
    // console.log( data );
    // console.log("Success: AddNewPassenger " + jsonObj);
    that.DisplayAlerts("success", 1000, 300, "New passenger Added to the database");
    // alert( "Added New passenger");
  }



  async OnStartWebCam(video) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

      // Let disable Web Cam button
      webCamBtn.disabled = true;
      PhotoBtn.disabled = false;

      navigator.mediaDevices.getUserMedia({
        // video: {width: {exact: 640}, height: {exact: 480}},
        // video: {width: {exact: 480}, height: {exact: 320}},
        video: { width: 480, height: 320, frameRate: { ideal: 20, min: 10 } },
        audio: false
      })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((er) => {
          alert("Error: getUserMedia stream");
          console.log("getUserMedia: " + er);
          // console.log("getUserMedia: Something went wrong!");

        });
    }
  };

  OnDeletePassengers() {
    let ajaxObj = {
      url: "/v1/passenger/0",
      method: "DELETE",
      dataType: "json"
    };

    let Data4Handlers = {
      success_msg: "Deleted all passengers !",
      error_msg: "Error: DeletePassengers"
    };

    this.SimpleAjax(ajaxObj, this.GenericDataHandler,
      this.GenericErrorHandler, Data4Handlers, this);
  }

  OnPhotoSendToDb() {
    let PhotoQuality = 0.5;
    let canvas = document.getElementById('canvas');
    let NicknameInput = document.getElementById('NicknameInput');
    let img = canvas.toDataURL('image/jpeg', PhotoQuality);
    let NickName = NicknameInput.value;
    var selectedOption = document.querySelector('input[name="AppOperationType"]:checked').value;

    if (NickName.length < 3) {
      alert('Please provide a nickname > 2')
      return;
    }

    let Data4Handlers = {
      success_msg: "",
      error_msg: ""
    };

    let objData = {
      id: 101,
      name: NickName,
      img1: img
    };

    if (selectedOption == "CheckIn") {

      Data4Handlers.error_msg = " CheckIn";
      let ajaxObj = {
        url: "/v1/checkin",
        method: "POST",
        dataType: "json",
        data: objData
      };

      this.SimpleAjax(ajaxObj, this.CheckInDataHandler,
        this.CheckInErrorHandler, Data4Handlers, this);
    } else {
      Data4Handlers.error_msg = " Adding a new passenger";
      let ajaxObj = {
        url: "/v1/passenger",
        method: "POST",
        dataType: "json",
        data: objData
      };
      this.SimpleAjax(ajaxObj, this.AddNewPassengerDataHandler,
        this.GenericErrorHandler, Data4Handlers, this);

    }
  }


  PassengersListDataHandler(data, Data4Handlers, that) {
    let s = undefined;
    data.forEach(function (element) {
      if (s == undefined) {
        s = element.name.trim();
      } else {
        s = s + ",  " + element.name.trim();
      }
    });

    s = `Found ${data.length} passenger(s) in the database (${s})`;
    that.DisplayAlerts("success", 2000, 300, s);
  }

  OnClickPassengersList() {

    let Data4Handlers = {
      success_msg: "",
      error_msg: " Passengers List"
    };

    let ajaxObj = {
      url: "/v1/passenger",
      method: "GET",
      dataType: "json",
      data: undefined
    };

    this.SimpleAjax(ajaxObj, this.PassengersListDataHandler,
      this.GenericErrorHandler, Data4Handlers, this);
  }

  InitAlert() {
    this.DisplayAlerts("danger", 20, 5, " ");
  }

};

const myMedia = new MyWebMedia();


//$(document).ready(  function ()
$(() => {    // jQuery document ready


  var width = 480;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var streaming = false;
  const MediaContainerDefaultColor = "#333"
  const webCamBtn = document.getElementById('webCamBtn');

  const video = document.getElementById('webcamElement');
  const canvas = document.getElementById('canvas');
  const PhotoBtn = document.getElementById('PhotoBtn');
  const ClearPhotoBtn = document.getElementById('ClearPhotoBtn');
  const CheckInBtn = document.getElementById('CheckInBtn');
  const NicknameInput = document.getElementById('NicknameInput');
  let LastOperationSelection = undefined;
  PhotoBtn.disabled = true;
  ClearPhotoBtn.disabled = true;
  CheckInBtn.disabled = true;


  const MyWebCamContainerElement = document.querySelector("#webcam-container");
  const MyPhotoContainerElement = document.querySelector("#photo-container");

  let OperationSelection = document.getElementById('AppOperationType1').value;
  var rad = document.AppOperationTypeForm.AppOperationType;
  for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function () {
      OperationSelection = this.value;
      LastOperationSelection = this.value;

      if (OperationSelection == "AddPassengers") {
        MyPhotoContainerElement.style.borderColor = "blue";
        CheckInBtn.innerText = "New passenger";
        CheckInBtn.className = "btn btn-primary"
      } else {
        MyWebCamContainerElement.style.borderColor = MediaContainerDefaultColor;
        MyPhotoContainerElement.style.borderColor = MediaContainerDefaultColor;
        CheckInBtn.innerText = "Check-In";
        CheckInBtn.className = "btn btn-success"
      }
    });
  }


  webCamBtn.onclick = async () => {
    myMedia.OnStartWebCam(video);
  };

  video.oncanplay = async (ev) => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);

      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }


  function TakePicture() {
    var context = canvas.getContext('2d');

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    } else {
      ClearPhoto();
    }
  }

  PhotoBtn.onclick = async () => {
    TakePicture();
    ClearPhotoBtn.disabled = false;
    CheckInBtn.disabled = false;
    MyPhotoContainerElement.style.borderColor = MediaContainerDefaultColor;
    if (LastOperationSelection == "AddPassengers") {
      MyPhotoContainerElement.style.borderColor = "blue";
    }

  }

  ClearPhotoBtn.onclick = async () => {
    ClearPhoto();
    CheckInBtn.disabled = true;
    MyPhotoContainerElement.style.borderColor = MediaContainerDefaultColor;
    if (LastOperationSelection == "AddPassengers") {
      MyPhotoContainerElement.style.borderColor = "blue";
    }
  }

  function ClearPhoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#424242";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  NicknameInput.onchange = async () => {
    if (LastOperationSelection == "AddPassengers") {
      MyPhotoContainerElement.style.borderColor = "blue";
    } else {
      MyPhotoContainerElement.style.borderColor = MediaContainerDefaultColor;
    }
  };

  ///////////////////////////////////////////////////
  myMedia.InitAlert();

});

