import { v4 as uuidv4 } from 'uuid';

const colorArray = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'grey'];
export type todostatus = "pending" | "closed" | "archived" 


function changeColorIcon() {
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    return color;   
}

//M2-Assigment-#6
export interface ITodo {
    name: string;
    description: string;
    status: todostatus;
    date: Date;
    color: string
    id: string
    ui: HTMLDivElement
}

export class Todo implements ITodo {
    list: Todo [] = []
    name: string;
    description: string;
    status: todostatus;
    date: Date;
    color: string
    id: string
    ui: HTMLDivElement

  
  
constructor(container: HTMLDivElement, data: ITodo, date: Date) {
    this.ui = container
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.date = date;
    this.id = uuidv4()
}


    
    setUI(id:string) { 
        if (!this.ui){return}
            const container = this.ui
            const newDiv = document.createElement('div');

        //M2-Assignment Q#9
        newDiv.innerHTML = `
        <div class="toDoElement" style="display: flex; background-color: grey;">
            <h4 name="name-todo" class="T-doHeader">${this.name}</h4>
            <p id="description-todo" name="description-todo">${this.description}</p>
            <div id="date-todo">${this.date}</div>
            <div id="todostatus" name="todostatus">${this.status}</div>
        </div>
        `;
        container.appendChild(newDiv);


    }


}

