$("#controlsSprint").submit(function() {
  new AhaApi({
    accountDomain: $("#subdomain").val(),
    // Replace this with your client ID.
    clientId: "f5bc99e0ae866bc03dd5a49b7bcb0ff3a2686eb216c2b339aa4dd1f44688efd2", 
    // Replace this with your redirect URL.
    redirectUri: "https://w1-scheffersdylan.github.io/"
  }).authenticate(function(api, success, message) {
    //var productKey = $("#product-key").val();
    var productKey = "WEB";
    var sprintNumber = $("#sprintNumber").val();
    
    // Hide the controls.
    // $("#controlsSprint", "#controls").remove();


    //api.get("/products/" + productKey + "/features/WEB-296", {}, function(response) {
    api.get("/releases/" + sprintNumber + "/features/", {}, function(response) {

    // fade effect if you pressed the "show story" button
    $("#step1Container").fadeOut();
    $("#sprintstep2Container").fadeIn();
              
    // alerts for test
    //alert(JSON.stringify(response.features));
    //alert( response.features[0]["name"] );


      //////////////////////////////////////////////////////////////////////////////////////////////////
      // GET ALL DATA FROM STORIES

      // Get all names from the stories
      var SprintDataStoryName = [];
      for( i = 0; i < response.features.length; i++ ){
        SprintDataStoryName.push(response.features[i]["name"]);
      }

      // put all ticket-id's in an array
      var SprintDataStoryNumber = [];
      for( i = 0; i < response.features.length; i++ ){
        SprintDataStoryNumber.push(response.features[i]["reference_num"]);
        console.log(SprintDataStoryNumber);
      }

      // get all grooming points in an array
      var SprintDataStoryGroom = [];
      // get all story descriptions in an array
      var SprintDataStoryDescription = [];
      // get all epic in an array
      var SprintDataStoryEpic = [];
      // get all title in an array
      var SprintDataStoryTitle = [];

      
      // get all data from all stories in the sprint
      function fectchSprintDataStoryGroomDescription(number){
        
        api.get("/products/" + productKey + "/features/" + SprintDataStoryNumber[number], {}, function(response) {

          SprintDataStoryDescription.push(response.feature.description.body.replace(/(<([^>]+)>)/ig,"").replace(/&nbsp;/gi,' ').replace(/&amp;/gi,' '));
          SprintDataStoryTitle.push(response.feature.name);

          // check if their is a epic
          if( typeof JSON.stringify(response.feature.initiative) === 'undefined'){
            SprintDataStoryEpic.push("");
          }
          else {
            SprintDataStoryEpic.push(response.feature.initiative.name);
          }


          // check if their is a grooming point
          if( response.feature.original_estimate === null ){
            SprintDataStoryGroom.push('');
          }
          else {
            SprintDataStoryGroom.push(response.feature.original_estimate.toString());
          }

          fectchSprintDataStoryGroomDescription(number + 1);
           
        }); // close api.get 

      }


      // init the looping
      fectchSprintDataStoryGroomDescription(0);



      // add story numbers to requirement and notes array
      var SprintDataStoryRequirements = [];
      var SprintDataStoryNotes = [];
      for( var i = 0; i < SprintDataStoryNumber.length; i++ ){
        SprintDataStoryRequirements.push([SprintDataStoryNumber[i]]);
        SprintDataStoryNotes.push([SprintDataStoryNumber[i]]);
      }
      

      // Show all data and get all requirements
      function fetchSprintDataStoryRequirements(storyNumber){

        api.get("/products/" + productKey + "/features/" + SprintDataStoryRequirements[storyNumber][0], {}, function(response) {

          // show all data on webpage
          $("#requirementsDetails").append("<tr class='bold'><td> Ticket-ID: </td><td>" + SprintDataStoryNumber[storyNumber] + "</td></tr>");
          $('#requirementsDetails').append("<tr><td> Story Title: </td><td>" + SprintDataStoryTitle[storyNumber] + "</td><tr/>");
          $("#requirementsDetails").append("<tr><td> Groom: </td><td>" + SprintDataStoryGroom[storyNumber] + "</td><tr/>");
          $("#requirementsDetails").append("<tr><td> Story: </td><td>" + SprintDataStoryDescription[storyNumber] + "</td><tr/>");
          $("#requirementsDetails").append("<tr><td> Epic: </td><td>" + SprintDataStoryEpic[storyNumber] + "</td><tr/>");


          // get all requirements and show them
          for( var i = 0; i < response.feature.requirements.length; i++){
            SprintDataStoryRequirements[storyNumber].push( " __ " + response.feature.requirements[i]['name']);
            $('#requirementsDetails').append("<tr><td> Acceptance criteria: </td><td>" + SprintDataStoryRequirements[storyNumber][i + 1] + "</td><tr/>");

          }
       
          // empty table row for better overview
          $("#requirementsDetails").append("<tr><td> &nbsp; </td><td> &nbsp; </td><tr/>");

           fetchSprintDataStoryRequirements(storyNumber + 1);

        }); // close api.get 
        

      }

      // init requirement looping
      fetchSprintDataStoryRequirements(0);



      // get all comments from a story
      function fectchDataStoryComments(number){
        
        api.get("/features/" + SprintDataStoryNotes[number][0] + "/comments", {}, function(response) {

         
          // get all comments
          for( var i = 0; i < response.comments.length; i++){
            SprintDataStoryNotes[number].push(" __ " + response.comments[i]['body'].replace(/(<([^>]+)>)/ig,"").replace(/&nbsp;/gi,' ').replace(/&amp;/gi,' '));
          }      
     
          fectchDataStoryComments(number + 1);
           
        }); // close api.get 

      }

      // init the looping
      fectchDataStoryComments(0);

       

      // fade effect to go back to fill in a new story/sprint
       $('#btnNewSprint').click(function () {
          $("#sprintstep2Container").fadeOut();
          location.reload();
       });
                                                                                                                                                                                                                                             
            
//////////////STEP 3: CREATING THE PDF////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var docDefinition;

function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            alert('VIDEO HAS STOPPED');

var docDefinition = {
       
          pageSize: 'A4',
          pageOrientation: 'landscape',
          pageMargins: 20,
          content:[],
              // some style for the PDF
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

            // for loop to get all of the stories one by one and show them all on a different page in the PDF
            for( var i = 0; i < SprintDataStoryNumber.length; i++ ){
               docDefinition.content.push({
                    
                    // sablono logo
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABTUAAAEsCAYAAAASH1fVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQwOUU2RUI3OTQyMjExRTU4NjNBQzI2QjAzMTc2NkRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQwOUU2RUI4OTQyMjExRTU4NjNBQzI2QjAzMTc2NkRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDA5RTZFQjU5NDIyMTFFNTg2M0FDMjZCMDMxNzY2REEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDA5RTZFQjY5NDIyMTFFNTg2M0FDMjZCMDMxNzY2REEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5/q01cAAB9mElEQVR42uyd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',

                    height: 27,
                    width: 120,
                    //fit: [100, 100]
                     
                    });

              docDefinition.content.push(

                    
                                            
                    {
                        color: '#444', // looks better than black
                        pageBreak: i !== SprintDataStoryNumber.length - 1 ? 'after' : undefined,
                        table: {
                            // grid system for the width 5% * 20 = 100%
                            widths: [ '5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%','5%' ],
                            heights: [ '10%', '10%', '40%', '40%' ],
                            
                            body: [
                                [{ text: [ 'TICKET-ID: \n \n', { text: SprintDataStoryNumber[i], style: 'mediumText', alignment: 'center' }, '\n \n'], colSpan: 3 }, '', '', 
                                 { text: [ 'TITLE: \n \n', { text: SprintDataStoryTitle[i], style: 'bigTextBold', alignment: 'center'  }, '\n \n'], colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'PRIORITY:\n' + '\n \n', colSpan: 3, rowSpan: 2 }, '', ''],

                                [{ text: [ 'EPIC:\n', { text: SprintDataStoryEpic[i], style: 'mediumText', alignment: 'center' }], colSpan: 11 }, '', '', '', '', '', '', '', '', '', '', 
                                 { text: ['GROOM: \n', { text: SprintDataStoryGroom[i], style: 'bigText', alignment: 'center' }, '\n'], colSpan: 2, }, '', 
                                 { text: 'CORR: \n' + '\n \n', colSpan: 2 }, '', 
                                 { text: 'REAL: \n' + '\n \n', colSpan: 2 }, '', '', ''],

                                [{ text: [ 'STORY: \n \n', { text: SprintDataStoryDescription[i], style: 'mediumTextBold', alignment: 'center' }, '\n \n'],colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: ['NOTES:\n \n', { text: SprintDataStoryNotes[i].join("\n") }, '\n \n \n \n'], colSpan: 6 }, '', '', '', '', ''],

                                [{ text: 'ACCEPTANCE CRITERIA: \n \n' + SprintDataStoryRequirements[i].join("\n"), colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'DEFINITION OF DONE:\n \n __ Responsiveness \n \n __ Internationalization \n \n __ Code Review \n \n __ Documentation \n \n __ Testing by ....... \n \n __ Bug-fixing by ....... \n \n __ Linting & Beautify Code \n \n __ Quality assurance by PO' , colSpan: 6 }, '', '', '', '', ''],
                            ]
                        }
                    }
                  );


                }

              
            





        }
    }, 10000); // 10 seconds
}










  


























      // create PDF (using PDFmake)
      $('#btnPrintPDFSprint').click(function () {
          

        // remove ticket id from array of requirements
        for(var i = 0; i < SprintDataStoryRequirements.length; i++){
          SprintDataStoryRequirements[i].shift();
        }    

        // remove ticket id from array of notes
        for(var i = 0; i < SprintDataStoryNotes.length; i++){
          SprintDataStoryNotes[i].shift();
        } 


        // Print the PDF
        pdfMake.createPdf(stateChange(-1)).print();
            
            
            
          

      }); // close btnOpenPDF




      // create PDF (using PDFmake)
      $('#btnOpenPDFSprint').click(function () {
          
               // remove ticket id from array of requirements
        for(var i = 0; i < SprintDataStoryRequirements.length; i++){
          SprintDataStoryRequirements[i].shift();
        }    

        // remove ticket id from array of notes
        for(var i = 0; i < SprintDataStoryNotes.length; i++){
          SprintDataStoryNotes[i].shift();
        } 


        // open the PDF in a new window
        pdfMake.createPdf(docDefinition).open();
            
            
            
          

      }); // close btnOpenPDF




    
    

      // create PDF (using PDFmake)
      $('#btnSavePDFSprint').click(function () {
 
               // remove ticket id from array of requirements
        for(var i = 0; i < SprintDataStoryRequirements.length; i++){
          SprintDataStoryRequirements[i].shift();
        }    

        // remove ticket id from array of notes
        for(var i = 0; i < SprintDataStoryNotes.length; i++){
          SprintDataStoryNotes[i].shift();
        } 

        // Save the PDF
        pdfMake.createPdf(docDefinition).download("Sprint_" + sprintNumber + ".pdf");


          
      });



    }); // close api.get
 



  }); // close authenticate 
  return false;
});
