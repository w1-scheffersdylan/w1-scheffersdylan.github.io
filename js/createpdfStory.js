$("#controls").submit(function() {
  new AhaApi({
    accountDomain: $("#subdomain").val(),
    // Replace this with your client ID.
    clientId: "f5bc99e0ae866bc03dd5a49b7bcb0ff3a2686eb216c2b339aa4dd1f44688efd2", 
    // Replace this with your redirect URL.
    redirectUri: "https://w1-scheffersdylan.github.io/"
  }).authenticate(function(api, success, message) {
    var productKey = $("#product-key").val();
    var storyNumber = $("#storyNumber").val();
    
    // Hide the controls.
    $("#controls").remove();


    // get a single requirement (acceptance criteria)
     //api.get("/requirements/" + storyNumber + "-1", {}, function(response) {    

    //api.get("/products/" + productKey + "/features/WEB-296", {}, function(response) {
    api.get("/products/" + productKey + "/features/" + storyNumber, {}, function(response) {
    //api.get("/features/" + storyNumber + "/requirements", {}, function(response){ 
              
    // Do something with the features.
    console.log(api);
    //alert(JSON.stringify(response, null, 4));

    // variables
    var storyDataNumber = JSON.stringify(response.feature.reference_num).slice(1, -1);
    var storyDataName = JSON.stringify(response.feature.name).slice(1, -1);
    var storyDataGroom = JSON.stringify(response.feature.original_estimate);
    var storyDataDescription = JSON.stringify(response.feature.description.body).slice(4, -5);
    //var storyDataEpic = JSON.stringify(response.feature.initiative.name).slice(1, -1);

    // check if the grooming has a number
    if(storyDataGroom == "null"){
      storyDataGroom = "";
    }

    // check if their is a epic
    if( typeof JSON.stringify(response.feature.initiative) === 'undefined'){
      var storyDataEpic = "";
    }
    else {
      var storyDataEpic = JSON.stringify(response.feature.initiative.name).slice(1, -1);
    }

              
    
     // show data of story
     document.write('<img src="./images/sablonoLogo.png" style="position: absolute; top: 25px; right: 25px; width: 20%;" /><p><input type="submit" class="btn right" id="btnOpenPDF" value="Open story as PDF"></input> <input type="submit" class="btn right" id="btnSavePDF" value="Save story as PDF"></input></p><p><input type="submit" class="btn right" id="btnNewStory" value="New story"></input></p>');
    document.write("<h2>Story details</h2>");

      document.write("<table>");

        document.write("<tr><td>Story number:</td><td> (TICKET-ID)</td><td>");
        document.write(storyDataNumber + "</td><tr/>");

        document.write("<tr><td>Story name:</td><td> (TITLE)</td><td>");
        document.write(storyDataName + "</td><tr/>");

        document.write("<tr><td>Story grooming: </td><td> (GROOM)</td><td>");
        document.write(storyDataGroom + "</td><tr/>");

        document.write("<tr><td>Story epic:</td><td> (EPIC)</td><td>");
        document.write(storyDataEpic + "</td><tr/>");

        document.write("<tr><td>Story description:</td><td> (STORY)</td><td>");
        document.write(storyDataDescription + "</td><tr/>");      

      document.write("</table>");

      document.write("<br />");
      

      var requirementsArraz = [];
      function fetchARequirement(number){
        
        api.get("/requirements/" + storyNumber + "-" + number, {}, function(response) {

          requirementsArraz.push(response.requirement.name);
          document.write("<table><tr><td>Story requirements: (ACCEPTANCE CRITERIA)</td><td>");
          document.write(response.requirement.name+ "</td><tr/></table>");

          // console.log(requirementsArraz);

          fetchARequirement(number + 1);
           
        }); // close api.get 

      }
      
      // init the looping
      fetchARequirement(1);

      if( storyDataName != "" ){
        $('body').css('background-color', '#E0E0E0');
        $('body').css('font-family', 'Roboto');
        $('body').css('color', '#616161');
        $('input').css('background-color', '#FFD200');
        $('input').css('border', '5px solid #FFD200');
        $('input').css('border-radius', '2px');
        $('input').css('color', '#616161');
        $('input:hover').css('cursor', 'pointer');
      }

       
       $('#btnNewStory').click(function () {
          location.reload();
       });
            
//////////////STEP 3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // create PDF (using PDFmake)
      $('#btnOpenPDF').click(function () {
          
      // check if their are requirements (acceptance criteria) added to the story
      if(requirementsArraz[0] == "" || requirementsArraz[0] == undefined || requirementsArraz[0] == null){
        requirementsArraz.push("__");
      }


        // add a dash before every requirement (acceptance criteria)  
        var dashCheck = requirementsArraz[0];
        if(dashCheck.match(/__/g)){
        }
        else{
          for(var i=0; i < requirementsArraz.length; i++){
             requirementsArraz[i] = " __ " + requirementsArraz[i];
          }
        }
          
        // make first array variable empty  
        if(requirementsArraz[0] == "__"){
          requirementsArraz.splice(0, 1, "");
        }
          

          var docDefinition = {

          pageSize: 'A4',
          pageOrientation: 'landscape',


              content: [

                    
                                            
                    {
                        color: '#444',
                        //image: '../images/sablonoLogo.png',
                        table: {
                            widths: [ '5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%' ],
                            heights: [ '10%', '10%', '40%', '40%' ],
                            headerRows: 0,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{ text: [ 'TICKET-ID: \n \n', { text: storyDataNumber, style: 'mediumText', alignment: 'center' }, '\n \n'], colSpan: 3 }, '', '', 
                                 { text: [ 'TITLE: \n \n', { text: storyDataName, style: 'bigTextBold', alignment: 'center'  }, '\n \n'], colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'PRIORITY:\n' + '\n \n', colSpan: 2, rowSpan: 2 }, ''],

                                [{ text: [ 'EPIC:\n', { text: storyDataEpic, style: 'mediumText', alignment: 'center' }], colSpan: 11 }, '', '', '', '', '', '', '', '', '', '', 
                                 { text: ['GROOM: \n', { text: storyDataGroom, style: 'bigText', alignment: 'center' }, '\n'], colSpan: 2, }, '', 
                                 { text: 'CORR: \n' + '\n \n', colSpan: 2 }, '', 
                                 { text: 'REAL: \n' + '\n \n', colSpan: 2 }, '', '', ''],

                                [{ text: [ 'STORY: \n \n', { text: storyDataDescription, style: 'mediumTextBold', alignment: 'center' }, '\n \n'],colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text:'NOTES:\n \n \n \n \n \n \n \n ', colSpan: 6 }, '', '', '', '', ''],

                                [{ text: 'ACCEPTANCE CRITERIA: \n \n' + requirementsArraz.join("\n"), colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'DEFINITION OF DONE:\n\n __ Responsiveness \n \n __ Internationalization \n \n __ Code Review \n \n __ Documentation \n \n __ Testing by ....... \n \n __ Bug-fixing by ....... \n \n __ Linting & beautify Code \n \n', colSpan: 6 }, '', '', '', '', ''],
                            ]
                        }
                    }


              ]
              ,
              styles: {
                mediumText: {
                  fontSize: 19
                },
                mediumTextBold: {
                  fontSize: 19,
                  bold: true
                },
                bigText: {
                  fontSize: 22
                },
                bigTextBold: {
                  fontSize: 22,
                  bold: true
                },
                biggerText: {
                  fontSize: 26
                }

              },
              defaultStyle: {
                // alignment: 'justify'
              }
              
            }

            
          


            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();

            


      }); // close btnOpenPDF




    
    

      // create PDF (using PDFmake)
      $('#btnSavePDF').click(function () {

        // check if their are requirements (acceptance criteria) added to the story
        if(requirementsArraz[0] == "" || requirementsArraz[0] == undefined || requirementsArraz[0] == null){
          requirementsArraz.push("__");
        }


        // add a dash before every requirement (acceptance criteria)  
        var dashCheck = requirementsArraz[0];
        if(dashCheck.match(/__/g)){
        }
        else{
          for(var i=0; i < requirementsArraz.length; i++){
             requirementsArraz[i] = " __ " + requirementsArraz[i];
          }
        }
          
        // make first array variable empty  
        if(requirementsArraz[0] == "__"){
          requirementsArraz.splice(0, 1, "");
        }

          

          

          

          var docDefinition = {

          pageSize: 'A4',
          pageOrientation: 'landscape',


              content: [
                    
                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: [ '5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%' ],
                            heights: [ '10%', '10%', '40%', '40%' ],
                            headerRows: 0,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{ text: [ 'TICKET-ID: \n \n', { text: storyDataNumber, style: 'biggerText', alignment: 'center' }, '\n \n'], colSpan: 4 }, '', '', '', 
                                 { text: [ 'TITLE: \n', { text: storyDataName, style: 'bigTextBold', alignment: 'center'  }, '\n \n \n \n'], colSpan: 13 }, '', '', '', '', '', '', '', '', '', '', '', '',  
                                 { text: 'PRIORITY:\n' + '\n \n', colSpan: 2, rowSpan: 2 }, ''],

                                [{ text: 'EPIC:\n' + '\n \n', colSpan: 11 }, '', '', '', '', '', '', '', '', '', '', 
                                 { text: ['GROOM: \n', { text: storyDataGroom, style: 'bigText', alignment: 'center' }, '\n'], colSpan: 2, }, '', 
                                 { text: 'CORR: \n' + '\n \n', colSpan: 2 }, '', 
                                 { text: 'REAL: \n' + '\n \n', colSpan: 2 }, '', '', ''],

                                [{ text: [ 'STORY: \n', { text: storyDataDescription, style: 'mediumText', alignment: 'center' }],colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text:'NOTES:\n \n \n \n \n \n \n \n ', colSpan: 6 }, '', '', '', '', ''],

                                [{ text: 'ACCEPTANCE CRITERIA: \n' + requirementsArraz.join("\n"), colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'DEFINITION OF DONE:\n\n __ Responsiveness \n \n __ Internationalization \n \n __ Code Review \n \n __ Documentation \n \n __ Testing by ....... \n \n __ Bug-fixing by ....... \n \n __ Linting & beautify Code \n \n', colSpan: 6 }, '', '', '', '', ''],
                            ]
                        }
                    }

              ],
              styles: {
                mediumText: {
                  fontSize: 17
                },
                bigText: {
                  fontSize: 22
                },
                bigTextBold: {
                  fontSize: 22,
                  bold: true
                },
                biggerText: {
                  fontSize: 26
                }

              },
              defaultStyle: {
                // alignment: 'justify'
              }
              
            }


            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).download("Story_" + storyDataNumber + ".pdf");


          
      });



    }); // close api.get
 



  }); // close authenticate 
  return false;
});