/*
 * (C) Copyright 2014-2015 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */

//var roomId =window.prompt('RoomId', 1);





//var ws = new WebSocket('wss://' + location.host + '/one2many');
var video;
var webRtcPeer;
var socket = io();
var autoView = true;
var room;






/*
socket.on('joinRoom', function (data) {
	console.log(data);
	socket.emit('joinRoom', { rom: roomId });
});


*/




$(function() {
    
    
    
    $.get( "config", function( data ) {
        console.log(data);
        
  $( "#Logo" ).attr( 'src',data.logo );
  
   $( "#channel1" ).html( data.Chanells[0].name );
   $( "#channel2" ).html( data.Chanells[1].name );
   $( "#channel3" ).html( data.Chanells[2].name );
   $( "#channel4" ).html( data.Chanells[3].name );
   $( "#channel5" ).html( data.Chanells[4].name );
  $( "#channel6" ).html( data.Chanells[5].name );
  $( "#channel7" ).html( data.Chanells[6].name );
  $( "#channel8" ).html( data.Chanells[7].name );
  $( "#channel9" ).html( data.Chanells[8].name );
$( "#channel10" ).html( data.Chanells[9].name );

});
    
    
    
	console = new Console();
	video = $('#video')[0];

	$('.viewer').on('click', function(e) {
        room = this.dataset.room
        showSpinner();
        stop();
       	socket.emit('joinRoom', { room: currentRoom() });
//	socket.emit('subscribeToStream', currentRoom());
        viewer(room); e.preventDefault(); 
        } );
	$('#terminate').on('click', function(e) { stop(); e.preventDefault();} );
});

socket.on('connect', function(){
	console.log('Connected to socket');

//	socket.emit('joinRoom', { room: roomId });
//	socket.emit('subscribeToStream', currentRoom());
});

socket.on('disconnect', function(){
	console.log('Disconnected from socket');
	dispose();
});
/*
socket.on('presenterResponse', function(data) {
	presenterResponse(data);
});
*/
socket.on('viewerResponse', function(data) {
	viewerResponse(data);
});

socket.on('stopCommunication', function(data) {
	console.log('stopCommunication');
	dispose();
});

socket.on('iceCandidate', function(data) {
	webRtcPeer.addIceCandidate(data.candidate)
});

socket.on('streamStarted', function(data) {
	if (autoView) {
		viewer();
	}
});

/*
function presenterResponse(message) {
	if (message.response != 'accepted') {
		var errorMsg = message.message ? message.message : 'Unknown error';
		console.warn('Call not accepted for the following reason: ' + errorMsg);
		dispose();
	} else {
		webRtcPeer.processAnswer(message.sdpAnswer);
	}
}*/

function viewerResponse(message) {
	if (message.response != 'accepted') {
		var errorMsg = message.message ? message.message : 'Unknown error';
        toastr.warning(errorMsg)
		console.warn('Call not accepted for the following reason: ' + errorMsg);
		dispose();
	} else {
		webRtcPeer.processAnswer(message.sdpAnswer);
	}
}
/*
function presenter() {
	if (!webRtcPeer) {
		showSpinner(video);

		var options = {
			localVideo: video,
			onicecandidate : onIceCandidate,
            mediaConstraints: {  
    audio:true,  
    video:true  
  }  
	    };

		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
			if(error) return onError(error);

			this.generateOffer(onOfferPresenter);
		});
	}
}
*//*
function onOfferPresenter(error, offerSdp) {
    if (error) return onError(error);

	var message = {
		sdpOffer : offerSdp,
		room: currentRoom()
	};

	socket.emit('presenter', message);
}
*/
function viewer() {
	autoView = true;
	if (!webRtcPeer) {
//		showSpinner(video);

		var options = {
	//		remoteVideo: video,
		remoteVideo: audio,
remoteAudio: audio,
			mediaConstraints: { audio : true, video :false},
			onicecandidate : onIceCandidate
		};

		webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
			if(error) return onError(error);

			this.generateOffer(onOfferViewer);
		});
	}
}

function onOfferViewer(error, offerSdp) {
	if (error) return onError(error);

	var message = {
		sdpOffer : offerSdp,
		room: currentRoom()
	};
	socket.emit('viewer', message);
}

function onIceCandidate(candidate) {
	   //console.log('Local candidate' + JSON.stringify(candidate));
	   socket.emit('onIceCandidate', {candidate : candidate});
}

function stop() {
	autoView = false;
	if (webRtcPeer) {
		socket.emit('stop');
		dispose();
	}
}

function dispose() {
	if (webRtcPeer) {
		webRtcPeer.dispose();
		webRtcPeer = null;
	}
	hideSpinner(video);
}

function sendMessage(payload) {
	var event = payload.id,
		message = payload;
	console.log('Sending message - ' + event + ': ', message);

	socket.emit(event, payload);
}

function showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = './img/transparent-1px.png';
		arguments[i].style.background = 'center transparent url("./img/spinner.gif") no-repeat';
	}
}

function hideSpinner() {
	/*for (var i = 0; i < arguments.length; i++) {
		arguments[i].src = '';
		arguments[i].poster = './img/webrtc.png';
		arguments[i].style.background = '';
	}
   */ 
}

function currentRoom() {
    
    console.log('Try to join room #'+room);
    return room;
  // return { room: roomId };
    
//	return $('#roomName').val();
}

/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
