const mongoose=require("mongoose");

const connectDB=()=>{
    mongoose.connect(process.env.MONGODB_URI,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
        // useCreateIndex: true,
        
    }).then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
}

module.exports=connectDB