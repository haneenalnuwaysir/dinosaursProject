    // Create Dino Constructor
    function Dinosaurs(species, weight, height, diet, where, when, fact) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;
    }

    // Fetch dino json array
    const getDinoJson = async () => {
        const dino_json = await fetch("./dino.json");
        console.log('json data = ',dino_json );
        const data = await dino_json.json();
        console.log('data ', data);
        const dinos_array = data.Dinos.map(dinosaurs => {
            let { species, weight, height, diet, where, when, fact } = dinosaurs;
            return new Dinosaurs(species, weight, height, diet, where, when, fact )
        });
        console.log('3',dinos_array );

        generateTile(dinos_array);
    }
    
      

    // Create Dino Object
    const dinosaurs = new Dinosaurs();    

    // Create Human Object
    function Human(name, height, weight, diet) {
        this.species = name;
        this.height = height;
        this.weight = weight;
        this.diet = diet;
    }
    const human = new Human();


    // Use IIFE to get human data from form
    const getHumanData = (function () {
        function getData() {
            human.species = document.querySelector('#name').value;
            human.height= parseInt(document.querySelector('#feet').value) * 12 + parseInt(document.querySelector('#inches').value);
            human.weight= document.querySelector('#weight').value;
            human.diet= document.querySelector('#diet').value.toLowerCase();
        }
        return {
            human: getData,
        }
    })();
    
    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    Dinosaurs.prototype.compareWeight = (fact) => {
        if (dinosaurs.weight > human.weight) {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${dinosaurs.weight - human.weight} lbs heavier than ${human.species}`;
            return dinosaurs.fact;    
        } else {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${human.weight - dinosaurs.weight} lbs  lighter than ${human.species}`;
            return dinosaurs.fact;    
        }
    }
    
    
    // Create Dino Compare Method 2
    Dinosaurs.prototype.compareHeight = (fact) => {
        if (dinosaurs.weight > human.weight) {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${dinosaurs.weight - human.weight} inches taller than ${human.species}`;
            return dinosaurs.fact;    
        } else {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${human.weight - dinosaurs.weight} inches smaller than ${human.species}`;
            return dinosaurs.fact;    
        }
    }
    
    
    // Create Dino Compare Method 3
    Dinosaurs.prototype.compareDiet = (fact) => {
        if (human.diet === dinosaurs.diet) {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${dinosaurs.diet} like ${human.species}`;
            return dinosaurs.fact;    
        } else {
            dinosaurs.fact = `${dinosaurs.species} 
                is ${dinosaurs.diet} but ${human.species} is ${human.diet} `;
            return dinosaurs.fact;    
        }
    }


    
    // Generate Tiles for each Dino in Array
    const generateTile = (dinosaurs_array) => {
        let update_dinosaurs = [];

        // Workaround for a fixed dinos_array length
        const sifter_array = [1,1,1,0,0,0,0];
        // Shuffle sifter array to later use it to randomize compare methods.
        shuffleArray(sifter_array);
        //Getting Pigeon position and adding to sifter_array in order to keep it fact property.
        let pigeon_index = dinosaurs_array.findIndex(dinosaurs => dinosaurs.species === 'Pigeon');
        sifter_array.splice(pigeon_index, 0, 0);

        dinosaurs_array.forEach((dinosaurs_array_item, i) => {

            // Assign fetched array properties to global array properties.
            dinosaurs.species = dinosaurs_array_item.species
            dinosaurs.height = dinosaurs_array_item.height
            dinosaurs.weight = dinosaurs_array_item.weight
            dinosaurs.diet = dinosaurs_array_item.diet
            if (sifter_array[i]) {
                let get_random_number = Math.floor(Math.random() * 3) + 1;
                if (dinosaurs_array_item instanceof Human) {
                    get_random_number = '';
                } 
                switch (get_random_number) {
                    case 1:
                        dinosaurs.compareHeight(dinosaurs_array_item.fact);
                        break;
                    case 2:
                        dinosaurs.compareWeight(dinosaurs_array_item.fact);
                        break;
                    case 3:
                        dinosaurs.compareDiet(dinosaurs_array_item.fact);
                        break;
                    default:
                        break;
                } 
            } else {
                dinosaurs.fact = dinosaurs_array_item.fact;
            }

            update_dinosaurs.push(JSON.parse(JSON.stringify(dinosaurs)));
        });

        // Adding human object in the middle
        update_dinosaurs.splice(4, 0, human);
        update_dinosaurs.forEach((dinosaurs_element) => {
            addTileToDOM(dinosaurs_element);
        });
    }

    /**
    * Shuffles array in place.
    * @param {Array} An array containing the items.
    * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    * Randomize array in-place using Durstenfeld shuffle algorithm 
    * */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    


    // Add tiles to DOM
    const addTileToDOM = (dinosaurs_element) => {
        const grid = document.querySelector('#grid');
        const div = document.createElement("div");
        div.className = "grid-item";
        const h3_node = document.createElement("h3");
        const img_node = document.createElement("img");
        const p_node = document.createElement("p");

        if (dinosaurs_element instanceof Human) {
            img_node.src = "./images/human.png"; 
        } else {
            dinosaurs_element.species = dinosaurs_element.species.toLowerCase();
            img_node.src = `./images/${(dinosaurs_element.species)}.png`;
        } 
        h3_node.textContent = dinosaurs_element.species;
        p_node.textContent = dinosaurs_element.fact;

        div.appendChild(h3_node);
        div.appendChild(img_node);
        div.appendChild(p_node);
        grid.appendChild(div);
    }


   
 // Remove form from screen
 function removeForm() {
    const form = document.querySelector('#dino-compare');
    form.style.display = "none";
  }
 
 
 // On button click, prepare and display infographic
 function compare() {
    // Async call
    getDinoJson();
    // Sync call
    getHumanData.human();
    removeForm();
}
const compare_button = document.querySelector('#btn');
compare_button.addEventListener('click', compare); 
