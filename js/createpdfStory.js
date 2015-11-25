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
                        image: 'data:image/svg+xml;utf8, <svg x="0px" y="0px" viewBox="0 0 239.8 44.9" enable-background="new 0 0 239.8 44.9" xml:space="preserve"> <g> <g> <path fill="#757575" d="M9.2,19.9c4.7,0,7.2,1.7,8.9,5.2c0.2,0.4,0.1,0.7-0.4,0.9l-1.1,0.5c-0.4,0.2-0.6,0.1-0.9-0.3 c-1.3-2.6-3.2-3.9-6.6-3.9c-4,0-6.3,1.6-6.3,4.5c0,3.5,3.4,4,7,4.4c4.1,0.5,8.5,1.3,8.5,6.7c0,4.4-3.2,7.1-9.2,7.1 c-4.9,0-7.6-1.9-9.2-5.8c-0.2-0.5-0.1-0.7,0.4-0.9l1-0.4c0.5-0.2,0.7-0.1,0.9,0.4c1.3,3,3.5,4.4,6.9,4.4c4.4,0,6.8-1.6,6.8-4.8 c0-3.5-3.2-4-6.6-4.3c-4.2-0.5-9-1.2-9-6.7C0.4,22.7,3.6,19.9,9.2,19.9z"/> <path fill="#757575" d="M41,44.5h-1c-0.8,0-1.1-0.1-1.2-0.6l-2.5-6.5H25.7l-2.5,6.5c-0.2,0.5-0.4,0.6-1.2,0.6H21 c-0.5,0-0.6-0.2-0.5-0.6l9.1-23c0.2-0.5,0.4-0.6,0.8-0.6h1.1c0.5,0,0.7,0.1,0.8,0.5l9.1,23C41.7,44.2,41.6,44.5,41,44.5z M31.5,24.9c-0.4-1.2-0.5-2.2-0.5-2.3h-0.2c0,0.1,0,1.2-0.4,2.3l-4.1,10.4h9.2L31.5,24.9z"/> <path fill="#757575" d="M61.7,26.5c0,2.8-1.1,4.5-3.2,5.4V32c2.6,0.7,4,2.7,4,5.9c0,4.2-2.8,6.5-7,6.5h-10c-0.5,0-0.7-0.2-0.7-0.7 V21c0-0.5,0.2-0.7,0.7-0.7h9.6C59.3,20.3,61.7,22.5,61.7,26.5z M54.8,22.7h-7.5v8.4h7.5c2.8,0,4.3-1.4,4.3-4.2 C59.2,24,57.6,22.7,54.8,22.7z M55.4,33.3h-8.1v8.9h8.1c2.9,0,4.5-1.5,4.5-4.4C59.9,34.8,58.3,33.3,55.4,33.3z"/> <path fill="#757575" d="M69.8,21v21.1h11.5c0.5,0,0.6,0.2,0.6,0.7v1c0,0.5-0.1,0.7-0.6,0.7H68c-0.5,0-0.7-0.2-0.7-0.7V21 c0-0.5,0.2-0.7,0.7-0.7h1.1C69.7,20.3,69.8,20.5,69.8,21z"/> <path fill="#757575" d="M92.6,19.9c6,0,9.3,3.2,9.3,8.5v8c0,5.3-3.3,8.5-9.3,8.5s-9.3-3.2-9.3-8.5v-8 C83.2,23.1,86.5,19.9,92.6,19.9z M92.6,22.1c-4.5,0-6.9,2.3-6.9,6.3v8c0,3.9,2.4,6.3,6.9,6.3c4.4,0,6.8-2.3,6.8-6.3v-8 C99.4,24.5,97,22.1,92.6,22.1z"/> <path fill="#757575" d="M124.8,21v22.8c0,0.5-0.2,0.7-0.7,0.7h-1.1c-0.4,0-0.5-0.1-0.7-0.4l-10.8-15.6c-1.3-1.9-2.2-4.1-2.8-4.9 h-0.1c0,1,0.4,3.5,0.4,6v14.1c0,0.5-0.2,0.7-0.6,0.7h-1.1c-0.5,0-0.7-0.2-0.7-0.7V21c0-0.5,0.2-0.7,0.7-0.7h1.1 c0.4,0,0.6,0.1,0.7,0.3l10.6,15.3c1.4,2,2.4,4.3,3,5.1h0.1c0-1.1-0.4-3.6-0.4-6.3V21c0-0.5,0.2-0.6,0.6-0.6h1.1 C124.7,20.3,124.8,20.5,124.8,21z"/> <path fill="#757575" d="M138.4,19.9c6,0,9.3,3.2,9.3,8.5v8c0,5.3-3.3,8.5-9.3,8.5c-6,0-9.3-3.2-9.3-8.5v-8 C129,23.1,132.3,19.9,138.4,19.9z M138.4,22.1c-4.5,0-6.9,2.3-6.9,6.3v8c0,3.9,2.4,6.3,6.9,6.3c4.4,0,6.8-2.3,6.8-6.3v-8 C145.2,24.5,142.8,22.1,138.4,22.1z"/> </g> <g> <g> <polygon fill="#50E682" points="180,0 205.7,44.4 213.5,30.8 195.8,0 "/> <polygon fill="#28BE5A" points="205.6,44.4 189.9,44.4 197.8,30.8 "/> </g> <g> <polygon fill="#FFD200" points="153.7,0 179.3,44.4 187.2,30.8 169.5,0 "/> <polygon fill="#FFA000" points="179.3,44.4 163.6,44.4 171.5,30.8 "/> </g> <g> <polygon fill="#28C8DC" points="206.3,0 231.9,44.4 239.8,30.8 222.1,0 "/> <polygon fill="#00B4C8" points="231.9,44.4 216.2,44.4 224.1,30.8 "/> </g> </g> </g> </svg>', width: 150, height: 150,
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