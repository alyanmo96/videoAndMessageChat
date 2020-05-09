
const socket = io(); //location of where server is hosting socket app

// query DOM
const message = document.getElementById('message'),
    button =  document.getElementById('submit'),
    output = document.getElementById('output');

/**********************************************video section***********************************/

//get the locL VIDEO AND DISPLAY WITH PERMATIONS
function getVideo(callbacks){
    navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    var constraints={
        audio:true,
        video:true
    }
    navigator.getUserMedia(constraints,callbacks.success,callbacks.error)
}

function recStream(stream,elemid){
    var video = document.getElementById(elemid);
    video.srcObject = stream;
    window.peer_stream = stream;
}

getVideo({
    success:function(stream){
        window.locastream = stream;
        recStream(stream,'lVideo')
    },error:function(err){
        alert("אין אפשרות לגשת למצלמה, נא לאשר גישה");
        console.log(err);
    }
})

var conn;
var peer_id;

//create a peer connection with peer obj
var peer = new Peer({key: 'lwjd5qra8257b9'});

//display the peer id on the DOM
peer.on('open', function(id) {
    document.getElementById("displayId").innerHTML=peer.id;
});

peer.on('connection',function(connection){
    conn=connection;
    peer_id=connection.peer
    document.getElementById('connId').value=peer_id;
});

peer.on('error',function(error){
    alert('מספר זהוי פגישה שגוי, נא לעדכן');
})

//onclick with the connection button---> expose information
document.getElementById('conn_button').addEventListener('click',function(){
    peer_id=document.getElementById("connId").value;
    if(peer_id){
        conn = peer.connect(peer_id);
    }else{
        alert('enter an id');
        return false;
    }
})

button.addEventListener('click', () =>{
    socket.emit('chat', {
        message: message.value
    }) 
}) 

function displayAndNone() {
    socket.on('chat', (data)=>{
        output.innerHTML += '<p>' + data.message + '</p>';//display the sent message
        document.getElementById('message').value = '';//clear message input after send a message
    })      
    document.getElementById('displayId').style.display = 'none';
    document.getElementById('connId').style.display = 'none';
    document.getElementById('conn_button').style.display = 'none';
    document.getElementById('call_button').style.display = 'none';
}

//call onclick (offer and answer is exchanged)
peer.on('call',function(call,data){
    displayAndNone();
    call.answer(window.locastream);
        call.on('stream',function(stream){
            window.peer_stream = stream;
            recStream(stream,'rVideo');
        });
        call.on('close',function(){
            alert('השיחה הסתיימה');
        })    
});

//as to call
document.getElementById('call_button').addEventListener('click',function(){
    var call=peer.call(peer_id,window.locastream);
    call.on('stream',function(stream){
        window.peer_stream=stream;
        recStream(stream,'rVideo');
    })
    displayAndNone();
})
