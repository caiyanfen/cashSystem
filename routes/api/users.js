const express = require('express');
const router =  express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');



// @router     /api/users/test
// @desc       返回请求的数据
// @access     public
router.get('/test',(req,res)=>{
    res.json('您请求的test数据已返回');
});


// @router      /api/users/register
// @desc        返回提交数据之后的状态
// @access       public
router.post('/register',(req,res)=>{
    // res.send('api/users/register');
    //查找数据库是否拥有该邮箱
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            return res.send('该邮箱已经注册');
        }else{
            //存储注册新数据
            const  newUser=new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                identity:req.body.identity
            });

            //密码加密
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err) throw err;
                    newUser.password = hash;
                    //保存到数据库(为什么写到外面，数据库是未加密)
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err));
                });
            });

        }
    })

});


// @router     /api/users/login
// @desc       返回token
// @access     public
router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            //对数据库的用户密码进行解密
            bcrypt.compare(req.body.password, user.password)
            .then(isMatch=>{
                //将用户信息结合设置的密钥secret通过jsonwebtoken生成token
                const userInfo={
                    id:user.id,
                    name:user.name,
                    identity:user.identity
                }
                  //该用户密码是否匹配
                if(isMatch){
                    //生成token返回
                    jwt.sign(userInfo,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                        if(err) throw err;
                        res.json({
                            success:true,
                            token:'Bearer '+ token
                        });



                    })
                    // return res.json('登录成功');
                }else{
                    return res.json('密码错误！');
                }
            })

        }else{
            res.send('该用户不存在！');
        }
    })

});


// @router      /api/users/current
// @desc        返回 current user
// @access      private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
});






module.exports=router;