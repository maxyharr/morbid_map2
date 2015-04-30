// public/core.js
var morbidMap = angular.module('morbidMap', []);

function mainController($scope, $http) {

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
    $scope.max_death_proportion = 0;
    $scope.max_state_deaths = 0;
    $scope.maincause = "The leading cause of death in each state (1999-2013)"

    $scope.map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        fills: {
            VERY_HIGH: '#9b211e',
            HIGH: '#be413e',
            MEDIUM: '#e36b68',
            LOW: '#ff9f9c',
            VERY_LOW: '#ffc6c4',
            UNKNOWN: '#eeeeee',
            defaultFill: '#eeeeee'
        },
        data: {
                    
        },
        geographyConfig: {
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                'State: ' + geo.properties.name + '<br>',
                'Gender: ' + data.gender + '<br>',
                'Age Group: ' + data.age_group + '<br>',
                'Deaths: ' + data.deaths + '<br>',
                'Population: ' + data.population + '<br>',
                'Cause of Death: ' + data.cause_of_death + '<br>',
                'Crude Rate: ' + data.crude_rate,
                '</strong></div>'].join('');
            }
        }
    });
    $scope.map.labels()


    for (var i in $scope.states) {
        var state = $scope.states[i].name
        $http.get('/causes_of_death/' + state) // may also want to create a custom query using params - see iphone
            .success(function(data) {
                if (data) { 
                    data['fillKey'] = 'UNKNOWN';
                    $scope.causes_of_death[data.abbreviation.toUpperCase()] = data;
                    if (data.crude_rate > $scope.max_death_proportion) {
                        $scope.max_death_proportion = data.crude_rate;
                        $scope.max_state_proportion = data.state;
                    }
                    if (data.deaths > $scope.max_state_deaths) {
                        $scope.max_state_deaths = data.deaths;
                        $scope.max_state_deaths_name = data.state;
                    }
                    if (data.crude_rate > $scope.max_death_proportion*4/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'VERY_HIGH'; } 
                    else if (data.crude_rate > $scope.max_death_proportion*3/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'HIGH'; } 
                    else if (data.crude_rate > $scope.max_death_proportion*2/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'MEDIUM'; } 
                    else if (data.crude_rate > $scope.max_death_proportion*1/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'LOW'; } 
                    else { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'VERY_LOW'; } 
                    $scope.map.updateChoropleth($scope.causes_of_death)
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

    $scope.refresh = function() {
        $scope.causes_of_death = {};
        $scope.max_death_proportion = 0;
        $scope.max_state_deaths = 0;
        var searchElement = document.getElementById('search');
        var genderElement = document.getElementById('gender'); 
        var agegroupElement = document.getElementById('agegroup');
        
        var search = searchElement.value;
        var gender = genderElement.options[genderElement.selectedIndex].value;
        var age_group = agegroupElement.options[agegroupElement.selectedIndex].value;

        if (search !== '') {$scope.maincause = "Showing diseases with highest death tolls containing the word(s) " + "'" + search + "'"};


        for (var i in $scope.states) {
            var state = $scope.states[i].name;
            $http.get('/search/' + search + '/' + gender + '/' + state + '/' + age_group)
                .success(function(data) {
                    if (data) {
                        data['fillKey'] = 'UNKNOWN';
                        $scope.causes_of_death[data.abbreviation.toUpperCase()] = data;
                        if (data.crude_rate > $scope.max_death_proportion) {
                            $scope.max_death_proportion = data.crude_rate;
                            $scope.max_state_proportion = data.state;
                        }
                        if (data.deaths > $scope.max_state_deaths) {
                            $scope.max_state_deaths = data.deaths;
                            $scope.max_state_deaths_name = data.state;
                        }
                        if (data.crude_rate > $scope.max_death_proportion*4/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'VERY_HIGH'; } 
                        else if (data.crude_rate > $scope.max_death_proportion*3/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'HIGH'; } 
                        else if (data.crude_rate > $scope.max_death_proportion*2/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'MEDIUM'; } 
                        else if (data.crude_rate > $scope.max_death_proportion*1/5) { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'LOW'; } 
                        else { $scope.causes_of_death[data.abbreviation.toUpperCase()]['fillKey'] = 'VERY_LOW'; } 
                        $scope.map.updateChoropleth($scope.causes_of_death)
                    }
                })
                .error(function(data){  
                    console.log("Error: " + data);
                });
        }  
    }
}