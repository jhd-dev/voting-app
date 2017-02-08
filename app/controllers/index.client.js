//'use strict';
var pollList;
(function() {
    ajaxFunctions.ready(function(){
        var apiUrl = appUrl + '/api/polls';
        ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
            var polls = JSON.parse(data);
            console.log(polls);
            
            pollList = new Vue({
                el: '#polls',
                data: {
                    polls: polls,
                },
                methods: {
                    pollUrl: function(poll){
                        return window.location.origin + '/poll/' + poll._id;
                    },
                    authorUrl: function(poll){
                        return window.location.origin + '/user/' + poll.author.id;
                    }
                },
                delimiters: ['${', '}']
            });
            
            console.log("done");
        });
    });
})();