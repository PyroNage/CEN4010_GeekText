const express = require('express');
const app = express();
let books = [       //Making a sample array
  {
    b_name: "Harry Potter",
    b_rating: 3,
    b_genre: "fantasy",
    copies_Sold: 17
  },
  {
    b_name: "Mars Colony",
    b_rating: 29,
    b_genre: "science-fiction",
    copies_Sold: 10
  },
  {
    b_name: "Mars Colony23123",
    b_rating: 3,
    b_genre: "documentary",
    copies_Sold: 10
  },
  {
    b_name: "Guns Germs and Steel",
    b_rating: 19,
    b_genre: "science-fiction",
    copies_Sold: 2
  }]

function compareGenre(a, b) {  //Sorting all the books together depending on genre
  const bookA = a.b_genre.toUpperCase();
  const bookB = b.b_genre.toUpperCase();

  let comparison = 0;
  if (bookA > bookB) {
    comparison = 1;
  } else if (bookA < bookB) {
    comparison = -1;
  }
  return comparison;
}


function compareRatingDescending(a, b) {    //Sorting books by rating descending
  const bookA = a.b_rating;
  const bookB = b.b_rating;

  return bookB - bookA;
}

function compareRatingAscending(a, b) {     //Sorting books by rating ascending (not part of required feature)
  const bookA = a.b_rating;
  const bookB = b.b_rating;

  return bookA - bookB;
}

function compareSales(a, b) {             //Sorting books descending by copies sold
  const bookA = a.copies_Sold;
  const bookB = b.copies_Sold;

  return bookB - bookA;
}

function genreOnly(a) {                  //Returns only books with a givenGenre
  if (a.b_genre == givenGenre) {
    return a;
  }
}


// books.sort(compareGenre);               //Calls function to sort by genre
// books.sort(compareRatingAscending);     //Calls function to sort by rating Ascending
// books.sort(compareSales);               //Calls function to sort by copies_Sold


var givenGenre = 'science-fiction';        //givenGenre should be based on user input
// var givenSize = 1;                      //givenSize should be based on user input
// var items = books.slice(0, givenSize)   //Creates a new array with only values from 0 to givenSize

var test = books.map(genreOnly);           //Creates a new array with only books of givenGenre

console.log(test);






