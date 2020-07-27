const express = require('express');
const app = express();
var books = require('./models/bookModel');

// let books = [       //Making a sample array
//   {
//     bookName: "Harry Potter",
//     bookRating: 3,
//     bookGenre: "fantasy",
//     bookSales: 17
//   },
//   {
//     bookName: "Mars Colony",
//     bookRating: 29,
//     bookGenre: "science-fiction",
//     bookSales: 10
//   },
//   {
//     bookName: "Mars Colony23123",
//     bookRating: 3,
//     bookGenre: "documentary",
//     bookSales: 10
//   },
//   {
//   bookName: "Black Rain Cloud",
//     bookRating: 3,
//     bookGenre: "documentary",
//     bookSales: 17
//   },
//   {
//     bookName: "Random Facts",
//     bookRating: 9,
//     bookGenre: "fantasy",
//     bookSales: 13
//   },
//   {
//     bookName: "Icarus",
//     bookRating: 5,
//     bookGenre: "documentary",
//     bookSales: 10
//   },
//   {
//     bookName: "Steel in Space",
//     bookRating: 1,
//     bookGenre: "science-fiction",
//     bookSales: 20
//   }]

function compareGenre(a, b) {  //Sorting all the books together depending on genre
  const bookA = a.bookGenre.toUpperCase();
  const bookB = b.bookGenre.toUpperCase();

  let comparison = 0;
  if (bookA > bookB) {
    comparison = 1;
  } else if (bookA < bookB) {
    comparison = -1;
  }
  return comparison;
}

function compareRatingDescending(a, b) {    //Sorting books by rating descending
  const bookA = a.bookRating;
  const bookB = b.bookRating;

  return bookB - bookA;
}

function compareRatingAscending(a, b) {     //Sorting books by rating ascending (not part of required feature)
  const bookA = a.bookRating;
  const bookB = b.bookRating;

  return bookA - bookB;
}

function compareSales(a, b) {             //Sorting books descending by copies sold
  const bookA = a.bookSales;
  const bookB = b.bookSales;

  return bookB - bookA;
}

function genreOnly(a) {                  //Returns only books with a givenGenre
  if (a.bookGenre == givenGenre) {
    return a;
  }
}

books.sort(compareGenre);               //Calls function to sort by genre
// books.sort(compareRatingAscending);     //Calls function to sort by rating Ascending
// books.sort(compareSales);               //Calls function to sort by bookSales


// var givenGenre = 'science-fiction';        //givenGenre should be based on user input
// var givenSize = 1;                      //givenSize should be based on user input
// var items = books.slice(0, givenSize)   //Creates a new array with only values from 0 to givenSize

// var test = books.map(genreOnly);           //Creates a new array with only books of givenGenre

console.log(test);
  





