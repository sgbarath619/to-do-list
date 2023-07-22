class AddList{
    constructor(){
        this.addItemCounter = 0;
        this.addItem();
    }

    addItem(st=""){
        let addItemsContainer = document.getElementById("addItemsContainer");
        let newItem = document.createElement('div');
        newItem.classList.add("itemsInputDiv");
        this.addItemCounter++;
        newItem.innerHTML = `
            <span class="item_index_count">${this.addItemCounter}</span>
            <textarea class="form-control" placeholder="Type item no. ${this.addItemCounter} here" style="height:1rem">${st}</textarea>
            <button class="btn btn-secondary" style="height: 38px; margin: 0px 5px 0px 10px;" id="removeItem_${this.addItemCounter}" onclick="addList.removeItem()" style="font-size: 20px; font-weight: bold;">-</button>
            ` ;
        addItemsContainer.appendChild(newItem);
    }

    removeItem(){
        if(this.addItemCounter==1)return;

        let addItemsContainer = document.getElementById("addItemsContainer");
        addItemsContainer.removeChild(event.target.parentNode);

        this.addItemCounter--;
        let items = document.querySelectorAll('.itemsInputDiv');
        console.log(items);
        items.forEach((element,index)=>{
            element.querySelector('span').innerHTML = `${index+1}`;
            element.querySelector('textarea').placeholder=`Type item no. ${index+1} here`;
            element.querySelector('button').id=`removeItem_${index+1}`;
        });
    }

    addList(){
        let titleElement = document.getElementById("listTitle");
        let itemsElement = document.getElementsByClassName("itemsInputDiv");
        let items = Array.from(itemsElement)
                    .flatMap(element => element.querySelector('textarea').value.trim()); 

        // console.log(items);
        let tagsElement = document.getElementById("addTags");
        let priority = document.getElementById("addPriority");
        let category = document.getElementById("addCategory");
        let tagsArray = tagsElement.value.split(',').map(tag => tag.trim());
        tagsArray = tagsArray.filter(tag => tag !== '');
        let deadline = document.getElementById("addDeadline");

        if(titleElement.value.trim()=="")titleElement.value="(none)";
        let list = {
            title: titleElement.value.trim(),
            items: items,
            priority: parseInt(priority.value),
            category: category.value.trim(),
            tags: tagsArray,
            deadline: deadline.value
        };
        
        let storageArray=[];
        let storage = localStorage.getItem("lists");
        if(storage!=null) storageArray=JSON.parse(storage);

        // console.log(list);
        storageArray.push(list);
        localStorage.setItem("lists",JSON.stringify(storageArray));

        titleElement.value="";
        priority.value="3";
        category.value="General";
        tagsElement.value="";
        // deadline.value = (new Date()).toISOString().slice(0, 16);
        deadline.value = "";
        document.getElementById("addItemsContainer").innerHTML="";
        this.addItemCounter = 0;
        this.addItem();

        listShow.listShow();
    }
}

