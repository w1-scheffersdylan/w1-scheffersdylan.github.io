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
     document.write('<img src="./images/sablonoLogo.png" style="position: absolute; top: 25px; right: 25px; width: 20%;" /><p><input type="submit" class="btn right" id="btnOpenPDF" value="OPEN story as PDF"></input> <input type="submit" class="btn right" id="btnSavePDF" value="SAVE story as PDF"></input></p><p><input type="submit" class="btn right" id="btnNewStory" value="New story"></input></p>');
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

      document.write('<p> <input type="text" placeholder="Add requirement by hand to PDF" id="addRequirementValue"></input> <input type="submit" value="Add requirement" id="addRequirement"></input></p>')
      

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



      $("#addRequirement").click(function() {
        if( $("#addRequirementValue").val() != "" ) {
           requirementsArraz.push($("#addRequirementValue").val());
           document.write("<table><tr><td>Story requirements: (ACCEPTANCE CRITERIA)</td><td>");
           document.write(requirementsArraz[requirementsArraz.length - 1]+ "</td><tr/></table>");
        }
      });



      if( storyDataName != "" ){
        $('body').css('background-color', '#E0E0E0').css('color', '#616161').css('font-family', 'Roboto');
        $('input').css('border-radius', '2px').css('color', '#616161').css('cursor', 'pointer');
        $('#btnOpenPDF').css('background-color', '#26BF59').css('border', '5px solid #26BF59').css('color', '#FFF');
        $('#btnSavePDF').css('background-color', '#26BF59').css('border', '5px solid #26BF59').css('color', '#FFF');
        $('#btnNewStory').css('background-color', '#FFD200').css('border', '5px solid #FFD200');
        $('#addRequirementValue').css('background-color', '#E0E0E0').css('border', '0px solid #FFD200').css('border-bottom', '1px solid #616161').css('font-family', 'Roboto').css('width', '327px').css('cursor', 'auto');
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
                                 {
                     image: 'data:image/png;base64,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',
                     height: 25,
                     width: 107,
                     

                     
                    },

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