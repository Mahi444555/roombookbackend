import express, { response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();                                        //here we configure the dotenv by using config() method

const app = express();                                  //calling express method and assign to app 
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;                //accessing mongo URL link from env file 

app.use(express.json());
app.use(cors());                                        //here to use express and cors method with app then write like these 

//create method to createConnection 
const createConnection = async () => {

    //firstly create client / MongoClient object 
    const client = new MongoClient(MONGO_URL);
    await client.connect();                                 //HERE MONGODB (MongoClient) and mongodb online url get connected
    console.log("Connection get successfully established !!");
    return client;                                          //here just returning client ie. object 
}

const client = await createConnection();    //calling above function 


//first method to dispaly message get()
app.get("/", (req, res) => {
    res.send("<h1>app run successfuly</h1>");
})

//second method to post data post()
app.post("/create_room", async (req, res) => {
    const data = req.body;                  //here we requesting data from postmans body and storing that info in that variable

    const result = await client
        .db("booking")
        .collection("create_room")
        .insertOne(data);

    result.acknowledged
        ? res.status(200).send({ msg: "rooms created successfully" })
        : res.status(400).send({ msg: "something went wrong! plz try again" })
})

//method for book_room 
app.post("/book_room", async (req, res) => {
    
    const data = req.body
    // const dateCheck = await client
    //     .db("booking")
    //     .collection("book_room")
    //     .findOne({ booking_date: data["booking_date"] });

    // if (dateCheck.booking_date) {
    //     res.send({
    //         msg: "The room is booked for this date.Please select another date"
    //     });
    //     return;
    // }


    const result = await client
        .db("booking")
        .collection("book_room")
        .insertOne(data)        //here inserting data using these method inside db


    const test = await client
        .db("booking")
        .collection("create_room")
        .updateOne(
            { id: "63983d6e39517ebc88cc7261" },
            { $inc: { rooms_available: -1 } }
        );

    result.acknowledged
        ? res.status(200).send({ msg: "room booked sucessfully" })
        : res.status(400).send({ msg: "something went Wrong ! try again" })

})

//List down all the booked room details
app.get("/booked_rooms",async(req,res)=>{
    const result= await client
    .db("booking")
    .collection("book_room")
    .find(req.query)
    .toArray();

    res.status(200).send(result)


})

app.get("/getinfo",async(req,res)=>{
    const result=await client
    .db("booking")
    .collection("create_room")
    .find(req.query)
    .toArray();
    res.status(200).send(result)
})

app.listen(PORT, () => {
    console.log("server is running on  " + PORT);
})


