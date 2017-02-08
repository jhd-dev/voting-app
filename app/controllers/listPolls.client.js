//'use strict';
var pollList;
(function() {
    ajaxFunctions.ready(function(){
        ajaxFunctions.ajaxRequest('GET', ajaxFunctions.apiUrl, function(result){
            var data = JSON.parse(result);
            var polls = data.polls;
            var user = data.user;
            
            pollList = new Vue({
                el: '#polls',
                data: {
                    polls: polls
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
            
            var userHead = document.getElementById('user-head');
            if (user && userHead){
                var displayName = user.github.displayName;
                var usernameHead = document.getElementById('username-head');
                userHead.innerHTML = displayName;
                if (displayName && usernameHead){
                    usernameHead.innerHTML = '@' + user.github.username;
                }else{
                    userHead.innerHTML = '@' + user.github.username;
                }
            }
            
            /*var sublinks = document.getElementsByClassName('sublink');
            for (var i = 0; i < sublinks.length; i ++){
                sublinks[i].onclick = function(e){
                    window.location = sublinks[i].href;
                    e.preventDefault();
                    return false;
                };
            }*/
            
            //console.log("done");
        });
    });
})();