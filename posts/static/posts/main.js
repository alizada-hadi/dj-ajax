const postsBox = document.getElementById("posts-box")
const spinner = document.getElementById("spinner")


let visible = 1


$.ajax({
    type : "GET",
    url :`/data/${visible}/`,
    success  : function(res){
        const data =  res.data
        setTimeout(()=>{
            spinner.classList.add("not-visible")
        }, 1000)
        console.log(data);
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
                         <a href="#" class="btn btn-primary">Detail</a>
                        </div>
                        <div class="col-lg-1">
                         <a href="#" class="btn btn-info">Like</a>
                        </div>
                    </div>
                    </div>
                </div>
            `
        });
    },
    error : function(error){
        console.log(error);
    }
})