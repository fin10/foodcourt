const request = require('request')
const express = require('express');
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

const url = 'http://www.welstory.com/menu/Suwon_sec/foodcourt_'
// const hostname = process.env.IP;
// const port = process.env.PORT;
const hostname = 'localhost';
const port = '8000';

const app = express();

app.get('/foodcourt', (req, res) => {
  let restaurant = req.query.restaurant
  let date = req.query.date
  let mealTime = req.query.mealTime
  console.log('# restaurant: ' + restaurant)
  console.log('# date: ' + date)
  console.log('# mealTime: ' + mealTime)

  let building
  let floor
  let meal

  switch (mealTime) {
      case 'breakfast':
          floor = 'floor_1_'
          meal = 'meal_1'
          break;
      case 'lunch':
          floor = 'floor_2_'
          meal = 'meal_2'
          break;
      case 'dinner':
          floor = 'floor_3_'
          meal = 'meal_3'
          break;
  }

  switch (restaurant) {
      case 'r3.1st.basement':
          building = 'R3'
          floor = floor + '1'
          break;
      case 'r3.3rd.floor':
          building = 'R3'
          floor = floor + '3'
          break;
      case 'r5.1st.basement':
          building = 'R5'
          floor = floor + '1'
          break;
      case 'r5.2nd.basement':
          building = 'R5'
          floor = floor + '2'
          break;
      case 'r5.5th.floor':
          building = 'R5'
          floor = floor + '5'
          break;
  }    

  let opts = {
      url: url + building + '.jsp',
      encoding: null,
      qs: {
          'sDate': date
      }
  }

  request.get(opts, (err, response, body) => {
      if (err) throw err

      let converted = iconv.decode(body, 'euc-kr').trim()

      const $ = cheerio.load(converted)
      let menus = $('div #' + meal + ' #' + floor + ' .flr_restaurant')

      let result = []
      menus.each((i, e) => {
          let titB1 = $(e).find('.restaurant_titB1').text()
          let menu = $(e).find('.restaurant_menu').text()
          let txt = $(e).find('.restaurant_txt').text()
          result.push({
              'titB1': titB1,
              'menu': menu,
              'txt': txt
          })
      })
      
      res.json(result)
  })
})

app.listen(port, hostname, () => {
  console.log('Server running at http://%s:%s/', hostname, port);
})
