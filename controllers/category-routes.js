const router = require('express').Router();
const { Category } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');

// Get all categories
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbCategories = await Category.findAll();

        dbCategories = rawDbCategories.map((categoryObj) => {
            return categoryObj.get({plain: true});
        })
        if(dbCategories){
            res.status(200).json(dbCategories);
        } else {
            res.status(404).json({message: "no Categories found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new category
router.post('/', onlyIfLoggedIn, async (req, res) => {
    try {
        const dbCategoryData = await Category.create({
            name: req.body.name,
            colour: req.body.colour,
            emoji: req.body.emoji
        });
        res.status(200).json(dbCategoryData);
    
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// Get one categories
router.get('/:category_id',onlyIfLoggedIn,  async (req, res) => {
    try{
        const dbCategory = await Category.findByPk(req.params.category_id, {
            include: {all:true, nested: true}
        });
        if(dbCategory){
            res.status(200).json(dbCategory);
        } else {
            res.status(404).json({message: `no Category with id: ${req.params.category_id} found`});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Update a category
router.put('/:category_id', onlyIfLoggedIn, async (req, res) => {
    try {
        const dbCategoryData = await Category.findByPk(req.params.category_id);
        if(dbCategoryData){
            dbCategoryData.update({
                name: req.body.name,
                colour: req.body.colour,
                emoji: req.body.emoji
            });
            res.status(200).json(dbCategoryData);
        } else {
            res.status(404).json({message: `No category with id: ${req.params.category_id}`});
        }
    
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// Delete a category
router.delete('/:category_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let target = await Category.findByPk(req.params.category_id);
        let targetName = target.name;
        if(target){
            target.destroy();
            res.status(200).json({message:`Deleted category ${targetName}`});
        } else{
            res.status(404).json({message: `Could not find category with id: ${req.params.category_id} to delete`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;
