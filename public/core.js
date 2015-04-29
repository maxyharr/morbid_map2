// public/core.js
var morbidMap = angular.module('morbidMap', []);

function mainController($scope, $http) {
    $scope.loc = 'usa'

    $scope.states = [{ name: 'alabama', abbreviation: 'AL'},
    { name: 'alaska', abbreviation: 'AK'},
    { name: 'arizona', abbreviation: 'AZ'},
    { name: 'arkansas', abbreviation: 'AR'},
    { name: 'california', abbreviation: 'CA'},
    { name: 'colorado', abbreviation: 'CO'},
    { name: 'connecticut', abbreviation: 'CT'},
    { name: 'delaware', abbreviation: 'DE'},
    { name: 'florida', abbreviation: 'FL'},
    { name: 'georgia', abbreviation: 'GA'},
    { name: 'hawaii', abbreviation: 'HI'},
    { name: 'idaho', abbreviation: 'ID'},
    { name: 'illinois', abbreviation: 'IL'},
    { name: 'indiana', abbreviation: 'IN'},
    { name: 'iowa', abbreviation: 'IA'},
    { name: 'kansas', abbreviation: 'KS'},
    { name: 'kentucky', abbreviation: 'KY'},
    { name: 'louisiana', abbreviation: 'LA'},
    { name: 'maine', abbreviation: 'ME'},
    { name: 'maryland', abbreviation: 'MD'},
    { name: 'massachusetts', abbreviation: 'MA'},
    { name: 'michigan', abbreviation: 'MI'},
    { name: 'minnesota', abbreviation: 'MN'},
    { name: 'mississippi', abbreviation: 'MS'},
    { name: 'missouri', abbreviation: 'MO'},
    { name: 'montana', abbreviation: 'MT'},
    { name: 'nebraska', abbreviation: 'NE'},
    { name: 'nevada', abbreviation: 'NV'},
    { name: 'new hampshire', abbreviation: 'NH'},
    { name: 'new jersey', abbreviation: 'NJ'},
    { name: 'new mexico', abbreviation: 'NM'},
    { name: 'new york', abbreviation: 'NY'},
    { name: 'north carolina', abbreviation: 'NC'},
    { name: 'north dakota', abbreviation: 'ND'},
    { name: 'ohio', abbreviation: 'OH'},
    { name: 'oklahoma', abbreviation: 'OK'},
    { name: 'oregon', abbreviation: 'OR'},
    { name: 'pennsylvania', abbreviation: 'PA'},
    { name: 'rhode island', abbreviation: 'RI'},
    { name: 'south carolina', abbreviation: 'SC'},
    { name: 'south dakota', abbreviation: 'SD'},
    { name: 'tennessee', abbreviation: 'TN'},
    { name: 'texas', abbreviation: 'TX'},
    { name: 'utah', abbreviation: 'UT'},
    { name: 'vermont', abbreviation: 'VT'},
    { name: 'virginia', abbreviation: 'VA'},
    { name: 'washington', abbreviation: 'WA'},
    { name: 'west virginia', abbreviation: 'WV'},
    { name: 'wisconsin', abbreviation: 'WI'},
    { name: 'wyoming', abbreviation: 'WY' }]



    $scope.causes_of_death = {}
    $scope.maincause = "The leading cause of death in each state (1999-2013)"

    // when landing on the page, get all todos and show them
    for (var i in $scope.states) {
        var state = $scope.states[i].name

        $http.get('/causes_of_death/' + state) // may also want to create a custom query using params - see iphone
            .success(function(data) {
                $scope.causes_of_death[data.state] = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.refresh = function() {
        $scope.causes_of_death = {}
        var searchElement = document.getElementById('search')
        var genderElement = document.getElementById('gender')  
        var agegroupElement = document.getElementById('agegroup')
        
        var search = searchElement.value
        var gender = genderElement.options[genderElement.selectedIndex].value 
        var age_group = agegroupElement.options[agegroupElement.selectedIndex].value

        if (search !== '') {$scope.maincause = "Showing diseases with highest death tolls containing the word(s) " + "'" + search + "'"}


        for (var i in $scope.states) {
            var state = $scope.states[i].name
            console.log(search)
            $http.get('/search/' + search + '/' + gender + '/' + state + '/' + age_group)
                .success(function(data) {
                    if (data) {
                        $scope.causes_of_death[data.state] = data;
                    }
                })
                .error(function(data){  
                    console.log("Error: " + data);
                });
        }  
    }
}