class ListShow{
    listShow(inputArray=null){
        let storageArray=[];
        if(inputArray===null){
            let storage = localStorage.getItem("lists");
            // console.log(storage);
            if(storage!=null) storageArray=JSON.parse(storage);
        }else{
            storageArray=inputArray;
        }

        let html="";
        // for(let list of storageArray)
        for(let index=0;index<storageArray.length;index++){

            // console.log(storageArray[index]);
                let pri = storageArray[index].priority;
                if(pri==1)pri="High";
                else if(pri==2)pri="Medium";
                else if(pri==3)pri="Low";

            let thisdeadline = new Date(storageArray[index].deadline);
            const currentDate = new Date();
            const tomorrowDate = new Date(currentDate);
            tomorrowDate.setDate(tomorrowDate.getDate()+1);

            html+=` 
            <div id="listCard_${index}" class="card noteCard mx-2 my-2" style="">
                <div class="card-body">
                    <div style="display: flex; justify-content: space-between;">
                        <h5 class="card-title">${storageArray[index].title}</h5>`;
            
            if( thisdeadline > tomorrowDate) {
                html+=`<h5 id="statusofList" style="color: green;">(upcoming)</h5>`;
            } else if( thisdeadline > currentDate) {
                html+=`<h5 id="statusofList" style="color: red;">(due tomorrow)</h5>`;
            } else {
                html+=`<h5 id="statusofList" style="color: black;">(missed)</h5>`;
                
            }
            html+=`</div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="max-width:50%; padding-bottom: 10px; word-wrap: break-word;" >
                            <p class="card-text" style="margin: 0px;">Category: ${storageArray[index].category}</p>
                            <p class="card-text" style="margin: 0px;">Tags: <span>`;
            html+=storageArray[index].tags.join(', ');
            html+=`</span></p>
                        </div>
                        <div style="padding-bottom: 10px; text-align: right;" >
                            <p class="card-text" style="margin: 0px;">Priority: ${pri}</p>
                            <p class="card-text" style="margin: 0px; text-align:left;">Deadline: </p>
                            <p class="card-text" style="margin: 0px;">${this.formatDateTime(storageArray[index].deadline)}</p>
                        </div>
                    </div>

                    <div style="padding-bottom: 50px" >`;

            for(let i=0;i< storageArray[index].items.length;i++){
                html+=`<p class="card-text"><input class="form-check-input strikeCheck" type="checkbox" onclick="listShow.strike()"><span style="width:3rem">${i+1}.</span>  <span id="spanofItems">${storageArray[index].items[i]} </span></p>`
            }

            html+=`
            </div>
            <div class="threeButtons">
                <button id="markasDone" href="#" class="btn btn-success" onclick="listShow.markasDone(${index})"  style="display:inline">Mark as Done</button>
                <button id="markasUndone" href="#" class="btn btn-danger" onclick="listShow.markasUndone(${index})" style="display:none">Mark as Undone</button>
                <button href="#" class="btn btn-primary" onclick="listShow.editList(${index})" >Edit</button>
                <button href="#" class="btn btn-primary btn-danger" 
                        onclick="listShow.deleteList(${index})">Delete</button>
            </div>
            </div>
            </div> `;
        }

        document.getElementById("listCardsContainer").innerHTML = html;
    }
    strike(){
        if(event.target.checked){
            event.target.parentNode.style = "text-decoration: line-through; color: grey";
        }else{
            event.target.parentNode.style = "";
        }
    }
    markasDone(i){
        let listCard = document.getElementById(`listCard_${i}`);
        listCard.style = "color:gray!important; text-decoration: line-through;"

        let markUndone = event.target.parentNode.querySelector("#markasUndone");
        event.target.style="display:none";
        markUndone.style="display:inline";
        event.target.parentNode.parentNode.querySelector("#statusofList").style.display="none";
    }
    markasUndone(i){
        let listCard = document.getElementById(`listCard_${i}`);
        listCard.style = "color:black!important;"

        let markDone = event.target.parentNode.querySelector("#markasDone");
        event.target.style="display:none";
        markDone.style="display:inline";
        event.target.parentNode.parentNode.querySelector("#statusofList").style.display="inline";
    }
    editList(i){
        let storageArray=[];
        let storage = localStorage.getItem("lists");
        if(storage!=null) storageArray=JSON.parse(storage);

        let titleElement = document.getElementById("listTitle");
        titleElement.value=storageArray[i].title;
        
        let priority = document.getElementById("addPriority");
        priority.value=storageArray[i].priority;

        let category = document.getElementById("addCategory");
        category.value=storageArray[i].category;

        let tagsElement = document.getElementById("addTags");
        tagsElement.value = storageArray[i].tags.join(', ');

        let deadline = document.getElementById("addDeadline");
        deadline.value=storageArray[i].deadline;

        document.getElementById("addItemsContainer").innerHTML="";
        addList.addItemCounter=0;
        for(let item of storageArray[i].items)
            addList.addItem(item);
        
        this.deleteList(i);
        this.listShow();
    }
    deleteList(i){
        // event.target.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode);
        let storageArray=[];
        let storage = localStorage.getItem("lists");
        if(storage!=null) storageArray=JSON.parse(storage);
        storageArray.splice(i,1);
        localStorage.setItem("lists",JSON.stringify(storageArray));
        this.listShow();
    }

    formatDateTime(dateVal) {
        var newDate = new Date(dateVal);

        // console.log(newDate);
    
        function padValue(value) {
            return (value < 10) ? "0" + value : value;
        }

        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = padValue(newDate.getMinutes());
        var sAMPM = "AM";
    
        var iHourCheck = parseInt(sHour);
    
        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }
    
