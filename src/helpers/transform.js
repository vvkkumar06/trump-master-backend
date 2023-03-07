const _ = require('lodash');
const transformGalleryCardStateToList = (data, playersApiData) => {
  let tempData = _.cloneDeep(data);
  let galleryItems = [];
  Object.keys(tempData).forEach(key => {
    for(let i=0; i<tempData[key].count; i++) {
      galleryItems.push(playersApiData.find(item => item.TMID == key));
    }
  });
  return galleryItems;
}


const transformTeamCardsStateToList = (data, playersApiData) => {
  const team = {};
  for(let key in data) {
     let foundPlayer = playersApiData.find(item => item.TMID == data[key]);
     team[key] = foundPlayer ? foundPlayer : {}
  }
  return team;
}

module.exports = {
  transformGalleryCardStateToList,
  transformTeamCardsStateToList,
}