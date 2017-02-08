'use strict';
//Uses Google Charts

(function(){
    ajaxFunctions.ready(function(){
        //var choicesCont = document.getElementById('choices');
        //var otherBtn = document.getElementById('other-btn');
        //var otherText = document.getElementById('other-text');
        var submitBtn = document.getElementById('submit-choice');
        var chartLocation = document.getElementById('chart');
        
        ajaxFunctions.ajaxRequest('GET', ajaxFunctions.apiUrl, function(result){
            //console.log(result);
            var poll = JSON.parse(result);
            
            var PollApp = new Vue({
               el: '#poll',
               data: {
                   choices: poll.choices,
                   voteUrl: window.location,
                   chose: false
               },
               delimiters: ['${', '}']
            });
            
            var pollTitle = document.getElementsByClassName('poll-title-head');
            if (pollTitle[0]){
                pollTitle[0].innerHTML = poll.title;
            }
            
            var choiceBtns = document.getElementsByClassName("choice-btn");console.log(choiceBtns);
            for (let i = 0; i < choiceBtns.length; i ++){
                choiceBtns[i].onclick = function(){console.log(submitBtn, submitBtn.disabled);
                    submitBtn.removeAttribute('disabled');
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
