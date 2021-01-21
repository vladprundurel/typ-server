const express = require('express');
const router = express.Router();
const _ = require('lodash');
var moment = require('moment');

const Meal = require('../models/meal');
const UserNutritionData = require('../models/userNutritionData');
const CheckIn = require('../models/checkIn');
const { resolve } = require('path');

router.get('/getMeasurementsData', (req, res, next) => {
    moment.locale();
    var query = require('url').parse(req.url, true).query;
    var from_date = query.from_date.split("-");
    var to_date = query.to_date.split("-");
    var user_id = query.user_id;
    var from_date2 = from_date[2] + "-" + from_date[1] + "-" + from_date[0];
    var to_date2 = to_date[2] + "-" + to_date[1] + "-" + to_date[0];
    console.log(from_date2);
    CheckIn.find({
        "date": {
            $gte: from_date2,
            $lte: to_date2
        },
        "userId": user_id
    },
        {
            "date": 1,
            "weight": 1,
            "neck": 1,
            "waist": 1,
            "hips": 1,
            "_id": 0
        },
        {
            sort: 'date'
        }, (err, checkInData) => {
            if (err) {
                console.log(err);
            } else {
                checkInByDate = [];
                if(checkInData) {
                    try {
                        checkInData.forEach(data => {
                            data = data.toObject();
                            weight = data.weight;
                            neck = data.neck;
                            waist = data.waist;
                            hips = data.hips;
                            date = moment(data.date).locale("ro").format('l');
                            checkInByDate.push(
                            {
                                "date": date,
                                "weight": weight,
                                "neck": neck,
                                "waist": waist,
                                "hips": hips
                            }
                            );
                        });
                        res.send(checkInByDate);
                    }catch(e) {

                    }
                }
               
                
            }
        }
    )

});


//params: from_date, to_date
router.get('/getCaloriesByDate', (req, res, next) => {

    moment.locale();
    // console.log(query.from_date);

    var query = require('url').parse(req.url, true).query;
    var from_date = query.from_date.split("-");
    
    var to_date = query.to_date.split("-");
    var user_id = query.user_id;
    var from_date2 = from_date[2] + "-" + from_date[1] + "-" + from_date[0];
    var to_date2 = to_date[2] + "-" + to_date[1] + "-" + to_date[0];
    UserNutritionData.find({
        "userId": user_id
    }, (err, data) => {
        if (data) {
            try {
                caloriesRecommended = 0;
                proteinsRecommended = 0;
                carbsRecommended = 0;
                fatsRecommended = 0;
                data = data[0].toObject();
                // console.log(data.dailyNutritionGoals);

                caloriesRecommended = data.dailyNutritionGoals.calories;
                // console.log(caloriesRecommended);
                proteinsRecommended = data.dailyNutritionGoals.proteins.number;
                carbsRecommended = data.dailyNutritionGoals.carbs.number;
                fatsRecommended = data.dailyNutritionGoals.fats.number;
                // console.log(caloriesRecommended);


            } catch (e) {
                console.log(e);
            }
        }
        Meal.find({
            "mealByUser.date": {
                $gte: from_date2,
                $lte: to_date2
            },
            "mealByUser.userId": user_id
        },
            {
                "mealByUser.date": 1,
                "mealByUser.nutritionFacts": 1,
                "_id": 0
            },
            {
                sort: 'mealByUser.date'
            },
            (err, meals) => {

                var caloriesByDate = [];
                var date;
                var mediumCalories = 0;
                var mediumProteins = 0;
                var mediumCarbs = 0;
                var mediumFats = 0;
                if (meals) {
                    mealsLength = 0;
                    // console.log(mealsLength);


                    try {
                        meals.forEach(meal => {
                            meal = meal.toObject();
                            
                            calories = meal.mealByUser.nutritionFacts.totalCalories;
                            proteins = meal.mealByUser.nutritionFacts.totalProteins;
                            carbs = meal.mealByUser.nutritionFacts.totalCarbs;
                            fats = meal.mealByUser.nutritionFacts.totalFats;

                            date = moment(meal.mealByUser.date).locale("ro").format('l');
                            var foundIndex = caloriesByDate.findIndex(x => x.date.localeCompare(date) == 0);
                            if (foundIndex > -1) {
                                caloriesByDate[foundIndex]["total-calories"] += calories;
                                caloriesByDate[foundIndex]["total-proteins"] += proteins;
                                caloriesByDate[foundIndex]["total-carbs"] += carbs;
                                caloriesByDate[foundIndex]["total-fats"] += fats;
                            }
                            else {
                                caloriesByDate.push(
                                    {
                                        "date": date,
                                        "total-calories": calories,
                                        "total-proteins": proteins,
                                        "total-carbs": carbs,
                                        "total-fats": fats
                                    }
                                );
                                // mediumCalories += (calories / mealsLength);
                                // mediumProteins += (proteins / mealsLength);
                                // mediumCarbs += (carbs / mealsLength);
                                // mediumFats += (fats / mealsLength);
                                mealsLength++;
                            }
                            
                        });
                        caloriesByDate.forEach(cal => {
                            // cal = cal.toObject();
                            // console.log(mealsLength);
                            mediumCalories += (cal["total-calories"] / mealsLength);
                            mediumProteins += (cal["total-proteins"] / mealsLength);
                            mediumCarbs += (cal["total-carbs"] / mealsLength);
                            mediumFats += (cal["total-fats"] / mealsLength);
                            
                        })
                        console.log(mediumCalories);
                        var percentageCalories = (100 * mediumCalories) / caloriesRecommended;
                        // console.log(caloriesRecommended + " " + mediumCalories);
                        var percentageProteins = (100 * mediumProteins) / proteinsRecommended;
                        var percentageCarbs = (100 * mediumCarbs) / carbsRecommended;
                        var percentageFats = (100 * mediumFats) / fatsRecommended;
                        // console.log(percentageCalories);
                        var graphDates = {};
                        graphDates.caloriesByDate = caloriesByDate;
                        graphDates.percentageCalories = percentageCalories;
                        graphDates.percentageProteins = percentageProteins;
                        graphDates.percentageCarbs = percentageCarbs;
                        graphDates.percentageFats = percentageFats;
                        // console.log(graphDates.caloriesByDate);

                        res.send(graphDates);
                    } catch (e) {
                        console.log(e);
                        console.log("no dates for range selection");
                    }
                }
            });
    });
});
module.exports = router;