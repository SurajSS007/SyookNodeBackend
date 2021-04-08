const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');

module.exports = {
    login: async(req, res) => {
        try{
            const username = req.body.username
            const password = req.body.password
        
        const user = await User.findOne({
            username : username
       })

       if(user == null){
           return res.status(400).send('cannot find user')
       }
       console.log(user.password);
       bcrypt.compare(password, user.password,(err, data) => {
        //if error than throw error
        if (err) throw err

        //if both match than you can do anything
        if (data) {
            return res.status(200).json({ auth: true, result: data })
        } else {
            return res.status(401).json({ msg: "Invalid credencial" })
        }
    }
        
        )
            
        }catch(err){
        res.send(err)
        }
    },
    addUser: async(req,res)=>{
        try {
            const { username, password } = req.body;
    
            
            const user = new User();
            user.username = username
            user.password = password
    
            await user.save((err, doc) => {
                if (!err)
                    res.json(user)
                else {
                     console.log(err);
                }
            });
        } catch (err) {
            res.send(err)
            console.log(err);
        }
    }     
}