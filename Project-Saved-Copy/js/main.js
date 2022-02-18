
console.log("Hello world");

d3.csv('data/ohio.csv')
	.then(data => {
		console.log('Data loading complete. Work with dataset.');
		let state_county = document.getElementById("state_list").value;
		console.log(state_county)
		let minYear = d3.min(data, d => d.Year),
			maxYear = d3.max(data, d => d.Year),
			combinedData = [];

		for (let i = minYear; i <= maxYear; i++) {
			let justThisYear = data.filter(d => d.Year == i); //only include the selected year
			let medianAQI = d3.sum(justThisYear, d => d.MedianAQI); //sum over the filtered array, for the cost field
			let percentile90AQI = d3.sum(justThisYear, d => d.Percentile90AQI); //sum over the filtered array, for the cost field
			let maxAQI = d3.sum(justThisYear, d => d.MaxAQI); //sum over the filtered array, for the cost field
			combinedData.push({ "year": i, "value": medianAQI, "type": "median" });
			combinedData.push({ "year": i, "value": percentile90AQI, "type": "percent" });
			combinedData.push({ "year": i, "value": maxAQI, "type": "max" });
		}

		let vis1 = new Line({
			'parentElement': '#vis1',
			'containerHeight': 300,
			'containerWidth': 600, 
			'yLabel': 'Missing Days'
		}, combinedData);

		let AQIData = []
		for (let i = minYear; i <= maxYear; i++) {
			let justThisYear = data.filter(d => d.Year == i);
			let AQIVal = d3.sum(justThisYear, d => d.DayswithAQI);
			if (AQIVal >= 365) {
				AQIData.push({ "year": i, "value": 0, "type": "median" });
			} else {
				AQIData.push({ "year": i, "value": 365 - AQIVal, "type": "median" });
			}
		}

		let vis2 = new Line({
			'parentElement': '#vis2',
			'containerHeight': 300,
			'containerWidth': 600, 
			'yLabel': 'Missing Days 2'

		}, AQIData);

		let data2021 = data.filter(d => d.Year == 2019)
		data2021 = data2021[0]


		// code works but need for later
		let DaysData = [];



		DaysData.push({ 'key': 'good', 'value': data2021.GoodDays })
		DaysData.push({ 'key': 'hazard', 'value': data2021.HazardousDays })
		DaysData.push({ 'key': 'unhealthy', 'value': data2021.UnhealthyDays })
		DaysData.push({ 'key': 'moderete', 'value': data2021.ModerateDays })
		DaysData.push({ 'key': 'unhealthyfor', 'value': data2021.UnhealthyforSensitiveGroupsDays })
		DaysData.push({ 'key': 'very', 'value': data2021.VeryUnhealthyDays })

		// let haz = new PieChart({

		// 	'parentElement': '#vis5',
		// 	'containerHeight': 400,
		// 	'containerWidth': 650
		// }, DaysData);



		// let PollutantData = [];
		// data.filter(d=>d.State=='Ohio').forEach(d => {
		//   if (d.County == 'Hamilton') {
		// 	PollutantData.push({ "year": d.Year, "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
		//   }
		// }
		// )

		// let stacks = new StackChart({
		//   'parentElement': '#vis4',
		//   'containerHeight': 400,
		//   'containerWidth': 650
		// }, PollutantData);


		let vis6 = new Line({
			'parentElement': '#vis6',
			'containerHeight': 300,
			'containerWidth': 600, 
			'yLabel': 'Missing Days 3'

		}, combinedData);
		// let topojson = require("topojson-client@3")
		// let d3 = require("d3-geo@2")

		// import * as topojson from "topojson-client";
		Promise.all([
			d3.json('data/counties-10m.json'),
			d3.csv('data/fips.csv'),
			d3.csv('data/ohio.csv')
		  ]).then(data => {
			const geoData = data[0];
			const countyFips = data[1];
			const ohioData = data[2];
			// Combine both datasets by adding the population density to the TopoJSON file
			geoData.objects.counties.geometries.forEach(d => {
				for (let i = 0; i < countyFips.length; i++) {
				  if (d.id == countyFips[i].cnty_fips) {
					// console.log(d);
					//console.log(countyFips[i]);
					let countyInfo = ohioData.filter(d => d.Year == 2015).filter(d => d.State == countyFips[i].state).filter(d => d.County == countyFips[i].county)
					//  console.log(countyInfo);
					if (countyInfo.length != 0) {
					  d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': countyInfo[0].MaxAQI };
					  d.properties.value = +d.properties.value;
					} else {
					  d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': 0 };
					  d.properties.value = +d.properties.value;
					}
					// console.log(d.properties);
				  }
				}
			  });

			const choroplethMap = new ChoroplethMap({ 
			  parentElement: '.viz',   
			}, geoData);
		  })
		  .catch(error => console.error(error));
	
	})
	.catch(error => {
		console.error(error);
	});


