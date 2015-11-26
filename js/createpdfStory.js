//WIP
function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
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
    //alert(JSON.stringify(response, null, 4));

    // variables
    console.log(response.feature)
    var storyDataNumber = response.feature.reference_num;
    var storyDataName = response.feature.name;
    var storyDataGroom = response.feature.original_estimate.toString();
    var storyDataDescription = response.feature.description.body;
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
      var storyDataEpic =response.feature.initiative.name;
    }

    $("#step1Container").fadeOut("slow");
    $("#step2Container").fadeIn("fast");

    $("#ticket-id").text(storyDataNumber);
    $("#title").text(storyDataName);
    $("#groom").text(storyDataGroom);
    $("#epic").text(storyDataEpic);
    $("#story").text(storyDataDescription);
    
     // show data of story
    //  document.write('<img src="./images/sablonoLogo.png" style="position: absolute; top: 25px; right: 25px; width: 20%;" /><p><input type="submit" class="btn right" id="btnOpenPDF" value="OPEN story as PDF"></input> <input type="submit" class="btn right" id="btnSavePDF" value="SAVE story as PDF"></input></p><p><input type="submit" class="btn right" id="btnNewStory" value="New story"></input></p>');
    // document.write("<h2>Story details</h2>");

    //   document.write("<table>");

    //     document.write("<tr><td id='storynumberThing'>Story number:</td><td> (TICKET-ID)</td><td>");
    //     document.write(storyDataNumber + "</td><tr/>");

    //     document.write("<tr><td>Story name:</td><td> (TITLE)</td><td>");
    //     document.write(storyDataName + "</td><tr/>");

    //     document.write("<tr><td>Story grooming: </td><td> (GROOM)</td><td>");
    //     document.write(storyDataGroom + "</td><tr/>");

    //     document.write("<tr><td>Story epic:</td><td> (EPIC)</td><td>");
    //     document.write(storyDataEpic + "</td><tr/>");

    //     document.write("<tr><td>Story description:</td><td> (STORY)</td><td>");
    //     document.write(storyDataDescription + "</td><tr/>");      

    //   document.write("</table>");

    //   document.write("<br />");

    //   document.write('<p> <input type="text" placeholder="Add requirement by hand to PDF" id="addRequirementValue"></input> <input type="submit" value="Add requirement" id="addRequirement"></input></p>')
      

      var requirementsArraz = [];
      function fetchARequirement(number){
        
        api.get("/requirements/" + storyNumber + "-" + number, {}, function(response) {

          requirementsArraz.push(response.requirement.name);
          $('#requirementsTable').append("<tr><td>Story requirements: (ACCEPTANCE CRITERIA)</td><td>" + response.requirement.name+ "</td><tr/>");

          // console.log(requirementsArraz);

          fetchARequirement(number + 1);
           
        }); // close api.get 

      }
      
      // init the looping
      fetchARequirement(1);



      $("#addRequirement").click(function() {
        if( $("#addRequirementValue").val() != "" ) {
           requirementsArraz.push($("#addRequirementValue").val());
           $('#requirementsTable').append("<tr><td>Story requirements: (ACCEPTANCE CRITERIA)</td><td>" + requirementsArraz[requirementsArraz.length - 1]+ "</td><tr/>");

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
          pageMargins: 20,

              content: [

                    {
                     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAAAeCAYAAAArUOB+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzhCQUNFQzk5NDIwMTFFNThFMkE5QTQ5MkI4QkJEMTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzhCQUNFQzg5NDIwMTFFNThFMkE5QTQ5MkI4QkJEMTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphNmExNGM4NS05NDFmLTExZTUtYTgwNy1kNjQxODIxODg1ZDIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphNmExNGM4NS05NDFmLTExZTUtYTgwNy1kNjQxODIxODg1ZDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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',

                     // height: 20,
                     // width: 107,
                     fit: [100, 100]

                     
                    },
                                            
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
                                 { text: 'PRIORITY:\n' + '\n \n', colSpan: 3, rowSpan: 2 }, '', ''],

                                [{ text: [ 'EPIC:\n', { text: storyDataEpic, style: 'mediumText', alignment: 'center' }], colSpan: 11 }, '', '', '', '', '', '', '', '', '', '', 
                                 { text: ['GROOM: \n', { text: storyDataGroom, style: 'bigText', alignment: 'center' }, '\n'], colSpan: 2, }, '', 
                                 { text: 'CORR: \n' + '\n \n', colSpan: 2 }, '', 
                                 { text: 'REAL: \n' + '\n \n', colSpan: 2 }, '', '', ''],

                                [{ text: [ 'STORY: \n \n', { text: storyDataDescription, style: 'mediumTextBold', alignment: 'center' }, '\n \n'],colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text:'NOTES:\n \n \n \n \n \n \n \n ', colSpan: 6 }, '', '', '', '', ''],

                                [{ text: 'ACCEPTANCE CRITERIA: \n \n' + requirementsArraz.join("\n"), colSpan: 14 }, '', '', '', '', '', '', '', '', '', '', '', '', '', 
                                 { text: 'DEFINITION OF DONE:\n __ Responsiveness \n \n __ Internationalization \n \n __ Code Review \n \n __ Documentation \n \n __ Testing by ....... \n \n __ Bug-fixing by ....... \n \n __ Linting & beautify Code', colSpan: 6 }, '', '', '', '', ''],
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