        sHour = padValue(sHour);
    
        return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
    }
    
}


class Filter{
    clear(){
        listShow.listShow();
    }
    filter(){
        let filterbyCategory = document.getElementById("filterbyCategory").value.trim().toLowerCase();
        let filterbyDeadlineFrom = new Date(document.getElementById("filterbyDeadlineFrom").value);
        let filterbyDeadlineTo = new Date(document.getElementById("filterbyDeadlineTo").value);
        let filterbyPriority = parseInt(document.getElementById("filterbyPriority").value);
        let sortBy = document.getElementById("sortBy").value;

        let storageArray=[];
        let storage = localStorage.getItem("lists");
        if(storage!=null) storageArray=JSON.parse(storage);

        let filteredData = storageArray.filter(list => {
            let f1,f2,f3;

            if(filterbyCategory==="") f1=true;
            else f1 = list.category.toLowerCase().includes(filterbyCategory);

            if ( Object.prototype.toString.call(filterbyDeadlineFrom) === "[object Date]" && !isNaN(filterbyDeadlineFrom.getTime()) ){
                f2 = new Date(list.deadline) >= filterbyDeadlineFrom;
            }else f2=true;
            if ( Object.prototype.toString.call(filterbyDeadlineTo) === "[object Date]" && !isNaN(filterbyDeadlineTo.getTime()) ){
                f2 = f2 && new Date(list.deadline) <= filterbyDeadlineTo;
            }

            f3 = filterbyPriority==0 || list.priority === filterbyPriority;

            return f1 && f2 && f3;
        });

        let sortedData = filteredData.sort((a, b) => {
            if (sortBy === "Deadline") {
              return a.deadline > b.deadline;
            } else if (sortBy === "Priority") {
              return a.priority - b.priority;
            }
        });

        listShow.listShow(sortedData);

    }
}

// run this code in console to populate local storage with values for testing

// const startTestValue = '[{"title":"23","items":["dvavvrrv","ragrgrg","ergergegrg"],"priority":1,"category":"car","tags":["afg","adrg","asrg","g","g","gerg4t5t"],"deadline":"2023-04-07T07:11"},{"title":"t5y875f","items":["the","fthfhgh","cghghtfh","hhrthrh"],"priority":3,"category":"jjj","tags":["5t3","35","66","6","fdgdfg","dfg"],"deadline":"2023-07-29T00:11"},{"title":"rr","items":["text"],"priority":3,"category":"nona","tags":["er","yjtjutk","k","kik"],"deadline":"2023-01-01T01:44"},{"title":"tttthrth","items":["hsgngcbfg"],"priority":2,"category":"check","tags":["tomo","e","erg","erg"],"deadline":"2023-07-24T02:10"},{"title":"as","items":["fsasfgs"],"priority":1,"category":"hhh","tags":["juju"],"deadline":"2023-06-09T00:59"},{"title":"q3y4y4","items":["ywrthsthy","twy4yhe45y4b","ve5ywy5","witty","grg"],"priority":2,"category":"kkk","tags":["4th","afg","g","rw","tuy","i","66"],"deadline":"2023-09-14T00:12"}]';
// localStorage.setItem("lists",startTestValue);

let addList = new AddList();

let listShow = new ListShow();
listShow.listShow();

let filter = new Filter();

let search = document.getElementById("searchTxt");
search.addEventListener("input",function () {
        let lists = document.getElementsByClassName(`noteCard`);
        Array.from(lists).forEach( (list)=> {
            let title = (list.getElementsByClassName("card-title"))[0].innerText;
            let items = list.querySelector('span#spanofItems').parentNode.parentNode.textContent;

            console.log(title);
            console.log(items);
            if (title.includes(search.value) || items.includes(search.value)) {
                list.style.display = "block";
            } else {
                list.style.display = "none";
            }
        });
    });

let searchTags = document.getElementById("searchTags");
searchTags.addEventListener("input",function () {
        let lists = document.getElementsByClassName(`noteCard`);
        Array.from(lists).forEach( (list)=> {
            let tags = list.querySelectorAll('p.card-text')[1].querySelector('span').textContent;
            console.log(tags);
            if (tags.includes(searchTags.value)) {
                list.style.display = "block";
            } else {
                list.style.display = "none";
            }
        });
    });