function vis3(names) {
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)
	d3.csv('data/ohio.csv')
		.then(data => {

			let data2021 = data.filter(d => d.Year == 2019)
			data2021 = data2021[0]
			let DaysData = [];
			DaysData.push({ 'key': 'good', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'hazard', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'unhealthy', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'moderete', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'unhealthyfor', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'very', 'value': data2021.VeryUnhealthyDays })

			let pollutant_data = new PieChart({

				'parentElement': '#vis5',
				'containerHeight': 400,
				'containerWidth': 650
			}, DaysData);

			// svg.selectAll("*").remove()

		})
		.catch(error => {
			console.error(error);
		});
}
function jsFunction2(names) {


	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			data = data.filter(d => d.County == county)
			var svg = d3.select("svg");
			// svg.selectAll("*").remove();
			let state_county = document.getElementById("state_list").value;
			console.log(state_county)
			let minYear = d3.min(data, d => d.Year),
				maxYear = d3.max(data, d => d.Year),
				combinedData = [];

			let AQIData = []
			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i);
				let AQIVal = d3.sum(justThisYear, d => d.DayswithAQI);
				if (AQIVal >= 365) {
					AQIData.push({ "year": i, "value": 0, "type": "median" });
				} else {
					AQIData.push({ "year": i, "value": 365 - AQIVal, "type": "median" });
				}
			}

			let vis2 = new Line({
				'parentElement': '#vis2',
				'containerHeight': 300,
				'containerWidth': 600
			}, AQIData);



			// svg.selectAll("*").remove()

		})
		.catch(error => {
			console.error(error);
		});


}

function jsFunctions(names) {
	vis1(names)
	jsFunction2(names)
	vis3(names)
}

// var tooltipSpan = document.getElementById('tooltip-span');

// window.onmousemove = function (e) {
//     var x = e.clientX,
//         y = e.clientY;
//     tooltipSpan.style.top = (y + 20) + 'px';
//     tooltipSpan.style.left = (x + 20) + 'px';
// };


function vis1(names) {
	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			console.log('Trial DS');
			data = data.filter(d => d.County == county)
			var svg = d3.select("svg#vis1");
			var svg2 = d3.select("svg#vis2");
			var svg3 = d3.select("svg#vis5")
			var svg4 = d3.select("svg#vis4")
			svg.selectAll("*").remove();
			svg2.selectAll("*").remove();
			svg3.selectAll("*").remove();
			svg4.selectAll("*").remove();


			let state_county = document.getElementById("state_list").value;
			console.log(state_county)
			let minYear = parseInt(d3.min(data, d => d.Year)),
				maxYear = parseInt(d3.max(data, d => d.Year)),
				combinedData = [];

			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i); //only include the selected year
				let medianAQI = d3.sum(justThisYear, d => d.MedianAQI); //sum over the filtered array, for the cost field
				let percentile90AQI = d3.sum(justThisYear, d => d.Percentile90AQI); //sum over the filtered array, for the cost field
				let maxAQI = d3.sum(justThisYear, d => d.MaxAQI); //sum over the filtered array, for the cost field
				combinedData.push({ "year": i, "value": medianAQI, "type": "median" });
				combinedData.push({ "year": i, "value": percentile90AQI, "type": "percent" });
				combinedData.push({ "year": i, "value": maxAQI, "type": "max" });
			}

			let data2021 = data.filter(d => d.Year == 2019)
			data2021 = data2021[0]
			let DaysData = [];
			let pollutionData = []
			DaysData.push({ 'key': 'GoodDays', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'HazardousDays', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'UnhealthyDays', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'ModerateDays', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'UnhealthyforSensitiveGroupsDays', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'VeryUnhealthyDays', 'value': data2021.VeryUnhealthyDays })


			let dat = new PieChart({

				'parentElement': '#vis5',
				'containerHeight': 400,
				'containerWidth': 650,
				'keylist': ['GoodDays', 'HazardousDays', 'UnhealthyDays', 'ModerateDays', 'UnhealthyforSensitiveGroupsDays', 'VeryUnhealthyDays']
			}, DaysData);


			// let dat2 = new PieChart({

			// 	'parentElement': '#vis10',
			// 	'containerHeight': 400,
			// 	'containerWidth': 650
			// }, pollutionData);


			let vis1 = new Line({
				'parentElement': '#vis1',
				'containerHeight': 300,
				'containerWidth': 600
			}, combinedData);
			let Pdata = []
			for (let i = minYear; i <= maxYear; i += 2) {
				let justThisYear = data.filter(d => d.Year == i);
				let d = justThisYear[0]
				// console.log(i)
				let maxVal = Math.max(d.DaysCO, d.DaysNO2, d.DaysNO2, d.DaysOzone, d.DaysSO2, d.DaysPM10, d.DaysPM25)
				Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })


			}

			let stacks = new StackChart({
				'parentElement': '#vis4',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);

			// let PollutantData = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	PollutantData.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			// let stacks = new StackChart({
			//   'parentElement': '#vis4',
			//   'containerHeight': 400,
			//   'containerWidth': 650
			// }, PollutantData);


		})
		.catch(error => {
			console.error(error);
		});
}

