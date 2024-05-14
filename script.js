// Récupération des éléments HTML nécessaires
const todoInput = document.getElementById("todoText");
const todoList = document.getElementById("list-items");
const addTaskBtn = document.getElementById("addTaskBtn");
const deadlineInput = document.getElementById("deadline");
const sortASCBtn = document.getElementById("sortASC");
const sortDESCBtn = document.getElementById("sortDESC");

// Tableau pour stocker les tâches
let tasks = [];

// Fonction pour créer une nouvelle tâche
function createTask() {
    // Récupération du texte de la tâche à partir de l'input
    const taskText = todoInput.value.trim();
    const deadlineValue = deadlineInput.value;

    // Vérification si la tâche et la date d'échéance ne sont pas vides
    if (taskText === "" || deadlineValue === "") {
        // Affichage d'un message d'erreur si le texte ou la date d'échéance sont vides
        showAlert("Veuillez remplir tous les champs.", "error");
        return;
    }

    // Création d'un objet tâche avec un ID unique, le texte, un statut de complétion et une date d'échéance
    const task = {
        id: Date.now(), // ID unique basé sur le timestamp actuel
        text: taskText,
        completed: false,
        deadline: deadlineValue
    };

    // Ajout de la tâche au tableau des tâches
    tasks.push(task);
    renderTasks();

    // Réinitialisation de l'input de la tâche et la date d'échéance
    todoInput.value = "";
    deadlineInput.value = "";

    // Affichage d'un message de succès pour l'ajout de la tâche
    showAlert("Tâche ajoutée avec succès.", "success");
}

// Fonction pour afficher les tâches
function renderTasks() {
    // Réinitialisation du contenu de la liste des tâches
    todoList.innerHTML = "";

    // Boucle sur le tableau des tâches pour les afficher
    tasks.forEach(task => {
        // Création d'un élément de liste pour la tâche
        const taskItem = document.createElement("li");
        taskItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        // Création d'un élément de texte pour le texte de la tâche
        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        // Ajout de la classe "completed" si la tâche est complétée
        if (task.completed) {
            taskText.classList.add("completed");
        }

        // Création d'un élément pour afficher la date d'échéance
        const deadlineText = document.createElement("span");
        deadlineText.classList.add("deadline-text");
        deadlineText.textContent = task.deadline;
        // Ajout de la classe "completed" si la tâche est complétée
        if (task.completed) {
            deadlineText.classList.add("completed");
        }

        // Création d'un élément de div pour les boutons de la tâche
        const buttonsDiv = document.createElement("div");

        // Création d'un bouton pour marquer la tâche comme terminée
        const completeBtn = document.createElement("button");
        completeBtn.classList.add("btn", "btn-outline-secondary", "complete-btn");
        completeBtn.textContent = task.completed ? "Terminé" : "Terminer";
        if (task.completed) {
            completeBtn.classList.add("btn-secondary"); // Ajout d'une classe pour les tâches terminées
            completeBtn.style.color = "white";
        } else {
            completeBtn.classList.add("btn-outline"); // Ajout d'une classe pour les tâches non terminées
        }
        completeBtn.addEventListener("click", () => toggleTaskCompletion(task.id));

        // Création d'un bouton pour supprimer la tâche
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-outline-danger", "delete-btn");
        deleteBtn.textContent = "Supprimer";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        // Ajout des boutons à la division des boutons
        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(deleteBtn);

        // Ajout du texte de la tâche et de la date d'échéance ainsi que des boutons à l'élément de liste
        taskItem.appendChild(taskText);
        taskItem.appendChild(deadlineText); // Ajout de la date d'échéance
        taskItem.appendChild(buttonsDiv);

        // Ajout de l'élément de liste à la liste des tâches
        todoList.appendChild(taskItem);
    });
}


// Fonction pour marquer une tâche comme terminée ou non terminée
function toggleTaskCompletion(taskId) {
    // Recherche de l'index de la tâche dans le tableau des tâches
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    // Toggle du statut de complétion de la tâche
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    // Mise à jour de l'affichage des tâches
    renderTasks();
}

// Fonction pour supprimer une tâche
function deleteTask(taskId) {
    // Filtrage du tableau des tâches pour supprimer la tâche correspondante
    tasks = tasks.filter(task => task.id !== taskId);
    // Mise à jour de l'affichage des tâches
    renderTasks();
}

// Fonction pour afficher une alerte avec SweetAlert
function showAlert(message, type) {
    // Configuration de l'alerte avec SweetAlert
    Swal.fire({
        icon: type,
        text: message,
        timer: 2100,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false
    });
}


// Ajout d'un écouteur d'événement pour l'ajout de tâches lorsque le bouton "Ajouter tâche" est cliqué
addTaskBtn.addEventListener("click", createTask);

// Ajout d'un écouteur d'événement pour le tri par croissance
sortASCBtn.addEventListener("click", sortTasksByDeadlineASC);

// Ajout d'un écouteur d'événement pour le tri par décroissance
sortDESCBtn.addEventListener("click", sortTasksByDeadlineDESC);

// Fonction pour trier les tâches par date d'échéance dans l'ordre croissant
function sortTasksByDeadlineASC() {
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    renderTasks();
}

// Fonction pour trier les tâches par date d'échéance dans l'ordre décroissant
function sortTasksByDeadlineDESC() {
    tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    renderTasks();
}

// Sauvegarde des tâches dans le stockage local chaque fois que les tâches sont mises à jour
window.addEventListener("beforeunload", () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
});

// Récupération de la tâche enregistrée dans le stockage local ou un tableau vide si aucune tâche n'est trouvée
tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Affichage des tâches lors du chargement de la page
renderTasks();