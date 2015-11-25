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
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWsAAABECAYAAABHyxQvAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAU6gAAFOoBcZWGVwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7Z15QFT32e+/Z/YZBhgY9kVQEHGNiLuEmGg0MXGLDUab2tr2pm2W29i0aUx729w3aZb7pll80zRvXmNiajVGjSRqTNxSXHEBISggCDgM+7AMA7Mv5/6BjHNmWGZ+c46oPZ9/dA7zPPPMwDzn93t+z0LRNE2Dh4fn1sRlAqrGA/Z6bvSLYoFxVYAgjEhc69Bhg+5DOOFi2bA+JktS8R/qHxHLf6HrwR9q21i0iMmvEiPwv5MiOdPvieCmvAoPDw8ZAgUQ9xfu9DtagbbXiMWTRdFYpJjGokFMymzXcM5yhVh+RXQopiilLFrEZEuzHo1WB2f6PeGdNQ/PrY7qh0BIDnf6298CrNXE4mtD70WYQMGiQUy2GA7DTjuJZAUANqZEgWLXJDdWF4036zs40s6Ed9Y8PLc8FBD/Djj7utI2oOX3xOJKgQyrlbksGsSk1dmF/cazxPJTlTI8pFayaBGTbzp7cd5g5kx/P7yz5uG5HZBnAxHksdthMewFeg8Tiz8QMh2p4lgWDWKyq/cEuly9xPK/HaWGXMCdu3tV0wEnx6d/vLPm4bldiHuD+CDQL5o3ADRZ/FUACj8NW8SyQTcw0zZs7/kXsXysRISfJ6jYM8iLSpMVe3UGzvQDvLPm4bl9EMUC0eThimGxXAa6NhOLT5akYrYsk0WDmBw1leCqvYlY/qfxKiRKRSxaxOSdhk70OLnJigF4Z83Dc3sR/VtAOpY7/S1/AJydxOI/CVsIMcWNQ6RB4yPDtyCNNsgEFJ5LVrNqkycddif+u7GLM/28s+bhuZ2gJEDc69zpd3YCba8Qi8cKI7A8ZDaLBjGptDXgtKWcWP5BtRIzwuQsWsTk05ZuXLPYOdHNO2sentuNsEcA5f3c6e/4r76QCCGrlPMQKQxl0SAmnxgOw0qTO8QXU9QQcpTLZ6e5S+XjnTUPz+1I/NsAR+EG0A6g5XlicRklweOh97FoEJN2pwFfGguJ5TMVUqyM5u6g9miXESe7Tazr5Z01D8/tiGwiEPm/uNPf8zXQc5BYfL58CsZLklk0iMme3pPQObuJ5Z9NikSokDv397qmA06WO3nwzpqH53Yl9hVAyN2BGZp/AxCGGygAPwtbDIqj2kEb7cA/e74jlleLhfhlYgSLFjGpMdvweRu7qXy8s+bhuV0RRgIx/4c7/dZKoON9YvE0cTzmy6ewaBCT4+YyVNi0xPI/igtHqkzMokVM3m3ohN5BViY/ELyz5uG5nVE/Bcgmcae/7f8CjnZi8XVhC6CguGmkRAPXU/nIwg1iisLzo7jbmXQ7XHifxVQ+3lnz8NzOUKK+w0aucHYBbX8mFlcJQrBKOY9Fg5jU2JtRYC4jlr83IgR3q7hrQrW91YBqs40VXbyz5uG53VEuBEIf4k5/538DFnKHuCxkNuJF3PV83tZzDBaa3CH+fpQaIoqb2LqTpvGahnxn4gnvrHl47gQS3gE4CjeAdgLNzxKLiyghfhK6kEWDmHQ4e/BF72li+TS5BGtiuUvlO9NtRoE++FQ+3lnz8NwJSNIB9dPc6e89Bhi+JBafKRuHLGkaiwYxyTeeQZtTTyz/dGIkIkRCFi1i8qqmHTZXcKl8vLPm4blTiP0zIIrjTn/zbwDaSiz+07BFEHLkcuy0A1sNR4nlw0QCPJPEXSpfvcWOHW3keeEA76x5eO4cBKFA7H9wp99WC7RvIhZPEkXhgZBsFg1ictpSjss2DbF8Xkw4xikkLFrE5L2GLnTYyVP5eGfNw3MnEfkzQD6dO/1tLwOOZmLxx5TzOR0B9pHhEFyEqXxCCnghJYpli27Q63ThvQbyjoa8s+bhuaMQ9B02cjV10NUDtJAX4igFMjwWeg+LBjGps7fgqKmEWH52mBwLI0JYtIjJLp0BlSayzBXeWfPw3Gko5gHhj3Knv+tjwHyBWHyxIpvTEWD/7PkOpiBi68+nqCEVcJXKB7xOmMrHO2senjuR+DcBzsINLqDp1wBhuIHrEWDdLiN29Zwglk+WirEuLpxFi5icNZhxuNMYsBzvrHl47kTEyUDUc9zpN50GuncRi0+WpGKObDyLBjHZbzqHJgd5X+lfJkQgRsLdCLD/V98Ba4CpfLyz5uG5U4neCIhHcae/+beAi7zYY33Y/ZBS3DRSctBObO0hT+VTCAV4Nom7qssGqx2ftgSWysc7ax6eOxWBHIh7lTv9di3Q/haxeLQwHMs4HAF2znIFF601xPIrokMxRclRVSiAD5q6oAsglY931jw8dzKqtUBIDnf6da8B9npi8VXKeYgWchcf/thwGE6QTRynALyYEsVVXg1MThfe0fofquGdNQ/PHQ0FxL8Lzr7qLlPfRHRCpJQYPwy9l0WDmGgdOhwyFRPL36WU4eEoJYsWMcnX9eD7Xv8yVyiaHnr2TEdHB+rq6qDVatHS0gKz2QyLxQK73Q6pVAqpVAq1Wo3o6GikpaUhLS0NQiF3NfYAYDAYUF9fD5fLhcjISCQlJbGmu7W1Fa2trcTycrkcCoUC0dHRkEjIq6F0Oh2am/uKD+Li4hATE0Osi4Tu7m7U1dVBo9GgtbUVZrMZZrMZVqsVCoUCcrkcISEhSE5OxujRozFq1CiIxWTxR7vdjurqajgcDkilUowdOxYCAXvOxeVyoa2tza0/OjqaSI/FYoFGo4FGo0FDQwOMRqP7c5FKpe7PJDY2FqNHj0ZqaiqUSu6+6AHRsB7o+oQj5RQw5jjxCp4G8MeOrSi3ka/Qh0IpkOP96KcQKiCbat5qc+DBUi3MLrIV+nBMVcqwfWLisCv4AZ01TdMoLS1FYWEh6urqMIw/ZyCTyTBz5kzMnz+fkz9Ul8uFt956C21tbe5rGzZsQHx8PCv6X3nlFRgMwY/jEQgESEhIQFZWFmbMmAGZTBaQ/Ouvv47Ozr5qp9jYWDz3HIcn+9ehaRpXr17FyZMnUVlZGdDvXSqVYurUqcjNzQ3YGZ4+fRr5+fnuxzk5OVi2bFlAOobim2++wbFjxwD0/V5efvnlgG4sOp0OZ86cwdmzZ2G3+z/miqIoZGZmIicnB2PHjg3YblZxtAJXMgAXu6Om3MizgfRzIF3B19qb8dv2j4gHCQzHwyEz8bOwxcTyf2/swqYgqg+H46/psViiHtpfCl966aWXPC90dHRg27ZtKCgoQFdX4FMOHA4HNBoNCgsLoVKpWHOi/VRWVuLUqVOMa0KhEJmZmazoP3LkCBwOR9B6aJqGwWBAVVUVzp07h7i4OERF+V/KeuzYMdhsfZVOUqkUOTkcxh0B9Pb24h//+AcOHz6M9vbAk/adTicaGxtRWFgImqYxZswYUH72CL569SquXr3qfqzVapGcnBzQ5zUU5eXlqK/vW7XRNI358+dDJBo+LcvlcuHIkSPYtm2beycXKO3t7SguLkZzczMyMjKIdx9BI1D2BWF7yTMkhsTRDEjTAdldROIRwlDoXN2os7ewbFgfNfZmzJZnIlxAVp04WSnD/o4e9Di5WV1/32vF6tgwiIf4zjD+Yuvr67F582ZYLJYBnxwREYHQ0FBIpX0npHa7HV1dXeju9k1BsVqt+Oyzz9Da2ooHH3wwmPfB4OzZsz7XioqKsGTJkpH7IgyD0WjExx9/jNWrV2PatGkjbY4PGo0Gn3zyCYxG30R9lUqF1NRUqNVqyOVySCQSmM1mGI1GNDY2or6+nrHadLlcOHz4MLRaLdatW+eXU/SGpmns2bMHGzZsgELBXR+JoTCZTNi8eTMaGhp8fiaXy5GSkoLY2FiEhIRAJpPBarXCZDKhra0N165d8/ksL126hKamJvz85z9n7SYUMFHP9VUfWqu50d+yEQhb2XdjIODx0PtwxlwRVPXhYDjhwhbDIbwU+TiRvExA4blkNX5zlTxEOhQtNge2NHfjqSGG+Lq/SS0tLT6OmqIoTJ48GVlZWUhLSxt0K280GlFRUYEzZ85Aq2UOsPzuu+8gk8lw773BHyJ0d3ejsrISQN+NQ6lUQqvVwmKx4Pvvv0d2NrsdvcLDw7F06dKAZCwWC1paWlBeXu4OYwB9Dmj37t1ISEhAXByHbSwDpKOjw8dRCwQCZGdnIycnZ9idkcPhwMWLF1FQUMAITVVWVmLXrl147LHH/F5he9Ld3Y38/HysXbs2YNlgcTgc2Lp1q4+jTktLQ25uLjIzM4d8TzRNo6amBgUFBbhy5Yr7emdnJ7Zs2YKnn356ZG5ClASIewPQPMKNfnsjoHsDiH2ZSFwlCMEPlDn4NIj86KEotdahyHoV2dJ0IvkH1UrsaDPgvMHMsmV9bG7qwsqoUCRIB17giIAbKxlPRx0TE4M1a9YgMTFx2BcJCQnB9OnTMX36dBQXFyM/P5+h69tvv0VKSgrGjBkT1Ju5cOGCeysaHh6O2NhY983h7NmzrDtrqVSKKVPIpjMvXboUhYWF2Ldvnzus4nA4cOjQIaxbt45NM4lxuVzYunUrw1GrVCqsXbsWqampfukQiUSYMWMGsrKycODAAUaI6uLFi0hOTg4ohBMSEuK2p6SkBBMmTMDUqVP9lmeDgwcPoq6uzv1YJBLh4Ycfxty5c/2SpygK6enpSE9PR1FREfbu3esOabW3t2Pnzp1Yv349J7YPS9hKQLkI6D3EjX7dm0DEzwBJKpH40pBZOGIuCar6cCg+MnyLKVGjIabIkiBeTFHjB5ca4OQgtG5x0Xhb24H/TB+4b4oAAMrKyqDR3OgDGx0djSeffNIvR+3NtGnT8Itf/AJy+Y2TV5fLhV27dsHpJO/lStM0zp07534cHx+PtLQbkyeuXbvGWNmNNBRFYc6cOXjkEeYq5vLlywOGG0aCkpIStLTciBEqFAo88cQTfjtqT0QiEZYvX4577mF2VDt69CisVv+3tZmZmUhJSXE/zs/PHzDMxhV6vR5nzpxxP6YoCo8++qjfjtqb7OxsrFu3jpHdUlFRgdra2qBtJSbh7b5Bu1xAW4CW3xOLcz0CrNnRiYMm8iZUmQopHonmbgTYgY5eFPUMHIYWAH0rIE9WrVoV1DYtMTERP/zhDxlbxY6ODsaXIFCqq6sZB57jxo1Deno64zUGimePNNnZ2YywR3/Gxa1Af4ZEP3l5eUHHU5csWcJwtkajEYWFhX7LG41GLFu2zP17NZlM+PzzzwPKTAmG48ePMw6Y58yZg6ysrKB0ZmRk4L777mNcO3qUo4M+f5BOACKf4E5/9+eAsYBYfIYsg9MRYDt7CqB3kS+Yfp0UiVAhN3nrNPpGgA10jClwuVyMuFpMTEzQ4Qqg7w90zpw5jGvl5eXE+jwdsVKpxLhx46BUKhkpUUVFRaxkcrAJRVGYOHEi49qtsAPo7Oxk2DFq1ChMmDAhaL0URWHxYmaKVCC/d6PRiOTkZIwff6PJT3V1dVA3+kCoqKhw/18sFvs4WVJyc3MZC6Da2tpBD/JvCrEvA0I1d/qbnu0btEsIlyPATLQVn/WQ30zUYiF+NcRBYLCUG634qr3H57rAYDAwHFxycjJrL7po0SKoVCrIZDLcc889WLNmDZGe3t5exhd++vTp7sKbGTNmuK+bTCZcunQpOKM5wDvv+FYIg3iv7oNdPXqSnp4OlUrlfqzRaPx2TP2fzQMPPMAIHRw4cIDzm5xer0dHx41Y6dixYxEWxs6WVyaTYdKkSe7HTqdzZEMhwkgg9k/c6beUAPpPiMWTRFF4MIS7iTeHTcW4ZifP7PhRXDhGy7jLPnuzvgO9XmmCAu94IJun1AqFAhs2bMAf//hHPPTQQwgNDSXSc+HCBXe8m6IohoOeNGkSQkJu5E56xrVvFbxTCknyddnGu0ozPZ3shHwwPHc8LpfL76rQ3t5eAH1Vm55pjna7HTt37gzq3GM4POP3ABhnImzg/Rk3Njayqj9gIp8EZJOGfx4pLS8CTvLzhseU93A2AswFGlsM5IesIorC8xyOAOuwO7G5iTmtXeBd1stG9Z4n/bm5pHgfLI4ZM4axUhUKhYxVYU1NDVFRB5d4H7B5Hr6OFCYTs7WlWs3ultg79u3vbsJms7l3ekuWLGF8VlqtltNYr9nMTMm6VT4TzqBEQPw73Ol3tAG6vxCLhwhkWBs6nz17vCizXUOhpZJYfr5KgVwVdymYW5r1qLfcqGEQhIczO15ptdpbYuXXj7fznTlzps9zPK95O/dbAc+tNeAbFhkJPMMSEomEqHhlKDx3O8CNFbM/9N/clEqlT0HVsWPH3NWIbOMdqvF+D8HirW/EnTUAKBcAYYHVEgRE+7uAtYpYfJFiGtLE7FZBe/KJ4QjsNPk51+9HRUFEUEfgD3aaxl89uvIJwsLC4OmwOzs7UVpaysmLk+DpeBUKBSZPnuzznLi4OEYzJ8+wya2A5wEuRVGsb69J8Px8uKj89Hb+gRz89uckA8CsWbMYn5fL5cLOnTsD6tHhL942sn0D8/6cuXgPRMS/DVAc9W2mbUDL88TiFCj8PGwxZ21KW51d2GckzyIbIxdjbSx3qXyHOo043d234xMA8Cn82L17N2pqyJt2s4X3geG0adMG/QJ5xrG9DyRHkoqKCkYlXHp6OiIiuDtJvhPwdGIURSEvL49RPavT6bB///6RMO3ORJIGqJ/hTr/hS6DnW2LxTEky5siCz1QajF29J9Hl8n/n581TiZGIEHHXafQ/69vhpK8769zcXEZc2W6348MPP8QXX3wxomlmFy5cYKx2PB2yN1lZWYyVy62Qc63RaLBz5073Y5FIhCVLloygRbcH3jnVERERWL58OeNaYWGhu/UADwvE/gkQcRduQPNvgCDCDVyOALPQNvyz5zti+TCRAM9wOAKs0mTDHp2hz1mHh4dj5cqVjAITmqZRWFiIN998E++88w6++uorFBcXo76+/qbF2s6fP+/+f0pKypB9KrxTo6qrq31ixVzjcDhgMBhQUVGBzz77DB988IH7IE8gEGD16tVEVaE8fcVFd911o6Nbf68V74NSHkIEoUDor7nTby0Her8hFo8ShmG+mLvMlWOmUhiCmCeZFxOGZAl3q+stzfobjZz6+2rk5+f7ZC80NTWhqamJcU0ul0OtViMyMhJqtRoJCQlISEhg7fCsrq6Oke41a9asYWVmzJjhrsakaRoXLlzwKdAIhLa2Njz/PHm8rZ+4uDj84Ac/wKhRHA4v/TdgxYoVqKurc2csGQwG7N69+5bptXJbQzuAom1A8jhAfGX45weKJA1Q3k8s3mLtwLbKg0gfPRrdFPuNlObIxgeVJnigrQuabgMEshBwEWBfGxvObJGanZ2N0aNHY//+/SgvLx8yK8RsNqOhocGnM5lKpUJmZiZmzpwZ1AQXzzCGvw2V0tLSoFar3Svq8+fP4/7772d16kigSKVSzJs376ZPerkTCQkJQV5eHj766CN3qOTSpUsoLi6+JVvP3lZUbAL0lwCMBcZQANtDABLeCeoQ8/Xqbeiw6TGxCwDLEQcxJcKPwxYQy9tcNH5XUY8qowULQxVocLDrrdPkEqyNDfOt54yMjMS6devwwgsvYPHixRgzZkxAY7r0ej0KCwuxadMmfPjhh9DpdAEbZzabUVZW5n6clZXlV642RVGMznsGg2HE45pWqxV79uzBG2+8gaKiohG15U4gIyPDZ5eVn58PvV4/iATPsFjagNLrbU311YCJ5cpB5UIg9GFi8aLuKzik6wuJntSVIMGpGkYiMJaHzEaMkFznW3XNqDL2pX2WdBogYnll/ftRaogoCoPmJqlUKixYsAALFiyA3W5He3s72traGP92dXUNmT979epVvPvuu8jLywuo1WhxcTEjI8CfEEg/M2bMwJEjR9y7grNnzxL3vCDpZ+1yuWAymaDValFRUeGOqRqNRuzcuRMdHR1YtGgRkT08fTz88MOoqalxLwQsFgt27NiBX/7yl0S9s//tKf4DYPO42V2rA8bLATbCDUEW3jhpF16p+sQ97stF02jXtYOKE7MyAkwlCMFKJVlHRQBotdrx2tUbIeJ2mx13UU400uzEr++LCMHd1wtv/EokFYvFiI+PH/CAr39aTGtrK+rq6lBWVsZoaWmz2bB9+3YoFAq/S5o9Dxbj4+MDOpQLDw/H2LFj3bnNV65cgV6vZ/Sq8Jdg+lkDfe/9yJEjKCgocG/bjxw5goSEBMZhKE9gSCQS5OXl4e9//7v7plxXV4eTJ0/i7rvvHmHrbjM6LwJXP2Zes7QD+rlAxOng9aufAWQTh3/eIHzedAyVvcwiqO/1V7Ek8m7USgLftXuzLmwhFEGEZ56vrIfBwazpONGux11RavQEWVsopij8btSNKtqgg7lisRgxMTGYPHkyli1bho0bN2LNmjWMYbmB9LOur69nHGZ6d+7zB88UP5fLhQsXyPvXBoNEIsGSJUt8DjkPHDhwS1WJ3o6kpKT4TB86ePBgUJPp//2ggXODdMfTXACcCcGpF8UAMeTNogwOI/6rbveAPyttroQM5G0sAGCMOB7z5b5Fdv5S1G3Etkbf1hY2Fw2R3TaARGD8OD4cqR7NoljvQC4QCJCVlYXU1FS8//777lV2V1cXysrKhp364V0qfvny5YD7P3vfFM6dO4f77rtvxA4a7733Xly8eNHtSDo6OlBbW8t686R/N+6//35UVVW5pwU5HA589tlnePrppxnnLGxXIt4x1O4AWo8P/DOXDWiNBxKaBv65P8T+BQgiFrypbje67L6tQgGg0azDZONYXAshmzhOAdcrI8nCZjSApy5dg2uQSMyZLgPuiY1CK2EhtVosxC8SmMVznP0VR0REYMWKFdi6dav7Wnl5+ZDO2maz+ZS6e5Zqk6LX61FVVcXaBPRA6T/4/Prrr93XqqqqeGcdJAKBAHl5eXj33XfdxVONjY04evQo41yAd9YD4DABxRuHfk5LERA1CZAQtB2WZwER5KPLaoyN2Nk4dNOuE03FmDZ2MnQY2KEPxd3ySRgvIW8HvbVBh7P6oasem41GCGUK0AQ3hN+NUkPpNeCA06XmhAkTGP2AvXO1vSkuLg5oBFQgjHRzJ+8c65HerntWe3r24mALb53BdF4citjYWJ9mT9999x3j8/W394m3jWz37rhZn4lflL0KGP1oiKU1IXA3QfUdKhLOOQSA167+A45hhhcYnRYIOgOvipRQIjweSj5UosfhxIuV2mGfV9VrxiiC1JCJIVIsjfJtJ83pkoOiKERHR7uLGHp6hr4DejvUnJycoFZFZWVl7pzriooKGAwG1prJB4r36450xzXPDnB2ux12u53Vhk7e74/tDnae5OTkoKKiwh0uczqd2L17N5588klQFOV3j3auu+J56/M817mpGOuB8rf9e253LWCaAygCmNSjWgOE5JLZBuCw7jxOdZYN/0QAJ3QluD98HjRC/9siP6Kch2hh+PBPHISXqxvRbPXvRl7U0Y3ECBWsg8VLvKAA/Ck1asDbo8hisaCoqAjFxcWYM2cOpk9nN8fSe3DuYDQ3NzMKbJKTk7Fs2bKgXlulUiE/Px9A3xe4qKjI51DqZuEdLx/pA0ZvR9Ha2hpUEZM33j3FuXTWFEVh9erVeOutt9w9qTUaDUpLSzF16lS/X9v7M2lra/MZyRYMN/MzGZLzG/rCIP5SVwFMCAMoP3rdC+RA3GvEptlcdrxZs8Pv57toGg2tTRAlyuCgh/9OqYVhWB4SeNJCPzUmCzZd839X3G63YyocaIB/u4wV0aGYopQN+DPBX//6V3z55ZfQarX45ptvWN/6ea6mh5oU4z1jb6imTf4ybdo0n+ZON2vwqjfe+ehsTuQhwTsdku0hvp76RCIRY2gwF4SHh/s0ezp48CAcDoffTjE+Pp5xMFldXc2qjd762Lw5+k3zMUDzRWAyVj2g9zOFNfpFQEzeVmGL9gDqzYGFCC8bajHG6l+bix+HLoAsiIZQz17WwBrgQut4ux4RwuHDISFCAZ4doiGUIDY21v3AYDDg1KlTARkyFDabjRGn9h504Pm8kpIS92OxWMxo2kOKTCZjrIw6OztHrPVrf8ZCPyR532ySlpbGcEznz59nbbVfXV3NyLVPTU29KfHZadOmMf5uurq6cPz4cb+dtVQqZZwt1NbWElXgDoTZbMbly5fdj0UiESuDqQOCdvatqkm4Vgg4U4Z+jngUEPUbMv0AWq1d+B/NPiLZs41lCMPQC6BxkiTkyMnrG460d2N/W+CVsjYXDdo2/AzSXyVGIEYyeNhX4B0WOHToEGuHXxcvXmSs1DMyMgZ8XklJCWNKx5QpU1gbfeU9WWakWqd63owA9mceBopMJmPYoNPpWDmEdblc+OYbZne1m1kA9MgjjzAWBceOHQtoEIWnrQO9F1L+9a9/McaGZWRkcDL0YUiu/B3o+p5MlnYArcPMHEx4GwiiGdKbNdthcpJNfG+1diKqd3CfQQH4WRBDDBw0jWfLNYTSQGFXD5KGOGwcJRPjR7FDx9EFaWlpjOGmDocDH330UdC9Frq6uhipahRFDfql9XYSbIRA+ulv7tTPpUuXAhoxxQbnzp2DRnPjFy2RSDBu3LibasNALFq0iFGe/dVXXzHsJGH//v2MXURYWBirv8/hkMvlWLVqlft92Ww2FBQU+F2GPnv2bIazLysrQ0FBQVA2VVZWMnRQFIUFC8gbBxFh7QRKXgpOR0sRYBukYZbyPiDsEWLVJd3VONAawCHmABxrPo9EeuAwwnz5XRgrJi/y2VTXgss9wZXf1xl6IBjkz3BjShQkg/3wOgIAWLVqFWObqtfr8d5776Guro7IKK1Wi/fff5+xkpg+ffqA7VNbWloYM/UiIyMxevRootcdCO/mTk6nE8XFxazpHwqXy4UTJ05g7969jOu5ubm3xNDc5ORkxg3U4XBg8+bN7jazgWCz2bB7926cPHmScf3BBx+86SvIzMxMRj+Z4uJiv88qxGIxFi5cyLj29ddfY9++fUSj4s6cOYNPP/2UEWKaOnUqkpPJc3yJHCuuowAABd1JREFUuPhHwMpCf/d6PXySyChh32gwQlw0jVevfhp0rw+L0wZHl8Vn9SyjJHg8lDyxoM1mx8tXg59EX2OyIHWAKMeccDnm+zF4VwT0OchHH30U27dvd/9RGwwGfPDBB5gyZQpycnIwatSoIVcnLpcLNTU1OH/+PEpLSxlfjvDw8EEnpHiHJWbOnMl6M56Bmjvdfffdw76Ow+HwaQE7HBaLBb29vWhsbERZWRk6O5kVVklJSZg/f35AOq1WKyvhG7lcjsmTJzPed15eHtrb29Hc3Ox+rR07duDcuXPIzc1FRkbGkF0XTSYTioqKcPLkSXR1dTF+NnfuXMaN8maydOlSRrOnQJg1axYaGhrcnzlN0zhx4gTKy8uRm5uLrKwsxpgxb5xOJ8rLy3H8+HGfnUpiYiJWrVoVsE1Bob8MVP0PO7oMtYDxbiDkxI1rkb8CZOQ9dL5o+RfKDLUsGAccb7uIh1X3oFrQ4r62SjkPkcLBkxuG4w+VDdDb2ZnpeqZdj1SVCubr7lFIUXgxZZjw0nXcfv6uu+6C2WxGfn6+26nRNI3S0lKUlpYiNDQUiYmJiI6OhlQqBUVRsNlsMBqN0Ol0aG1t9ZkODfRtg5944okBD3nsdjtjlSsQCDjpSxweHo709HRUVfVNWdbpdKirqxv2gKezsxObNm1izY74+HisX78+4MM2o9GIPXv2sGLDxo0bGTMgpVIp1q9fj48//tjtsIG+qfI1NTUQi8VITk5GVFQU5HI5pFIpzGYzTCYTGhsb0draOuCqNTs7O+jUy2AQi8VYs2YN/va3vxGtiFeuXAmbzcbYZXR0dGDv3r3Iz89HXFwcEhISoFAoIJfLYbPZYDKZoNPpoNVqBxwQnJiYiJ/85Cc3vxjm/IagRmr5UFcGTIwEqE5AGAHE/JlYldFpwabagft/kECDRm2zBrKkEFhoB6KEYVga4n/XTm8uGoz4uIGdQ2YA6LI7MINyov56V77HY8ORLvfv74GxKJ89ezbUajV27NjhE9ft6elBZWVlQP2hJ0yYgBUrVgya+VBWVsYIlYwbN46zLIkZM2a4nTXQF0e+WafxYrEYc+fOxeLFi0e89HmgClGVSoVnnnkG+/btQ2FhIcP52u121NbWorbWv5WPVCrFihUrRmxF7Un/Lubo0aHLlgdCIBBgzZo1SEtLw1dffcWoPqRpGs3NzYyb21BQFIV58+ZhyZIlN//3r9kNNB1mV6dND3TlApHHgdhXAJF/K8OBeK9uD3Q2dnuRX+6pw0rrvaiQNAc1u5FGX6qek+V032M6PebERMElEOCpJP+HZ/v85YwdOxYvvPACjh8/jtOnTwd8GCcQCJCRkYE5c+Zg/PjxQz7Xc8AARVGYO5e8r+xwTJw4EUql0v1+vv/+eyxfvtwndhwREeH3l3AoQkNDkZycjDFjxiA7OzvgAgi5XM7JQehg+d0ikQgrV67EvHnzcOLECZ+e4sMRHh6OefPmYdasWQHH4z1X+iKRiNXKvoULFzKaPYlEooBi6DNnzsSkSZNw9uxZnDp1yl2N6w9isRjTp09HTk4Oa+PuAsJpBi78jhvdmlNA9ANA5BPEKurNrdjeyPKN5DqnGkvwUOY9QU1F39HUgeOdgfcdGQ4HTcNus+C59CSECv0v5afoIU5eXC4XamtrUV1djZaWFrS3t8NoNMJms4GmacjlcshkMoSFhSEhIQFJSUlIT0/3u6S7u7sbbW1tEAqFUKvVg+Zhs4XFYoFOp4PFYoFMJhvwkMfpdAbdK0MmkwUddzcYDGhra2O1iEehUPjdG9zhcECr1eLatWtoaWmByWSC2WyGzWaDTCaDQqGAUqlEUlISRo8ejZiYmKDes8ViAU3TEAqFrIcJbDYbGhoa4HQ63XNDSaBpGq2trbh27Rq0Wi2MRiNMJhMsFgskEok7JBIfH4/U1FQkJSWN7E6KdgCDdK1jBaEMEJIflFtddlhd7Pel6UchlEEURH8So9MFG4eVxiqxKKBUwv8PmEjAsILPF8MAAAAASUVORK5CYII=',
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