function jsFunctions2(names) {
	console.log(names)
	let nameArr = names.split(',');
	let state = nameArr[0]
	let county = nameArr[1]
	console.log(state)
	console.log(county)

	d3.csv('data/ohio.csv')
		.then(data => {

			console.log('Trial DS');
			data = data.filter(d => d.County == county)
			data = data.filter(d => d.State == state)
			var svg = d3.select("svg#vis6");
			var svg2 = d3.select("svg#vis7");
			var svg9 = d3.select("svg#vis9")
			// var svg3 = d3.select("svg#vis5")
			// var svg4 = d3.select("svg#vis4")
			svg.selectAll("*").remove();
			svg2.selectAll("*").remove();
			svg9.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			// svg4.selectAll("*").remove();


			let state_county = document.getElementById("state_list_2").value;
			console.log(state_county)
			let minYear = parseInt(d3.min(data, d => d.Year)),
				maxYear = parseInt(d3.max(data, d => d.Year)),
				combinedData = [];

			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i); //only include the selected year
				let medianAQI = d3.sum(justThisYear, d => d.MedianAQI); //sum over the filtered array, for the cost field
				let percentile90AQI = d3.sum(justThisYear, d => d.Percentile90AQI); //sum over the filtered array, for the cost field
				let maxAQI = d3.sum(justThisYear, d => d.MaxAQI); //sum over the filtered array, for the cost field
				combinedData.push({ "year": i, "value": medianAQI, "type": "median" });
				combinedData.push({ "year": i, "value": percentile90AQI, "type": "percent" });
				combinedData.push({ "year": i, "value": maxAQI, "type": "max" });
			}

			let data2021 = data.filter(d => d.Year == 2019)
			data2021 = data2021[0]
			let DaysData = [];
			DaysData.push({ 'key': 'good', 'value': data2021.GoodDays })
			DaysData.push({ 'key': 'hazard', 'value': data2021.HazardousDays })
			DaysData.push({ 'key': 'unhealthy', 'value': data2021.UnhealthyDays })
			DaysData.push({ 'key': 'moderete', 'value': data2021.ModerateDays })
			DaysData.push({ 'key': 'unhealthyfor', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			DaysData.push({ 'key': 'very', 'value': data2021.VeryUnhealthyDays })

			// let dat = new PieChart({

			// 	'parentElement': '#vis5',
			// 	'containerHeight': 400,
			// 	'containerWidth': 650
			// }, DaysData);

			let vis1 = new Line({
				'parentElement': '#vis6',
				'containerHeight': 300,
				'containerWidth': 600,
				'yLabel': 'No. of days '
			}, combinedData);


			let AQIData = []
			for (let i = minYear; i <= maxYear; i++) {
				let justThisYear = data.filter(d => d.Year == i);
				let AQIVal = d3.sum(justThisYear, d => d.DayswithAQI);
				if (AQIVal >= 365) {
					AQIData.push({ "year": i, "value": 0, "type": "median" });
				} else {
					AQIData.push({ "year": i, "value": 365 - AQIVal, "type": "median" });
				}
			}

			let vis2 = new Line({
				'parentElement': '#vis7',
				'containerHeight': 300,
				'containerWidth': 600, 
				'yLabel': 'Missing Days'
			}, AQIData);
			// code works but need for later
			let pieD = [];



			pieD.push({ 'key': 'good', 'value': data2021.GoodDays })
			pieD.push({ 'key': 'hazard', 'value': data2021.HazardousDays })
			pieD.push({ 'key': 'unhealthy', 'value': data2021.UnhealthyDays })
			pieD.push({ 'key': 'moderete', 'value': data2021.ModerateDays })
			pieD.push({ 'key': 'unhealthyfor', 'value': data2021.UnhealthyforSensitiveGroupsDays })
			pieD.push({ 'key': 'very', 'value': data2021.VeryUnhealthyDays })



			let Pdata = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			for (let i = minYear; i <= maxYear; i += 2) {
				let justThisYear = data.filter(d => d.Year == i);
				let d = justThisYear[0]
				// console.log(i)
				let maxKey = "";
				let maxIndex = (argMax([d.DaysCO, d.DaysNO2, d.DaysOzone, d.DaysSO2, d.DaysPM25, d.DaysPM10]));
				switch (maxIndex) {
					case 0:
						maxKey = 'CO';
						break;
					case 1:
						maxKey = "NO2";
						break;
					case 2:
						maxKey = "Ozone";
						break;
					case 3:
						maxKey = "SO2";
						break;
					case 4:
						maxKey = "PM25";
						break;
					case 5:
						maxKey = "PM10";
						break;
					default:
						maxKey = "ND"
						break;
				}
				Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10, "maxIndex": maxKey })

			}

			let stacks = new StackChart({
				'parentElement': '#vis9',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);





		})
		.catch(error => {
			console.error(error);
		});
}

