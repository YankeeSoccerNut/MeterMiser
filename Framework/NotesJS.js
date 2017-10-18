// 1. Give the user the ability to send a stock symbol.
// 2. Get the symbol
// 3. make an AJAX request to Yahoo
// 4. Get the response from Yahoo and update teh DOM

$(document).ready(()=>{

	// setItem takes 2 args:
	// 1. Name of the var
	// // 2. Value to set
	// var watchList = [
	// 	"goog",
	// 	"msft",
	// 	"tsla",
	// 	"tata",
	// 	"race"
	// ];
	// ENTER... JSON.stringify
	// var watchListAsString = JSON.stringify(watchList);

	// console.log(typeof(watchList));
	// console.log(typeof(watchListAsString));

	// console.log(watchList)
	// console.log(watchListAsString)

	// // ENTER... JSON.parse
	// var watchListAsAnObjectAgain = JSON.parse(watchListAsString);
	// console.log(watchListAsAnObjectAgain);


	// localStorage.setItem('watchList',"race");
	// var watchList = localStorage.getItem('watchList');
	// console.log(localStorage.watchList);


	// var now = new Date();

	// Get the watchlist
	var watchList = localStorage.getItem('watchList');
	// If it's null, they dont ahve any saved.
	if(watchList !== null){
		// if it's not, update the DOM
		updateWatchList();
	}


	var firstView = true;
	$('.yahoo-finance-form').submit((event)=>{
		// Stop the browser from sending the page on... we will handle it.
		event.preventDefault()
		// console.log("User submitted the form!")
		var stockSymbol = $('#ticker').val();
		// console.log(stockSymbol);
		var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22'+stockSymbol+'%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
		// getJSON takes:
		// 1. Where
		// 2. What to do (function)
		$.getJSON(url,(theDataJSFound)=>{
			console.log(theDataJSFound);
			var numFound = theDataJSFound.query.count;
			var newRow = "";
			if(numFound > 1){
				// we have multiples! We need a loop
				theDataJSFound.query.results.quote.map((stock)=>{
					newRow += buildRow(stock);
				})

			}else{
				var stockInfo = theDataJSFound.query.results.quote;
				newRow = buildRow(stockInfo);
			}
			if(firstView){
				$('#stock-table-body').html(newRow);
				firstView = false;
			}else{
				$('#stock-table-body').append(newRow);
			}

			// Rocket function vs. function():
			// - rocket function does NOT create a new "this"
			// - function() "usually" creates a new "this"
			$('.save-button').click(function(){
				// console.log("User clicked on a button!")
				// console.log($(this).attr('symbol'));
				// add a click listener to all the buttons in the tables.
				// when clicked on, save the symbol to localStorage.
				var stockToSave = $(this).attr('symbol');
				var oldWatchlist = localStorage.getItem('watchList');
				// oldWatchlist just came out of localStorage. Like Christmas lights come otu of storage.
				// How? TANGLED. We need to untangle them. JSON.parse
				var oldAsJSON = JSON.parse(oldWatchlist);
				// if the user has never saved anything, there will be nothing
				// 	to parse. This will reutnr null in JSON.parse
				if(oldAsJSON === null){
					oldAsJSON = [];
				}
				// JSON.parse has just untangled our lights. We have an object/array

				// Before we push it on to the array, Check to see if its in the array...
				// indexOf to the rescue.
				if(oldAsJSON.indexOf(stockToSave) > -1){
					// the stock is already in the list.
					// We don't know where, but it's there because it didn't
					// return -1
					console.log("Stock already saved.")
				}else{
					oldAsJSON.push(stockToSave);
					console.log(oldAsJSON);
					var newWatchListAsString = JSON.stringify(oldAsJSON);
					localStorage.setItem('watchList',newWatchListAsString);
					updateWatchList()
				}
			})
		});
	})

	function buildRow(stockInfo){
		if(stockInfo.Change !== null){
			if(stockInfo.Change.indexOf('+') > -1){
				// That means the stock is up!
				var classChange = "success";
			}else{
				// Stock is down :(
				var classChange = "danger";
			}
		}else{
			stockInfo.Change = "Market Closed."
		}

		var newRow = '';
		newRow += '<tr>';
			newRow += `<td>${stockInfo.Symbol}</td>`;
			newRow += `<td>${stockInfo.Name}</td>`;
			newRow += `<td>${stockInfo.Ask}</td>`;
			newRow += `<td>${stockInfo.Bid}</td>`;
			newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
			newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-success save-button">Save</button></td>`;
			newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-danger delete-button">Delete</button></td>`;
		newRow += '</tr>';
		return newRow;
	}

	function updateWatchList(){
		$('#stock-table-saved-body').html('')
		// get the watchlist
		var watchList = localStorage.getItem('watchList');
		// Problem. The CHristmas Ligths are tangled.
		var watchListAsJSON = JSON.parse(watchList);
		watchListAsJSON.map((symbol,index)=>{
			// console.log(symbol);
			var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22'+symbol+'%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
			$.getJSON(url, (stockData)=>{
				var stockInfo = stockData.query.results.quote;
				var newRow = buildRow(stockInfo);
				$('#stock-table-saved-body').append(newRow);
			})
		});
	}

});
var email = $('#email').val();//pick value off html form

localStorage.setItem('KEYemail',email);//store the value
//to read the value from local storage
var email = localStorage.getItem('KEYemail');//
