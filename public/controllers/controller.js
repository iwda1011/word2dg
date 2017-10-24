    var myApp = angular.module('myApp', []);
    myApp.controller('AppCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {

        $scope.kategorien = [
        {name :"- WEBSITES -", id: 0},
        {name :"Webseiten erstellen", id : 486}, 
        {name :"Webdesign", id: 487},
        {name :"Web-Entwicklung", id: 488},
        {name :"Online-Recht", id: 489},
        {name :"- HOSTING -", id: 0},
        {name :"CMS", id: 490},
        {name :"Blogs", id: 491},
        {name :"Hosting-Technik", id: 492}, 
        {name :"- SERVER -", id: 0},
        {name :"KnowHow", id: 493},
        {name :"Konfiguration", id: 494}, 
        {name :"Sicherheit",id: 495},
        {name :"Tools", id: 496},
        {name :"- DOMAINS -", id: 0},
        {name :"Domainendungen", id: 497},
        {name :"Domainverwaltung", id: 499},
        {name :"Domain-News", id: 500},
        {name :"Domaintipps", id: 501},
        {name :"- ONLINE MARKETING -", id: 0}, 
        {name :"Verkaufen im Internet", id: 502}, 
        {name :"Suchmaschinenmarketing", id: 503},
        {name :"Social Media", id: 504},
        {name :"Web-Analyse", id: 505},
        {name :"- E-MAIL -", id: 0},
        {name :"E-Mail Marketing",id: 506}, 
        {name :"E-Mail Sicherheit", id: 507},
        {name :"E-Mail Technik", id: 508},
        {name :"- KMU -", id: 0},
        {name :"Buchhaltung", id: 509},
        {name :"Rechnungen", id: 510},
        {name :"Steuern & Recht", id: 511}
        ];

        $scope.getliste = function() {
            $http.get('http://localhost:3000/getliste').then(function(response) {
                $scope.titles = [];
                for (i = 0; i < response.data.length; i++) {
                    $scope.titles.push(response.data[i].title);
                }
            });
        }
        $scope.foo = function() {
            $window.open('http://localhost:3000/yolo', '_blank');
        }
        $scope.neueSeite = function() {
            var seitenname = document.getElementById("seitenname").value;
            var ueberschrift1 = document.getElementById("ueberschrift1").value;

            $window.open('http://localhost/api/rest-api-client/viddel/cars/' + seitenname + '/' + ueberschrift1, '_blank');
        }
        $scope.posten = function() {
            var txt;
            var r = confirm("Möchten Sie den Artikel wirklich hochladen?");
            if (r == true){
                if (document.getElementById('KategorieID').innerHTML > 0){
                    $http.post('http://localhost:3000/test',{
                        "KategorieID" : document.getElementById('KategorieID').innerHTML 
                    }).then(function(response) {
                        alert("Status: " + response.status + " Upload erfolgreich");
                        console.log(response);
                    });
                } else {
                    alert("Keine gültige Kategorie ausgewählt!")
                }
            } else {
                console.log("Upload abgebrochen");
            }
        }



        $scope.vorschau = function(){

           $window.open('http://localhost:3000/vorschauansehen', '_blank','width=1000');/*
            $http.get('http://localhost:3000/vorschauansehen').then(function(response) {
               var inhalte = []; 
               
                for (i = 0; i < response.data.content.length; i++){
                    if (response.data.content[i].title != undefined && response.data.content[i].description != undefined || 
                    response.data.content[i].teaser != undefined) {
                        inhalte.push("<b>Title:</b> " + response.data.content[i].title + "<br/>");
                        inhalte.push("<b>Description:</b> " + response.data.content[i].description + "<br/>");
                        inhalte.push("<b>Teaser:</b> " + response.data.content[i].teaser + "<br/>");
                    } else if (response.data.content[i].p != undefined && response.data.content[i].h2 != undefined){
                        inhalte.push("<b>H2: " + response.data.content[i].h2 + "</b><br/>");
                        inhalte.push(response.data.content[i].p + "<br/>");
                    } else if (response.data.content[i].p != undefined && response.data.content[i].h3 != undefined){
                        inhalte.push("<b>H3: " + response.data.content[i].h3 + "</b><br/>");
                        inhalte.push(response.data.content[i].p + "<br/>");
                    } else if (response.data.content[i].p != undefined && response.data.content[i].h4 != undefined){
                        inhalte.push("<b>H4: " + response.data.content[i].h4 + "</><br/>");
                        inhalte.push(response.data.content[i].p + "<br/>");
                    } else if (response.data.content[i].htmlbody != undefined && response.data.content[i].noheaderhtml != undefined){
                        inhalte.push(response.data.content[i].htmlbody + "<br/>");
                    } else if (response.data.content[i].not != undefined && response.data.content[i].p != undefined){
                        inhalte.push(response.data.content[i].p + "<br/>");
                    } else if (response.data.content[i].table != undefined && response.data.content[i].nein != undefined){
                        inhalte.push(response.data.content[i].table + "<br/>");
                    } else if (response.data.content[i].toc != undefined){
                        inhalte.push(response.data.content[i].toc + "<br/>");
                    } else if (response.data.content[i].h1 != undefined){
                        inhalte.push("<b>H1: " + response.data.content[i].h1 + "</b><br/>");
                    }
                    inhalte.push("=================================" + "<br/>");
                }

                for (z = 0; z < inhalte.length; z++){
                    document.getElementById('inhaltet').innerHTML += inhalte[z];
                }
            });*/
        }




        $(document).ready(
            function() {
                console.log("Client gestartet");
                
                $('#blocken').attr('disabled', true);
                $('#blocken2').attr('disabled', true);
                $('#blocken3').attr('disabled', true);
                $('input:file').change(
                    function() {
                        
                        var img = document.getElementById('foto1');
                        img.style.visibility = 'visible';
                        console.log("Datei erfolgreich ausgewählt!")
                        var f = document.getElementById('file').files[0],
                            r = new FileReader();
                        r.onloadend = function(e) {
                            var data = e.target.result;
                        }
                        r.readAsDataURL(f);
                        $http.post('/contactlisty', {
                            "user": f.name
                        }).then(function(response) {
                            if (response.data == "200 Transformation erfolgreich!") {
                                console.log(response.data);
                                $http.get('/vorschau').then(function(response) {
                                    

                                    document.getElementById('uploadready').innerHTML = "Datei erfolgreich ausgewählt und <b>bereit zum Upload!</b>"
                                    document.getElementById('dokupfad').innerHTML = "<b>Dateiname: </b><br/>" + document.getElementById('file').value;
                                    /*
                                    document.getElementById('Seitentitel').innerHTML = "<b>Seitentitel: </b><br/>" + response.data[0];
                                    document.getElementById('Teaser').innerHTML = "<b>Teaser: </b><br/>" + response.data[1];
                                    document.getElementById('Description').innerHTML = "<b>Description: </b><br/>" + response.data[2];
                                    document.getElementById('Ueberschrift1').innerHTML = "<b>Überschrift 1: </b><br/>" + response.data[3];
                                    */
                                    $('#blocken2').removeAttr('disabled');
                                    $('#blocken3').removeAttr('disabled');
                                });
                            } else {
                                $('#blocken2').attr('disabled', true);
                                $('#blocken3').attr('disabled', true);
                            }
                        });
                        if ($(this).val()) {
                            $('#blocken').removeAttr('disabled');
                           
                        } else {
                            $('#blocken').attr('disabled', true);
                            
                        }
                    }
                );
            }
        );
    }]);