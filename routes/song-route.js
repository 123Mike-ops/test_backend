const express=require('express')
const router=express.Router();
const songController=require('../controllers/song-controller');



router.route('/')
        .post(songController.addSong)
        .get(songController.findSong)
router.route('/:id').patch(songController.updateSong)
router.route('/:id').delete(songController.deleteSong)
router.route('/:id').get(songController.getSong)
router.route('/stat/all').get(songController.getStat)
        
module.exports=router;