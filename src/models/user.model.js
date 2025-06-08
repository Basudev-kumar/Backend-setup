import mongoose , {Schema} from 'mongoose';





const userSchema = new Schema (

    {

        
        id:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:'Video'
            }
        ],

        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        
        },

        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },

        avatar:{
            type:String,                   // cloudary url
            required:true,
        
        
        },

        coverImage:{
            type:String,                  // cloudary url
           
            
        },
    
        
        password:{
            type:String,
            required:[true,"Password is required"],
        
        },

        
        refreshToken:{
            type:String,
    
        },

        
        createAt:{
            type:Date,
            
        },

        
        updateAt:{
            type:String,
            
        },



    
    },
    {
        timestamps:true
    }

);



export const User=mongoose.model("User",userSchema);