function yearCharts(year) {
	let year_data = parseInt(year)

	d3.csv('data/ohio.csv')
		.then(data => {
			let data_1 = data;
			let state_county = document.getElementById("state_list_2").value;
			let state_county_1 = document.getElementById("state_list_2").value;

			// console.log('Trial DS');
			let s_c = state_county.split(',');
			let s_c_1 = state_county.split(',');

			data = data.filter(d => d.County == s_c[1])
			data = data.filter(d => d.State == s_c[0])


			data_1 = data_1.filter(d => d.County == s_c_1[1])
			data_1 = data_1.filter(d => d.State == s_c_1[0])

			var svg = d3.select("svg#vis6");
			var svg2 = d3.select("svg#vis7");
			var svg9 = d3.select("svg#vis9")
			// var svg3 = d3.select("svg#vis5")
			var svg4 = d3.select("svg#vis4")
			// svg.selectAll("*").remove();
			// svg2.selectAll("*").remove();
			svg9.selectAll("*").remove();
			// svg3.selectAll("*").remove();
			svg4.selectAll("*").remove();



			let Pdata = [];
			// data.filter(d=>d.State==state).forEach(d => {
			//   if (d.County == county) {
			// 	Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })
			//   }
			// }
			// )

			let justThisYear = data.filter(d => d.Year == year_data);
			let d = justThisYear[0]
			// console.log(i)
			Pdata.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })


			let stacks = new StackChart({
				'parentElement': '#vis9',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata);


			let Pdata2 = [];
			justThisYear = data_1.filter(d => d.Year == year);
			d = justThisYear[0]
			// console.log(i)
			Pdata2.push({ "year": parseInt(d.Year), "co": d.DaysCO, "no2": d.DaysNO2, "ozone": d.DaysOzone, "so2": d.DaysSO2, "pm25": d.DaysPM25, "pm10": d.DaysPM10 })

			let newstacks = new StackChart({
				'parentElement': '#vis4',
				'containerHeight': 400,
				'containerWidth': 650
			}, Pdata2);

		})
		.catch(error => {
			console.error(error);
		});

}

function metricDD(val) {

	Promise.all([
		d3.json('data/counties-10m.json'),
		d3.csv('data/fips.csv'),
		d3.csv('data/ohio.csv')
	  ]).then(data => {
		const geoData = data[0];
		const countyFips = data[1];
		const ohioData = data[2];
		// Combine both datasets by adding the population density to the TopoJSON file
		geoData.objects.counties.geometries.forEach(d => {
			for (let i = 0; i < countyFips.length; i++) {
			  if (d.id == countyFips[i].cnty_fips) {
				// console.log(d);
				//console.log(countyFips[i]);
				let countyInfo = ohioData.filter(d => d.Year == 2015).filter(d => d.State == countyFips[i].state).filter(d => d.County == countyFips[i].county)
				//  console.log(countyInfo);
				let final_value = 0
				var svg_map = d3.select("svg#map")

				switch (val) {
					case 'MaxAQI':
					  final_value = countyInfo[0].MaxAQI;
					  break;
					case 'Percentile90AQI':
					  final_value = countyInfo[0].Percentile90AQI;
					  break;
					case 'MedianAQI':
					   final_value = countyInfo[0].MedianAQI;
					  break;
					case 'DaysCO':
					  final_value = countyInfo[0].DaysCO;
					  break;
					case 'DaysNO2':
					  final_value = countyInfo[0].DaysNO2;
					  break;
					case 'DaysSO2':
					  final_value = countyInfo[0].DaysSO2;
					  break;
					case 'DaysPM25':
					  final_value = countyInfo[0].DaysPM25;
					case 'DaysPM10':
					  final_value = countyInfo[0].DaysPM10;
					default:
						final_value = 0
				  }
				
				if (countyInfo.length != 0) {
				  d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': final_value, 'type':val };
				  d.properties.value = +d.properties.value;
				} else {
				  d.properties = { 'county': countyFips[i].county, 'state': countyFips[i].state, 'value': 0, 'type':val };
				  d.properties.value = +d.properties.value;
				}
				// console.log(d.properties);
			  }
			}
		  });

		const choroplethMap = new ChoroplethMap({ 
		  parentElement: '.viz',   
		}, geoData);
	  })
	  .catch(error => console.error(error));
}

function argMax(array) {
	return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}