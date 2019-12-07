/*cyf 2019.12.6  profile */
const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const passport = require('passport');

// @route    GET api/profiles/test
// @desc     返回test测试信息
// @access   public
router.get('/test',(req,res)=>{
    res.json({msg:'GET api/profiles/test'});
});

// @route     POST api/profiles/add
// @desc      创建信息添加接口
// @access    private
router.post('/add',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //保存添加信息的对象
    const profileFields={};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save()
    .then(profile=>{
        res.json(profile);
    })

});


// @route     GET api/profiles
// @desc      查询所有信息接口
// @access    private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.find()
    .then(profile=>{
        if(!profile){
            return res.json('没有任何内容');
        }else{
            res.json(profile);
        }
    })
    .catch(err=>console.log(err));
});

// @route     GET api/profiles/:id
// @desc      查询单个用户信息
// @access    private接口
router.get('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({_id:req.params.id})
    .then(profile=>{
        if(!profile){
            return res.json('没有任何内容');
        }else{
            res.json(profile);
        }
    })
    .catch(err=>console.log(err));

})

// @route     POST api/profiles/edit
// @desc      编辑信息接口
// @access    private
router.post('/edit/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    Profile.findByIdAndUpdate({_id:req.params.id},{$set:profileFields},{new:true})
    .then(profile=>{
        res.json(profile);
    })
});

// @route     POST api/profiles/delete/:id
// @desc      删除单个信息接口
// @access    private
router.delete('/delete/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({_id:req.params.id})
    .then(profile=>{
        //删除后保存
        profile.save().then(profile=>res.json(profile));
    }).catch(err=>res.json('删除失败！'))
});



module.exports=router;