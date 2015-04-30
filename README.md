#morbid_map2
**Reformulated from original Morbid Map 1 to clean out a lot of unnecessary files.**

Used:
* Mongo,
* Express,
* Angular
* and Node (all for the first time).

Collected data from CDC Wonder GUI API.

The API was just released and documentation is scarce so the data slightly reflects that.

To Run the project on localhost
===

* Note: Right now the Mongo database is local, remote access soon.

* Run ```~$ npm install``` to install required packages.

* Start Mongo on port 27017, run ```~$ mongod```

* In another terminal window, run ```~$ nodemon server.js```

* Point your browser to localhost:8080

Data
---

* Data collected from a gui api from the cdc from 1999-2013

* Data collected is already grouped by 10 year age-groups, gender and state.

* The colors on the map are in proportion to the number of people in that unique population.

* Darker the color, the higher proportion of deaths for that state.

Future Work
---

* Filter data into more queryable fields so you could select "All" under gender or Age Group selectors

* Create or find a map of common disease words to actual disease names
  * Example 1: Search for 'cancer' will show neoplasms and melanoma.
  * Example 2:Search for 'smoking' or 'smoke' with show various types of cancers.
