console.log("detail is working");

const backBtn = document.getElementById("back-btn")
const postBox = document.getElementById("post-box")
const updateBtn = document.getElementById("update-btn")
const deleteBtn = document.getElementById("delete-btn")
const url = window.location.href + "data/"
const spinnerBox = document.getElementById("spinner-box")
backBtn.addEventListener("click",  () => {
    history.back()
})

const csrf = document.getElementsByName("csrfmiddlewaretoken")

const alertBox = document.getElementById("alert-box")
// update

const titleInput = document.getElementById("id_title")
const bodyInput = document.getElementById("id_body")

const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

const updateForm = document.getElementById("update-form")

const deleteForm = document.getElementById("delete-form")

$.ajax({
    type : "GET",
    url : url,
    success : function(res){
        console.log(res);
        spinnerBox.classList.add("not-visible")

        const data = res.data
        if(data.logged_in !== data.author){
            console.log("not");
        }else{
            console.log("ok");
            updateBtn.classList.remove("not-visible")
            deleteBtn.classList.remove("not-visible")
        }

        const titleElement = document.createElement("h3")
        titleElement.setAttribute("class", "mt-3")

        titleElement.setAttribute("id", "title")

        const bodyElement = document.createElement("p")
        bodyElement.setAttribute("class", "mt-1")

        bodyElement.setAttribute("id", "body")

        titleElement.textContent = data.title
        bodyElement.textContent = data.body

        postBox.appendChild(titleElement)
        postBox.appendChild(bodyElement)

        titleInput.value = data.title
        bodyInput.value = data.body

    },
    error : function(err){
        console.log(err);
    }
})



updateForm.addEventListener("submit", e => {
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById("body")
    $.ajax({
        type : "POST",
        url : updateUrl,
        data : {
            'csrfmiddlewaretoken' : csrf[0].value,
            'title' : titleInput.value,
            'body' : bodyInput.value
        },
        success : function(res){
            console.log(res);
            handleAlerts("success", "post has been updated successfully ")
            title.textContent = res.title
            body.textContent = res.body
        },
        error : function(err){
            console.log(err);
        }
    })
})


deleteForm.addEventListener("submit", e => {
    e.preventDefault()

    $.ajax({
        type : "POST",
        url : deleteUrl,
        data : {
            'csrfmiddlewaretoken' : csrf[0].value,
        },
        success : function(res){
            window.location.href = window.location.origin
            localStorage.setItem("title", titleInput.value)
        },
        error : function(err){
            console.log(err);
        }
    })
})