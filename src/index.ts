import { Project, IProject, role, status } from "./classes/Project"
import { ProjectManager } from "./classes/ProjectManager"
import { closeModal, showModal, toggleModal, } from "./classes/Modal"
import { Todo, ITodo, todostatus } from "./classes/TodoClass"
import { v4 as uuidv4 } from 'uuid';
import { reduceVertices } from "three/examples/jsm/utils/SceneUtils.js";


const projectlistUI = document.getElementById("project-list") as HTMLDivElement
const projectManager = new ProjectManager(projectlistUI)



// KLickar på knappen "New Project" och skapar en ny div med klassen "project" 
const newProjectBtn= document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
    console.warn("No new project button found")
}


const projectPage = document.getElementById("project-page") as HTMLDivElement;
const homePageButton = document.getElementById("homebtn") as HTMLButtonElement;
const todoDiv = document.getElementById("To-dolist") as HTMLDivElement;

if (homePageButton) {
    homePageButton.addEventListener("click", () => {
        projectPage.style.display = "flex";
        todoDiv.style.display = "none";
       
    });
}



const projectForm = document.getElementById("new-project-form")

if(projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (event) => {
        event.preventDefault() // förhindrar att sidan laddas om
        const formData = new FormData(projectForm) // skapar en ny instans av FormData
        const projectProperty: IProject = { // skapar en ny variabel med objektet
            description: formData.get("description") as string, // hämtar värdet från inputfälten
            name: formData.get("name") as string,  // hämtar värdet från inputfälten
            role: formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            status: formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            date: new Date (formData.get("date") as string), //
        }
        //M2-Assignment Q#4
        if(!projectForm.date.value) {
            projectForm.date.value = "2024-03-14"
        }
        

try {

    const project = projectManager.newProject(projectProperty) // skapar en ny variabel som är av typen projectManager och kallar på metoden newProject
   // nameLength()
    projectForm.reset() // rensar inputfälten
    toggleModal ("new-project-modal")
    console.log(project)

    } catch (error) {
       const errorElement = document.getElementById("pop-up-modal") as HTMLElement
        //errorElement.innerHTML  // skapar en ny div med innehåll enligt "pop-up-modal elementet"
        errorElement.style.display = "flex"; // Visar elementet som normalt är dolt
        const closeBtnPopup = document.getElementById("close-pop-up-btn")
        
        if (closeBtnPopup) {
          closeBtnPopup.addEventListener("click", () => {
          errorElement.style.display = "none"; // släcker ner elementet
        });

        }
    }
}) //end of eventlistener

const closeBtn = document.getElementById("close-btn") as HTMLButtonElement
closeBtn.addEventListener("click", (event) => {closeModal("new-project-modal")})   
closeModal("new-project-modal")
console.log(closeBtn)


}   else {
    console.warn("No project form found")
}

//M2-Assignment Q#7
const exportBtn = document.getElementById("export-btn")
if(exportBtn)  {
    exportBtn.addEventListener("click", () => {
        projectManager.exportToJSON();
  })
}



const importBtn = document.getElementById("import-btn")
if(importBtn)  {
    importBtn.addEventListener("click", () => {
        projectManager.importJSON()
    })
}


const editbtn= document.getElementById("edit-button")
if (editbtn) {
    editbtn.addEventListener("click", () => {showModal("edit-project-modal")})
} else {
    console.warn("No new project button found")
}

//M2-Assignment Q#5
const editForm = document.getElementById("edit-project-form") as HTMLFormElement
if (editForm instanceof HTMLFormElement) {
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        /* const projectID =  projectManager.id */
        const projectToUpdate = projectManager.getProject(projectManager.id)

        if(projectToUpdate) {
            projectToUpdate.description = formData.get("description") as string,
            projectToUpdate.name = formData.get("name") as string,  // hämtar värdet från inputfälten
            projectToUpdate.role = formData.get("role") as role,// hämtar värdet från inputfälten och giltigöra att det är av typen role
            projectToUpdate.status= formData.get("status") as status, // hämtar värdet från inputfälten och giltigöra att det är av typen status
            projectToUpdate.date = new Date (formData.get("date") as string) //
        }
        
        try {
            if (projectToUpdate) {
                projectManager.setDetailsPage(projectToUpdate, projectManager.id); // Call the setDetailsPage method with the project and project.id
                projectToUpdate.setUI()
                editForm.reset(); // Reset the input fields
                toggleModal("edit-project-modal");
                console.log(projectToUpdate);        
            }
        } catch (error) {
            // Handle the error
        }

        const errorElement = document.getElementById("pop-up-modal") as HTMLElement
        errorElement.style.display = "flex"; // Visar elementet som normalt är dolt

        const closeBtnPopup = document.getElementById("close-pop-up-btn")
        if (closeBtnPopup) {
            closeBtnPopup.addEventListener("click", () => {
                errorElement.style.display = "none"; // släcker ner elementet
            });
        }

    })
};

