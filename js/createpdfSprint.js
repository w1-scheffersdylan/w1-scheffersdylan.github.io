


// old and random code


$("#controlsSprint").submit(function() {
  new AhaApi({
    accountDomain: $("#subdomain").val(),
    // Replace this with your client ID.
    clientId: "f5bc99e0ae866bc03dd5a49b7bcb0ff3a2686eb216c2b339aa4dd1f44688efd2", 
    // Replace this with your redirect URL.
    redirectUri: "https://w1-scheffersdylan.github.io/"
  }).authenticate(function(api, success, message) {
    var productKey = $("#product-key").val();
    var sprintNumber = $("#sprintNumber").val();
    
    // Hide the controls.
    $("#controlsSprint", "#controls").remove();


    //api.get("/products/" + productKey + "/features/WEB-296", {}, function(response) {
    api.get("/releases/" + sprintNumber + "/features/", {}, function(response) {
    //api.get("/features/" + storyNumber + "/requirements", {}, function(response){ 


              
    // alerts for test
    //alert(JSON.stringify(response.features));
    //alert( response.features[0]["name"] );

    //document.write(JSON.stringify(response.features));

    // variables
    // var storyDataNumber = response.features[0]["name"];
    //var storyDataName = response.features[0]["name"];
    // var storyDataGroom = response.features[0]["name"];
    // var storyDataDescription = response.features[0]["name"];


    // check if the grooming has a number
    // if(storyDataGroom == "null"){
    //   storyDataGroom = "";
    // }


      

     // show data of story
     // document.write('<p><input type="submit" class="btn right" id="btnOpenPDFSprint" value="Open sprint as PDF"></input> <input type="submit" class="btn right" id="btnSavePDFSprint" value="Save sprint as PDF"></input></p>');
      // document.write("<h2>Sprint details</h2>");
      // document.write("<table>");

        // document.write("<tr><td>Story number:</td><td> (TICKET-ID)</td><td>");
        // document.write(storyDataNumber + "</td><tr/>");
        var SprintDataStoryName = [];

        for( i = 0; i < response.features.length; i++ ){
          SprintDataStoryName.push(response.features[i]["name"])
          // document.write("<tr><td>Story name:</td><td> (TITLE)</td><td>" + SprintDataStoryName[i] + "</td></tr>");
        }


        

        // document.write("<tr><td>Story grooming: </td><td> (GROOM)</td><td>");
        // document.write(storyDataGroom + "</td><tr/>");

        // document.write("<tr><td>Story description:</td><td> (STORY)</td><td>");
        // document.write(storyDataDescription + "</td><tr/>");      

      // document.write("</table>");

      // document.write("<br />");



      //////////////////////////////////////////////////////////////////////////////////////////////////
      // GET ALL DATA FROM STORIES



      // put all ticket-id's in an array
      var SprintDataStoryNumber = [];
      for( i = 0; i < response.features.length; i++ ){
        SprintDataStoryNumber.push(response.features[i]["reference_num"])
      }

      // get all grooming points in an array
      var SprintDataStoryGroom = [];
      // get all story descriptions in an array
      var SprintDataStoryDescription = [];
      // get all epic in an array
      var SprintDataStoryEpic = [];
      // get all title in an array
      var SprintDataStoryTitle = [];

      function fectchSprintDataStoryGroomDescription(number){
        
        api.get("/products/" + productKey + "/features/" + SprintDataStoryNumber[number], {}, function(response) {

          SprintDataStoryGroom.push(response.feature.original_estimate.toString());
          SprintDataStoryDescription.push(response.feature.description.body);
          SprintDataStoryTitle.push(response.feature.name);

          // check if their is a epic
          if( typeof JSON.stringify(response.feature.initiative) === 'undefined'){
            SprintDataStoryEpic.push("");
          }
          else {
            SprintDataStoryEpic.push(response.feature.initiative.name);
          }

          document.write("<table><tr><td> Ticket-ID: </td><td>" + SprintDataStoryNumber[number] + '<input type="submit" class="btn right" id="btnOpenPDFSprint'+[number]+'" value="OPEN story as PDF ' + [number] + ' "></input>' + "</td><tr/>");
          document.write("<tr><td> Title: </td><td>" + SprintDataStoryTitle[number] + "</td><tr/>");
          document.write("<tr><td> Groom: </td><td>" + SprintDataStoryGroom[number] + "</td><tr/>");
          document.write("<tr><td> Story: </td><td>" + SprintDataStoryDescription[number] + "</td><tr/>");
          document.write("<tr><td> Epic: </td><td>" + SprintDataStoryEpic[number] + "</td><tr/></table><br /><br />");

          console.log(SprintDataStoryTitle);
          console.log(SprintDataStoryNumber[number]);
          console.log(SprintDataStoryGroom[number]);
          console.log(SprintDataStoryDescription[number]);
          console.log(SprintDataStoryEpic[number]);


          fectchSprintDataStoryGroomDescription(number + 1);
           
        }); // close api.get 

      }


      // init the looping
      fectchSprintDataStoryGroomDescription(0);





      var SprintDataStoryRequirements = [];
      function fetchSprintDataStoryRequirements(number){

        var numberRequirement = 1;
        
        api.get("/requirements/" + SprintDataStoryNumber[number] + "-" + numberRequirement, {}, function(response) {

          SprintDataStoryRequirements.push(response.requirement.name);

          console.log(SprintDataStoryRequirements[number]);


          fetchSprintDataStoryRequirements(number + 1);
           
        }); // close api.get 

      }
      
      // init the looping
      fetchSprintDataStoryRequirements(2);

    
            
//////////////STEP 3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      
      var number = '#btnOpenPDFSprint0';
      // create PDF (using PDFmake)
      $(number).click(function () {
          
      // // check if their are requirements (acceptance criteria) added to the story
      // if(requirementsArraz[0] == "" || requirementsArraz[0] == undefined || requirementsArraz[0] == null){
      //   requirementsArraz.push("__");
      // }


      //   // add a dash before every requirement (acceptance criteria)  
      //   var dashCheck = requirementsArraz[0];
      //   if(dashCheck.match(/__/g)){
      //   }
      //   else{
      //     for(var i=0; i < requirementsArraz.length; i++){
      //        requirementsArraz[i] = " __ " + requirementsArraz[i];
      //     }
      //   }
          
      //   // make first array variable empty  
      //   if(requirementsArraz[0] == "__"){
      //     requirementsArraz.splice(0, 1, "");
      //   }
          

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
                                  [{ text: [ 'TICKET-ID: \n \n', { text: SprintDataStoryNumber[0], style: 'mediumText', alignment: 'center', pageBreak: 'before' }, '\n \n'], colSpan: 3 }, '', '', 
                                   { text: [ 'TITLE: \n \n', { text: SprintDataStoryName[0], style: 'bigTextBold', alignment: 'center'  }, '\n \n'], colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                   { text: 'PRIORITY:\n' + '\n \n', colSpan: 2, rowSpan: 2 }, ''],

                                  [{ text: 'EPIC:\n' + '\n \n', colSpan: 11 }, '', '', '', '', '', '', '', '', '', '', 
                                   { text: ['GROOM: \n', { text: SprintDataStoryGroom[0], style: 'bigText', alignment: 'center' }, '\n'], colSpan: 2, }, '', 
                                   { text: 'CORR: \n' + '\n \n', colSpan: 2 }, '', 
                                   { text: 'REAL: \n' + '\n \n', colSpan: 2 }, '', '', ''],

                                  [{ text: [ 'STORY: \n \n', { text: SprintDataStoryDescription[0], style: 'mediumTextBold', alignment: 'center' }, '\n \n'],colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                   { text:'NOTES:\n \n \n \n \n \n \n \n ', colSpan: 6 }, '', '', '', '', ''],

                                  [{ text: 'ACCEPTANCE CRITERIA: \n \n' + SprintDataStoryDescriptionRequirements.join("\n"), colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                   { text: 'DEFINITION OF DONE:\n\n __ Responsiveness \n \n __ Internationalization \n \n __ Code Review \n \n __ Documentation \n \n __ Testing by ....... \n \n __ Bug-fixing by ....... \n \n __ Linting & beautify Code \n \n', colSpan: 6 }, '', '', '', '', ''],
                              ]
                          }
          
                      }






              ],
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

              }
              
            }

          
            
          


            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();

            


      }); // close btnOpenPDF




    
    

      // create PDF (using PDFmake)
      $('#btnSavePDFSprint').click(function () {

          var dashCheck = requirementsArraz[0];

          if(dashCheck.match(/-/g)){
          }
          else{
            for(var i=0; i < requirementsArraz.length; i++){
               requirementsArraz[i] = " - " + requirementsArraz[i];
            }
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
