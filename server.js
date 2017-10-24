  var express = require('express');
  var fs = require('fs');
  var mammoth = require('mammoth');
  var bodyParser = require('body-parser');
  var http = require('http');
  const cheerio = require('cheerio');
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var he = require('he');

  var app = express();

  app.use(express.static(__dirname + "/public"));
  app.use('/public', express.static(__dirname + '/public'));
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(bodyParser.json());

  var newhtmlfile;
  var elemente = 'p,h1,h2,h3,h4,table,ul,ol,a';

  app.post('/contactlisty', function(req, res) {
    mammoth.convertToHtml({
      path: './DE_Texte/' + req.body.user
    }).then(function(result) {
      html = result.value;
      var messages = result.messsages;
      newhtmlfile = req.body.user;
      newhtmlfile = newhtmlfile.replace('.docx', '');
      var htmlheader = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>'
      var htmlheaderende = "</body></html>"
      fs.writeFile("./DE_Texte/" + newhtmlfile + ".html", htmlheader + html + htmlheaderende, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    });
    res.send("200 Transformation erfolgreich!");
  });

  app.get('/vorschau', function(req, res) {
    const $ = cheerio.load(fs.readFileSync(__dirname + "/DE_Texte" + "/" + newhtmlfile + ".html"));
    var content = [];
    content.push($('p').eq(1).text());
    content.push($('p').eq(3).text());
    content.push($('p').eq(5).text());
    for (i = 7; i < $(elemente).get().length; i++) {
      if ($(elemente).get(i).tagName == "h1") {
        content.push($(elemente).eq(i).text());
      }
    }
    res.send(content);
  });

  app.get('/vorschauansehen', function(req, res) {
   const $ = cheerio.load(fs.readFileSync(__dirname + "/DE_Texte" + "/" + newhtmlfile + ".html"));
    var jason = {
      content: []
    };
    jason.content.push({
      'title': $('p').eq(1).text(),
      'description': $('p').eq(3).text(),
      'teaser': $('p').eq(5).text()
    });
    
    for (i = 7; i < $(elemente).get().length; i++) {

      //H1 Parsen
      if ($(elemente).get(i).tagName == "h1") {
        var heins = $(elemente).eq(i).text();
        jason.content.push({
          'h1': heins
        });
      }

      //H2 Parsen mit Text
      else if ($(elemente).get(i).tagName == "h2") {
        var hilfe = "";
        var str;
        var hzwei = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              htmlbodydecoded = he.decode(htmlbody);

            } else if (($(elemente).eq(t + 1).html()).includes("<a href=")){


        
              console.log($('p').children('a').text());
              console.log($(elemente).eq(t + 1).html());
              
            
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } 
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h2': hzwei,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
      }
      //H3 Parsen mit Text
      else if ($(elemente).get(i).tagName == "h3") {
        var hilfe = "";
        var str;
        var hdrei = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              var htmlbodydecoded = he.decode(htmlbody);
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          }
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h3': hdrei,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
      }

      //h4 parsen
      else if ($(elemente).get(i).tagName == "h4") {
        var hilfe = "";
        var str;
        var hvier = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              var htmlbodydecoded = he.decode(htmlbody);
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          }
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h4': hvier,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
        //Table Parsen
      } else if ($(elemente).get(i).tagName == "table") {
        var str = "<table>" + ($(elemente).eq(i).html()) + "</table>";
        var strnew = $(elemente).eq(i).html();
        var find = "</td><td>";
        var re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "|");
        find = "</tr><tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "\n");
        find = "<tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<p>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</p>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<td>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</td>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</tbody>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<tbody>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</strong>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<strong>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        var tabellenwert = he.decode(strnew);
        $(elemente).eq(i).empty();
        jason.content.push({
          'table': tabellenwert,
          'nein': ''
        });
      }
      //P Parsen mit Text  
      else if ($(elemente).get(i).tagName == "p") {
        var toczahler = 0;
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length; t++) {
          if ($(elemente).eq(t + 1).text() == "_TABLE_OF_CONTENT_") {
            toczahler = i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - $(elemente).eq(t + 1).index();
          }
        }
        if ($(elemente).eq(i).text() == "_TABLE_OF_CONTENT_") {
          jason.content.push({
            'toc': 'toc_toc'
          });
          toczahler = 0;
          $(elemente).eq(i).empty();
        }
        var str = "<p>" + $(elemente).eq(i).text() + "</p>";
        var hilfe = "";
        var test;
        var toc;
        if ($(elemente).eq(i).text() == "") {} else {
          for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - toczahler; t++) {
            if ($(elemente).eq(t + 1).html() != "_TABLE_OF_CONTENT_") {
              test = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + test;
            }
          }
          for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - toczahler; t++) {
            if ($(elemente).eq(t + 1).text() != "_TABLE_OF_CONTENT_") {
              $(elemente).eq(t + 1).empty();
            }
          }
          str = str + hilfe;
          jason.content.push({
            'not': '',
            'p': str
          });
        }

      }

    }

    jayson = JSON.stringify(jason);
    console.log("Jason.Content: " + jason.content.length);
    var inhalte = []; 
    var gib ="";
              
    for (i = 0; i < jason.content.length; i++){
      if (jason.content[i].title != undefined && jason.content[i].description != undefined || 
        jason.content[i].teaser != undefined) {
          inhalte.push("<b>Title:</b> " + jason.content[i].title + "<br/>");
          inhalte.push("<b>Description:</b> " + jason.content[i].description + "<br/>");
          inhalte.push("<b>Teaser:</b> " + jason.content[i].teaser + "<br/>");
      } else if (jason.content[i].p != undefined && jason.content[i].h2 != undefined){
          inhalte.push("<b>H2: " + jason.content[i].h2 + "</b><br/>");
          inhalte.push(jason.content[i].p + "<br/>");
      } else if (jason.content[i].p != undefined && jason.content[i].h3 != undefined){
          inhalte.push("<b>H3: " + jason.content[i].h3 + "</b><br/>");
          inhalte.push(jason.content[i].p + "<br/>");
      } else if (jason.content[i].p != undefined && jason.content[i].h4 != undefined){
          inhalte.push("<b>H4: " + jason.content[i].h4 + "</><br/>");
          inhalte.push(jason.content[i].p + "<br/>");
      } else if (jason.content[i].htmlbody != undefined && jason.content[i].noheaderhtml != undefined){
          inhalte.push("<b>HTML:</b><br/>"+jason.content[i].htmlbody + "<br/>");
      } else if (jason.content[i].not != undefined && jason.content[i].p != undefined){
          inhalte.push(jason.content[i].p + "<br/>");
      } else if (jason.content[i].table != undefined && jason.content[i].nein != undefined){
          inhalte.push("<b>TABLE:</b><br/>"+jason.content[i].table + "<br/>");
      } else if (jason.content[i].toc != undefined){
          inhalte.push(jason.content[i].toc + "<br/>");
      } else if (jason.content[i].h1 != undefined){
          inhalte.push("<b>H1: " + jason.content[i].h1 + "</b><br/>");
      }
      inhalte.push("=================================" + "<br/>");
    }
    for (z = 0; z < inhalte.length; z++){
      gib += inhalte[z];
    }

   res.send(gib);
  });

  app.post('/test', function(req, res) {
    console.log(req.body.KategorieID);
    const $ = cheerio.load(fs.readFileSync(__dirname + "/DE_Texte" + "/" + newhtmlfile + ".html"));
    var jason = {
      content: []
    };
 
    jason.content.push({
      'kategorieid': req.body.KategorieID,
      'title': $('p').eq(1).text(),
      'description': $('p').eq(3).text(),
      'teaser': $('p').eq(5).text()
    });
    for (i = 7; i < $(elemente).get().length; i++) {

      //H1 Parsen
      if ($(elemente).get(i).tagName == "h1") {
        var heins = $(elemente).eq(i).text();
        jason.content.push({
          'h1': heins
        });
      }

      //H2 Parsen mit Text
      else if ($(elemente).get(i).tagName == "h2") {
        var hilfe = "";
        var str;
        var hzwei = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              htmlbodydecoded = he.decode(htmlbody);
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          }
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h2': hzwei,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
      }
      //H3 Parsen mit Text
      else if ($(elemente).get(i).tagName == "h3") {
        var hilfe = "";
        var str;
        var hdrei = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              var htmlbodydecoded = he.decode(htmlbody);
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          }
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h3': hdrei,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
      }

      //h4 parsen
      else if ($(elemente).get(i).tagName == "h4") {
        var hilfe = "";
        var str;
        var hvier = $(elemente).eq(i).text();
        var htmlbody = "";
        var htmlbodydecoded = "";
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          if ($(elemente).get(t + 1).tagName == "p") {
            //Embeded Videos
            if (($(elemente).eq(t + 1).html()).startsWith("&lt;iframe")) {
              htmlbody = $(elemente).eq(t + 1).html();
              var htmlbodydecoded = he.decode(htmlbody);
            } else {
              str = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + str;
            }
          } else if ($(elemente).get(t + 1).tagName == "ul") {
            str = "<ul>" + $(elemente).eq(t + 1).html() + "</ul>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          } else if ($(elemente).get(t + 1).tagName == "ol") {
            str = "<ol>" + $(elemente).eq(t + 1).html() + "</ol>";
            hilfe = hilfe + str;
            $(elemente).eq(t + 1).empty();
          }
        }
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table').length; t++) {
          $(elemente).eq(t + 1).empty();
        }
        jason.content.push({
          'h4': hvier,
          'p': hilfe
        });
        if (htmlbody != "") {
          jason.content.push({
            'htmlbody': htmlbodydecoded,
            'noheaderhtml': ''
          });
        }
        //Table Parsen
      } else if ($(elemente).get(i).tagName == "table") {
        var str = "<table>" + ($(elemente).eq(i).html()) + "</table>";
        var strnew = $(elemente).eq(i).html();
        var find = "</td><td>";
        var re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "|");
        find = "</tr><tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "\n");
        find = "<tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</tr>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<p>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</p>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<td>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</td>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</tbody>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<tbody>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "</strong>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        find = "<strong>";
        re = new RegExp(find, 'g');
        strnew = strnew.replace(re, "");
        var tabellenwert = he.decode(strnew);
        $(elemente).eq(i).empty();
        jason.content.push({
          'table': tabellenwert,
          'nein': ''
        });
      }
      //P Parsen mit Text  
      else if ($(elemente).get(i).tagName == "p") {
        var toczahler = 0;
        for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length; t++) {
          if ($(elemente).eq(t + 1).text() == "_TABLE_OF_CONTENT_") {
            toczahler = i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - $(elemente).eq(t + 1).index();
          }
        }
        if ($(elemente).eq(i).text() == "_TABLE_OF_CONTENT_") {
          jason.content.push({
            'toc': 'toc_toc'
          });
          toczahler = 0;
          $(elemente).eq(i).empty();
        }
        var str = "<p>" + $(elemente).eq(i).text() + "</p>";
        var hilfe = "";
        var test;
        var toc;
        if ($(elemente).eq(i).text() == "") {} else {
          for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - toczahler; t++) {
            if ($(elemente).eq(t + 1).html() != "_TABLE_OF_CONTENT_") {
              test = "<p>" + $(elemente).eq(t + 1).html() + "</p>";
              hilfe = hilfe + test;
            }
          }
          for (t = i; t < i + $(elemente).eq(i).nextUntil('h1,h2,h3,h4,table,ul').length - toczahler; t++) {
            if ($(elemente).eq(t + 1).text() != "_TABLE_OF_CONTENT_") {
              $(elemente).eq(t + 1).empty();
            }
          }
          str = str + hilfe;
          jason.content.push({
            'not': '',
            'p': str
          });
        }
      }
    }
    jayson = JSON.stringify(jason)
    var options = {
      host: 'localhost',
      port: 80,
      path: '/api/rest-api-client/dokument',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jayson)
      }
    };
    var httpreq = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function(chunk) {
        //console.log(chunk);
      });
      response.on('end', function() {
        res.send('Upload erfolgreich');
      })
    });
    httpreq.write(jayson);
    httpreq.end();
  });

  app.get('/yolo', function(req, res) {
    console.log("Server ok");
    res.sendFile(__dirname + "/DE_Texte" + "/" + newhtmlfile + ".html");
  });

  //Hole alle Artikel vom Server
  app.get('/getliste', function(req, res) {
    var testy = "";
    var options = {
      host: 'localhost',
      port: 80,
      path: '/api/rest-api-client/alldokumente',
      method: 'GET',
    };
    var httpreq = http.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function(chunk) {
        console.log("Chunk: " + chunk);
        console.log("Response: " + response);
        console.log("Res: " + res);

        res.send(chunk);
      });
      //response.on('end', function() {
      //  res.send("testy");
      //})
    });
    httpreq.end();

  });

  app.listen(3000);
  console.log("Server hört auf Port: 3000");
  console.log(__dirname);