const closeBtn = document.getElementById("edit-close-btn") as HTMLButtonElement
closeBtn.addEventListener("click", (event) => {closeModal("edit-project-modal")})   
closeModal("edit-project-modal")
console.log(closeBtn)






//M2-Assigment-Q#6 ADD TODO
const addTodo= document.getElementById("addTodo") as HTMLButtonElement
if (addTodo) {
    addTodo.addEventListener("click", () => {showModal("T-Do-project-modal")})
} else {
    console.warn("No new project button found")
}
//M2-Assigment-Q#6
const todDoForm = document.getElementById("T-Do-project-form") as HTMLFormElement
todDoForm.addEventListener("submit", (e) => {
    e.preventDefault();

const formData = new FormData(todDoForm);
const todoData: ITodo = {
    id: uuidv4(),
    name: formData.get("name-todo") as string,
    description: formData.get("description-todo") as string,
    status: formData.get("Todostatus") as todostatus,
    date : new Date(formData.get("date") as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}
    const toDoListDiv = document.querySelector(".dashboard-card-todo") as HTMLDivElement
    const toDoObject = new Todo(toDoListDiv, todoData, todoData.date)
    
    if (todoData.status) {;
        const todoDiv = document.getElementById("todostatus") as HTMLDivElement;
        if(todoDiv && todoData.status === "pending") {
            todoDiv.style.backgroundColor = "green"
        }
        if(todoDiv && todoData.status === "closed") {
            todoDiv.style.backgroundColor = "red"
        }
    } try {
        toDoObject.setUI(toDoObject.id)
        console.log("created")
    } catch {
        console.log("warning")
    }
    closeModal("T-Do-project-modal")
    todDoForm.reset();
    console.log(toDoObject)
}
 
)


/*     if(todDoForm instanceof HTMLFormElement ) {

        todDoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(todDoForm);

    
        
        // querySelect the div with class "To-dolist" 
        //Create new aa div Element
        if (toDoListDiv) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `
            <div class="Todolist" id="todo-list" style="display: flex";>
                <h4 name="name-todo" class="T-doHeader">${todoData.name}</h4>
                <p id="description-todo" name="description-todo">${todoData.description}</p>
            <div id="date-todo">${todoData.date}</div>
            <div id="date-todo">${todoData.status}</div>
            </div>
            ` ;
            newDiv.style.display = "flex"; 
            // colorChangeStatus(todoData.status as status, toDoListDivElement )
            // qeuerySelect the container within the .dashboard-card div to which you want to append the new div
            const container = document.querySelector(".dashboard-card-todo");
            // Append the new div to the container
            if (container) {
                container.appendChild(newDiv);
            } 
            //M2-Assigment-Q#9
            if (todoData.status === "pending") {
                newDiv.style.backgroundColor = "yellow";
                newDiv.style.color = "black";
            } else if (todoData.status === "closed") { 
                newDiv.style.backgroundColor = "red";
            } else if (todoData.status === "archived") { 
                newDiv.style.backgroundColor = "red";
            } else {
                newDiv.style.color = "white";
            }
            
            
            
            
        }
        
        // Toggle the modal
        toggleModal("T-Do-project-modal");
        todDoForm.reset();

        //Using the addtodoproject to push it to an array property in Project Class
        const todo = todoData;
        const todoID = todoData.id ;
        const project = projectManager.id;
        const projectToUpdate = projectManager.getProject(project);
        
        const editTodoBtn = document.getElementById("editTodbtn") as HTMLButtonElement;
        const edittodoForm = document.getElementById("edittodoform") as HTMLFormElement;  
        
        if (edittodoForm instanceof HTMLFormElement) {
        editTodoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            const todoToUpdate = projectManager.getProject(todoID);
            console.log(todoToUpdate);

            if(todoToUpdate) {
                todoToUpdate.description = formData.get("description-todo") as string;
                todoToUpdate.name = formData.get("name-todo") as string;
                todoToUpdate.status = formData.get("status") as status;
                todoToUpdate.date = new Date(formData.get("date") as string);
            }
            try {
                if (todoToUpdate) {
                    projectManager.setDetailsPage(todoToUpdate, todoID);
                    todoToUpdate.setUI();
                    edittodoForm.reset();
                    toggleModal("editToDoprojectmodal");
                    console.log(todoToUpdate);
                }

            showModal("editToDoprojectmodal");
        } catch (error) {
            // Handle the error
        }
       
        
        if (projectToUpdate) {
            projectManager.addTodoToProject(todo, project);
            projectToUpdate.setUI();
            console.log(projectToUpdate);
        }
    })
    }
 }
); 
} */