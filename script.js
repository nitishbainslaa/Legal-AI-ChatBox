let loggedIn =
localStorage.getItem(
"legal_ai_login"
);



// ======================
// PAGE LOAD
// ======================

window.onload = ()=>{

let oldChat =

localStorage.getItem(
"chat"
);



let chat =

document.getElementById(
"chat"
);



if(
oldChat
){

chat.innerHTML=
oldChat;

}
else{

appendAI(

`Hello 👋<br><br>

I am AK Tiwari And Associates Legal AI Chat Box.<br><br>

How may I help you?`

);

}

};





// ======================
// POPUP AFTER 2 MIN
// ======================

window.addEventListener(

"load",

()=>{

setTimeout(()=>{

if(

localStorage.getItem(

"legal_ai_login"

)!=="true"

){

document
.getElementById(
"popup"
)

.style.display=

"flex";

}

},180000);

});







// ======================
// SEND MESSAGE
// ======================

async function sendMessage(){


let msg=

document
.getElementById(
"msg"
)

.value
.trim();



if(!msg)
return;



appendUser(
msg
);



document
.getElementById(
"msg"
)

.value=
"";



appendTyping();




try{


let response=

await fetch(

"/api/chat",

{

method:
"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify({

message:
msg

})

}

);



let data=

await response.json();



removeTyping();



appendAI(

marked.parse(

data.reply

)

);





// SAVE chats

let chats =

JSON.parse(

localStorage.getItem(

"userChats"

)

||

"[]"

);



chats.push({

question:
msg,

answer:
data.reply,

time:

new Date()

.toLocaleString()

});



localStorage.setItem(

"userChats",

JSON.stringify(

chats

)

);




saveChat();



}
catch(err){


removeTyping();


appendAI(

"❌ AI unavailable"

);


console.log(
err
);


}


}








// ======================
// LOGIN
// ======================

async function submitLead(){


let name=

document
.getElementById(
"name"
)

.value
.trim();



let phone=

document
.getElementById(
"phone"
)

.value
.trim();



if(

name.length<2

||

phone.length<10

){

alert(

"Enter valid details"

);

return;

}





let chats=

JSON.parse(

localStorage.getItem(

"userChats"

)

||

"[]"

);





try{


await fetch(

"https://script.google.com/macros/s/AKfycbzwuEKK-tuwy1KSMDL9H63qKuZT1OmlRFtCNqnNIrSxATnNNtAlqC5JrAP4wFVo4_mSrQ/exec",

{

method:
"POST",

mode:
"no-cors",

headers:{

"Content-Type":

"text/plain"

},

body:

JSON.stringify({

name,

phone,

chats

})

}

);


}
catch(err){

console.log(
err
);

}




localStorage.setItem(

"legal_ai_login",

"true"

);



localStorage.setItem(

"name",

name

);



localStorage.setItem(

"phone",

phone

);




localStorage.removeItem(

"userChats"

);




document
.getElementById(
"popup"
)

.style.display=

"none";



alert(

"Login successful"

);


}








// ======================
// USER MESSAGE
// ======================

function appendUser(msg){


let chat=

document
.getElementById(
"chat"
);



chat.innerHTML +=

`

<div class="user">

${msg}

<div class="time">

${getTime()}

</div>

</div>

`;



scrollBottom();

saveChat();

}








// ======================
// AI MESSAGE
// ======================

function appendAI(msg){


let chat=

document
.getElementById(
"chat"
);



let ai=

document.createElement(
"div"
);



ai.className=
"ai";



ai.innerHTML=

`

⚖️ AK Tiwari And Associates

<br><br>

${msg}

<div class="time">

${getTime()}

</div>

`;



chat.appendChild(
ai
);



scrollBottom();

saveChat();

}





function appendTyping(){

let chat=

document
.getElementById(
"chat"
);


chat.innerHTML +=

`

<div

id="typing"

class="ai">

⚖️ AI typing...

</div>

`;

scrollBottom();

}



function removeTyping(){

let typing=

document
.getElementById(
"typing"
);


if(
typing
){

typing.remove();

}

}





document
.getElementById(
"msg"
)

.addEventListener(

"keypress",

function(e){

if(

e.key==="Enter"

){

sendMessage();

}

}

);







function getTime(){

return new Date()

.toLocaleTimeString(

[],

{

hour:
"2-digit",

minute:
"2-digit"

}

);

}





function scrollBottom(){

let chat=

document
.getElementById(
"chat"
);



chat.scrollTop=

chat.scrollHeight;

}





function saveChat(){

localStorage.setItem(

"chat",

document
.getElementById(
"chat"
)

.innerHTML

);

}





function clearChat(){

localStorage.removeItem(
"chat"
);

localStorage.removeItem(
"userChats"
);


document
.getElementById(
"chat"
)

.innerHTML=
"";


appendAI(

"Hello 👋"

);

}





// ======================
// VOICE
// ======================

function startVoice(){


let recognition=

new(

window
.SpeechRecognition

||

window
.webkitSpeechRecognition

)();



recognition.lang=

"en-IN";



recognition.start();



recognition.onresult=

function(e){

document
.getElementById(
"msg"
)

.value=

e.results[0][0]
.transcript;

};


}
