'use strict';
//Uses Google Charts

(function(){
    var apiUrl = window.location.origin + '/api' + window.location.pathname;
    var choicesCont = document.getElementById('choices');
    var submitBtn = document.getElementById('submit-choice');
    var chartLocation = document.getElementById('chart');
    
    ajaxFunctions.ready(function(){
        ajaxFunctions.ajaxRequest('GET', apiUrl, function(result){
            //console.log(result);
            var poll = JSON.parse(result);
            
            var PollApp = new Vue({
               el: '#poll',
               data: {
                   choices: poll.choices,
                   voteUrl: window.location
               },
               delimiters: ['${', '}']
            });
            
            submitBtn.disabled = true;
            var choiceBtns = document.getElementsByClassName("choice");
            for (let i = 0; i < choiceBtns.length; i ++){
                choiceBtns[i].onclick = function(){
                    submitBtn.disabled = false;
                };
            }
            
            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});
            
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart);
            
            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.
            function drawChart() {
            
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Choice');
                data.addColumn('number', 'Votes');
                data.addRows(poll.choices.map(function(choice){
                    //console.log(choice);
                    return [choice.choice, choice.votes.length];//choice.votes.length];
                }));
                
                // Set chart options
                var options = {
                    'title': poll.title,
                    'width': 400,
                    'height': 300
                };
                
                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart(chartLocation);
                chart.draw(data, options);
            }
        });
    });
})();
