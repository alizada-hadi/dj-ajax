const postsBox = document.getElementById("posts-box")
const spinner = document.getElementById("spinner")

const loadMore = document.getElementById("load-btn")

const endBox = document.getElementById("end-box")

const postForm = document.getElementById("post-form")
const title = document.getElementById("id_title")
const body = document.getElementById("id_body")

const csrf = document.getElementsByName("csrfmiddlewaretoken")

const alertBox = document.getElementById("alert-box")

const url = window.location.href

const deleted = localStorage.getItem("title")

if(deleted){
    handleAlerts("danger", `deleted ${deleted}`)
    localStorage.clear()
}


const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id');

        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        console.log(clickedBtn);

        $.ajax({
            type : "POST",
            url : "/like-unlike/",
            data : {
                "csrfmiddlewaretoken" : csrftoken,
                "pk" : clickedId,
            },
            success : function(res){
                console.log(res);
                clickedBtn.textContent = res.liked ? `Unlike (${res.count})` : `Like (${res.count})`
            },
            error : function(err){
                console.log(err);
            }
        })
    }))
}

let visible = 3

const getData = () => {
    $.ajax({
        type : "GET",
        url :`/data/${visible}/`,
        success  : function(res){
            const data =  res.data
            setTimeout(()=>{
                spinner.classList.add("not-visible")
            }, 1000)
            data.forEach(element => {
                postsBox.innerHTML += `
                    <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.body}</p>
                        </div>
                        <div class="card-footer">
                        <div class="row">
                            <div class="col-lg-1">
                             <a href="${url}${element.id}" class="btn btn-primary">Detail</a>
                            </div>
                            <div class="col-lg-2">
                            <form class="like-unlike-forms" data-form-id="${element.id}"> 
                            <button class="btn btn-info" id="like-unlike-${element.id}">
                             ${element.liked ?  `Unlike (${element.count})` : `Like (${element.count})`}
                             </button>
                             </form>
                            </div>
                        </div>
                        </div>
                    </div>
                `
            likeUnlikePosts()
            }, 100);

            console.log(res.size);
            if(res.size === 0){
                endBox.textContent = 'No posts yet...'
            }
            else if(res.size <= visible){
                loadMore.classList.add('not-visible')
                endBox.textContent = 'No more post to load'
            }
        },
        error : function(error){
            console.log(error);
        }
    })
    
}




loadMore.addEventListener('click',  () => {
    spinner.classList.remove('not-visible')
    visible += 1
    getData()
})

postForm.addEventListener("submit", e => {
    e.preventDefault()
    $.ajax({
        type : "POST",
        url : "",
        data : {
            'csrfmiddlewaretoken' : csrf[0].value,
            title : title.value,
            body : body.value
        },
        success : function(res){
            console.log(res);
            postsBox.insertAdjacentHTML('afterbegin', `
            <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${res.title}</h5>
                        <p class="card-text">${res.body}</p>
                        </div>
                        <div class="card-footer">
                        <div class="row">
                            <div class="col-lg-1">
                             <a href="#" class="btn btn-primary">Detail</a>
                            </div>
                            <div class="col-lg-2">
                            <form class="like-unlike-forms" data-form-id="${res.id}"> 
                            <button class="btn btn-info" id="like-unlike-${res.id}">
                             Like
                             </button>
                             </form>
                            </div>
                        </div>
                        </div>
                    </div>
            `)
            likeUnlikePosts()
            $("#addPostModal").modal('hide')
            handleAlerts('success', 'New Post added successfully ')
            postForm.reset()
        },
        error : function(error){
            console.log(error);
            handleAlerts('danger',  'oops, something went wrong please try again!')
        }

    })
})

getData()