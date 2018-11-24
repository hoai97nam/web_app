var socket;
window.onload = function() {
	
	socket = io.connect(); //connect to server 
	
	socket.emit("setRole","sender"); //execute sender as client 

	socket.on("greeting", function(data){
		console.log(data);
	});

	document.getElementById("fileSelector").addEventListener("change", function(){		
		submitImg();
	});
	///////////////////////////////
	 socket.on("getUrl", function(myLink){
		console.log(myLink);	
		document.getElementById("myAnchor").href = myLink;
	
	});

};

function submitImg(){
	var selector 	= document.getElementById("fileSelector");
	var img 		= document.getElementById("review");

	var reader = new FileReader();
	reader.onload = function (e) {
    img.src = e.target.result;
		socket.emit("sendPhoto", {base64:e.target.result}); // execute sendPhoto
  }
 	reader.readAsDataURL(selector.files[0]);
}