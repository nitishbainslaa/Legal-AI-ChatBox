require(
"dotenv"
)
.config();


const express =
require(
"express"
);

const cors =
require(
"cors"
);

const Groq =
require(
"groq-sdk"
);



const app =
express();



app.use(

cors()

);


app.use(

express.json()

);



const groq =

new Groq({

apiKey:

process.env

.GROQ_API_KEY

});






app.post(

"/chat",

async(

req,
res

)=>{


try{


let userMessage =

req.body.message;





let completion =

await groq
.chat
.completions
.create({

messages:[


{

role:

"system",


content:

`

You are Legal AI India.

STRICT RULES:

1. Answer ONLY Indian legal questions.

2. Language:
- Hindi → Hindi
- English → English
- Hinglish → Hinglish
- Match user's language exactly

3. Keep answers:
- Short
- Clear
- Practical
- Easy to read

4. Use:

Heading
+
Bullets

ONLY

5. Mention:
- Relevant Acts
- Sections
- Procedures

when necessary.

6. NEVER write:

"Conclusion:"
"Consult advocate"
"Consult lawyer"
"Seek legal advice"
"Consult legal expert"
"Consult court"
"Talk to professional"

7. End answers directly after explanation.

8. Do NOT add unnecessary ending paragraphs.

9. Format example:


💔 Divorce

• Divorce in India may be:

- Mutual consent
- Contested divorce


Applicable laws:

- Hindu Marriage Act, 1955


Process:

1. File petition
2. Court hearing
3. Waiting period
4. Final decree


Typical duration:

6–18 months


STRICT NON-LEGAL RULE:

If question is NOT legal, ALWAYS reply EXACTLY:

"⚖️ Sorry, I can only assist with Indian legal questions and legal guidance."

Never answer:
- Sports
- Politics
- Coding
- Entertainment
- Recipes
- General knowledge

`

},



{

role:

"user",

content:

userMessage

}


],



model:

"llama-3.3-70b-versatile",



temperature:

0.5,


max_tokens:

600


});





res.json({


reply:

completion

.choices[0]

.message

.content


});



}
catch(err){


console.log(

err

);


res.status(
500
)

.json({

error:

"AI unavailable"

});


}


});






app.listen(

3000,

()=>{


console.log(

`

Server Running:

http://localhost:3000

`

);


});