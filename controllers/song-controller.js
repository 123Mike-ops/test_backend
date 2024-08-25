const express=require('express');

const Song=require('../models/song');
const catchAsync=require('../utils/catchAsync')
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const extractError = require('../utils/error');
const rest=require('../utils/rest');
const MetaData=require('../utils/rest');

 
exports.addSong=async(req,res,next)=>{
   
try {
        const { title, artist, album, genre } = req.body;
        const addedSong = new Song({ title, artist, album, genre });
        await addedSong.save();
   
    const metaData = Object.create(rest.MetaData)
    const data=addedSong
      return    rest.SuccessResponseJson(res,metaData,data,201);  

    } catch (error) {
            logger.error(error);
            extractError.Db_Error(error).then(
            next(error)
      ) 
   }

}

exports.deleteSong = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const deletedSong = await Song.findByIdAndDelete(id);

 
    if (!deletedSong) {
          const errData="Song not found"
      return  rest.FailureResponseJson(res, errData, 404);
    }
      const metaData = Object.create(rest.MetaData)
    const data=deletedSong
        return  rest.SuccessResponseJson(res,metaData,data,200); 
     
});
exports.getSong = catchAsync(async (req, res, next) => {

     const { id } = req.params;

    const song = await Song.findById(id);
    if (!song) {
       const errData="Song not found"
        return rest.FailureResponseJson(res, errData, 404);
    }
      const metaData = Object.create(rest.MetaData)
    const data=song
       return   rest.SuccessResponseJson(res,metaData,data,200); 
     
});
exports.updateSong = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body; 

    const updatedSong = await Song.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } 
    );

   
    if (!updatedSong) {
        const errData="Song not found"
      return  rest.FailureResponseJson(res, errData, 404);
    }

    const metaData = Object.create(rest.MetaData)
    const data=updatedSong
      return    rest.SuccessResponseJson(res,metaData,data,200); 
});



exports.findSong=catchAsync(async(req,res,next)=>{

    const queryObj={...req.query}
    const excludedFields=['page','sort','limit','fields'];
    excludedFields.forEach(el=> delete queryObj[el]); 
    let query =Song.find(queryObj);


    let queryStr=JSON.stringify(queryObj);
    query=queryStr.replace(/\b(gte|gt|lte|lt) \b/g, match => `$${match}`); 
        

    const song = await Song.find(JSON.parse(queryStr));
    const metaData = Object.create(rest.MetaData);

    const data=song
return    rest.SuccessResponseJson(res,metaData,data,200);  

});
exports.getStat = catchAsync(async (req, res, next) => {
    const metaData = Object.create(rest.MetaData)
    const totalSongs = await Song.countDocuments({});
    const totalArtists = await Song.distinct('artist').countDocuments({});
    const totalAlbums = await Song.distinct('albumId').countDocuments({});
    const totalGenres = await Song.distinct('genre').countDocuments({});
    const songsByGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const songsAndAlbumsByArtist = await Song.aggregate([
      { $group: { _id: '$artist', totalSongs: { $sum: 1 }, albums: { $addToSet: '$albumId' } } },
      { $project: { totalSongs: 1, totalAlbums: { $size: '$albums' } } },
      { $sort: { totalSongs: -1 } }
    ]);
    const songsInAlbum = await Song.aggregate([
      { $group: { _id: '$albumId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
       const data = {
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
      songsByGenre,
      songsAndAlbumsByArtist,
      songsInAlbum
    };
return    rest.SuccessResponseJson(res,metaData,data,200);  
  
})